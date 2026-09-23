import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import {GoogleGenAI, Type} from '@google/genai';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.use(express.json());

const angularApp = new AngularNodeAppEngine();

// Server-side Gemini client initialization
const ai = new GoogleGenAI({
  apiKey: process.env['GEMINI_API_KEY'] || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Endpoint to generate easy recipes tailored to available ingredients
 */
app.post('/api/recipes/generate', async (req, res) => {
  try {
    const {
      ingredients = [],
      hasStaples = true,
      maxTime = 30,
      difficulty = 'Fácil',
      dietary = 'Cualquiera',
      mealType = 'Cualquiera',
    } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        error: 'Por favor proporciona al menos un ingrediente disponible.',
      });
    }

    if (!process.env['GEMINI_API_KEY']) {
      return res.status(503).json({
        error: 'El servicio de IA no tiene configurada la clave GEMINI_API_KEY.',
      });
    }

    const ingredientsList = ingredients.join(', ');
    const staplesText = hasStaples
      ? 'El usuario cuenta con básicos de cocina como sal, pimienta, aceite (oliva o vegetal) y agua.'
      : 'El usuario NO cuenta con básicos asumidos; usa estrictamente lo que tiene.';

    const prompt = `Actúa como un chef profesional experto en cocina casera fácil, práctica, económica y deliciosa.
El usuario tiene en su cocina ÚNICAMENTE los siguientes ingredientes:
${ingredientsList}.
${staplesText}
Restricciones del usuario:
- Tiempo máximo aproximado: ${maxTime} minutos.
- Nivel de dificultad deseado: ${difficulty}.
- Preferencia dietética: ${dietary}.
- Momento de la comida: ${mealType}.

Genera exactamente 2 recetas deliciosas, fáciles de hacer, con pasos muy claros, sin tecnicismos complicados, pensadas para aprovechar al máximo sus ingredientes.
Cada receta debe indicar:
1. Nombre llamativo y apetitoso.
2. Breve descripción (1-2 frases).
3. Tiempo total en minutos (menor o igual a ${maxTime} si es posible).
4. Dificultad ("Muy fácil", "Fácil" o "Media").
5. Número de porciones (típicamente 2).
6. Lista completa de ingredientes con cantidades para 2 porciones y si es un ingrediente que el usuario ya tiene o es un básico opcional.
7. Pasos de preparación ordenados, detallados y numerados. Si un paso requiere tiempo de cocción, indica los minutos aproximados.
8. Consejos del chef (trucos prácticos para que quede perfecto o sustituciones sencillas).
9. Etiquetas descriptivas (ej: "Sin horno", "Económico", "En una sola sartén").

Responde ÚNICAMENTE con un JSON válido respetando el esquema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Eres un asistente culinario amable, conciso y preciso que ayuda a cocinar platos fáciles y deliciosos con lo que hay en casa. Respondes siempre en español con JSON estructurado.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  totalTimeMinutes: { type: Type.NUMBER },
                  prepTimeMinutes: { type: Type.NUMBER },
                  cookTimeMinutes: { type: Type.NUMBER },
                  difficulty: { type: Type.STRING },
                  servings: { type: Type.NUMBER },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  ingredients: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        amount: { type: Type.STRING },
                        isUserIngredient: { type: Type.BOOLEAN },
                        isOptional: { type: Type.BOOLEAN },
                      },
                      required: ['name', 'amount', 'isUserIngredient'],
                    },
                  },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stepNumber: { type: Type.NUMBER },
                        instruction: { type: Type.STRING },
                        durationMinutes: { type: Type.NUMBER },
                        tip: { type: Type.STRING },
                      },
                      required: ['stepNumber', 'instruction'],
                    },
                  },
                  chefTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  'id',
                  'title',
                  'description',
                  'totalTimeMinutes',
                  'difficulty',
                  'servings',
                  'ingredients',
                  'steps',
                ],
              },
            },
          },
          required: ['recipes'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No se recibió texto del modelo');
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error generando recetas con Gemini:', error);
    return res.status(500).json({
      error: 'No se pudieron generar las recetas en este momento.',
      details: errorMsg,
    });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
