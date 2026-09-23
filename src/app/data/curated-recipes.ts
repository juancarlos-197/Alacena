import { IngredientCategory, Recipe } from '../models/recipe.model';

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  {
    name: 'Verduras & Frescos',
    icon: 'eco',
    items: [
      'Tomate',
      'Cebolla',
      'Ajo',
      'Patata',
      'Espinacas',
      'Zanahoria',
      'Calabacín',
      'Pimiento',
      'Aguacate',
      'Limón',
    ],
  },
  {
    name: 'Proteínas & Lácteos',
    icon: 'egg',
    items: [
      'Huevos',
      'Pechuga de pollo',
      'Atún en lata',
      'Queso rallado',
      'Queso fresco',
      'Leche',
      'Yogur natural',
      'Mantequilla',
    ],
  },
  {
    name: 'Despensa & Granos',
    icon: 'kitchen',
    items: [
      'Arroz',
      'Pasta / Espaguetis',
      'Pan / Tostadas',
      'Garbanzos cocidos',
      'Lentejas cocidas',
      'Tortillas de maíz/trigo',
      'Harina',
      'Avena',
    ],
  },
  {
    name: 'Hierbas & Toques',
    icon: 'local_florist',
    items: [
      'Perejil',
      'Albahaca',
      'Orégano',
      'Salsa de soja',
      'Pimentón',
      'Miel',
    ],
  },
];

export const CURATED_RECIPES: Recipe[] = [
  {
    id: 'pasta-aglio-olio',
    title: 'Espaguetis al Ajo, Aceite y Perejil',
    description:
      'Un clásico italiano minimalista: pasta al dente aromatizada con láminas de ajo dorado en aceite de oliva virgen y perejil fresco.',
    imageUrl: '/assets/images/dish_quick_pasta_1790137880686.jpg',
    totalTimeMinutes: 15,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    difficulty: 'Muy fácil',
    servings: 2,
    tags: ['Rápido', 'Económico', 'Vegetariano', 'Menos de 15 min'],
    category: 'Almuerzo / Cena',
    ingredients: [
      { name: 'Pasta / Espaguetis', amount: '200g', baseQuantity: 200, unit: 'g' },
      { name: 'Ajo', amount: '4 dientes', baseQuantity: 4, unit: 'dientes' },
      { name: 'Perejil', amount: '1 puñado fresco', isOptional: true },
      { name: 'Aceite de oliva', amount: '4 cucharadas (básico)' },
      { name: 'Sal', amount: 'Al gusto (básico)' },
      { name: 'Pimienta o guindilla', amount: '1 pizca (opcional)', isOptional: true },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction:
          'Pon a hervir abundante agua con una cucharada de sal en una olla. Cuando rompa a hervir, añade la pasta y cocina según el tiempo del paquete (unos 8-10 min para que quede al dente).',
        durationMinutes: 9,
        tip: 'Reserva medio vaso del agua de cocción antes de escurrir; ayudará a ligar la salsa.',
      },
      {
        stepNumber: 2,
        instruction:
          'Mientras hierve la pasta, pela los dientes de ajo y córtalos en láminas finas. Pica el perejil fresco.',
        durationMinutes: 3,
        tip: 'Quita el germen central del ajo si quieres un sabor más suave.',
      },
      {
        stepNumber: 3,
        instruction:
          'En una sartén amplia a fuego medio-bajo, vierte el aceite de oliva y los ajos laminados. Cocina despacio hasta que comiencen a dorarse sin quemarse.',
        durationMinutes: 4,
        tip: 'El fuego debe estar suave; si el ajo se quema, amarga.',
      },
      {
        stepNumber: 4,
        instruction:
          'Escurre la pasta e incorpórala directamente a la sartén con el ajo. Añade 2 o 3 cucharadas del agua de cocción reservada, el perejil picado y saltea 1 minuto a fuego vivo para emulsionar.',
        durationMinutes: 1,
        tip: 'Mueve enérgicamente la sartén para lograr una salsa brillante y sedosa.',
      },
    ],
    chefTips: [
      'Si tienes un poco de queso rallado en la nevera, agrégalo al final para un toque extra cremoso.',
      'Puedes sustituir el perejil por orégano seco o albahaca.',
    ],
  },
  {
    id: 'tortilla-patatas-rapida',
    title: 'Tortilla de Patata y Cebolla en Sartén',
    description:
      'La reina de la cocina casera española: jugosa, dorada por fuera y suave por dentro con ingredientes que todos tenemos.',
    imageUrl: '/assets/images/dish_rustic_skillet_1790137892853.jpg',
    totalTimeMinutes: 25,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    difficulty: 'Fácil',
    servings: 2,
    tags: ['Sin gluten', 'Vegetariano', 'Tradicional', 'Sartén'],
    category: 'Almuerzo / Cena',
    ingredients: [
      { name: 'Huevos', amount: '4 unidades', baseQuantity: 4, unit: 'unidades' },
      { name: 'Patata', amount: '2 medianas', baseQuantity: 2, unit: 'medianas' },
      { name: 'Cebolla', amount: '1/2 unidad', baseQuantity: 0.5, unit: 'unidad', isOptional: true },
      { name: 'Aceite de oliva', amount: 'Para pochar (básico)' },
      { name: 'Sal', amount: '1 cucharadita (básico)' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction:
          'Pela las patatas y córtalas en láminas finas e irregulares. Pica la media cebolla en juliana fina.',
        durationMinutes: 5,
        tip: 'Cortar las patatas delgadas acelera muchísimo la cocción.',
      },
      {
        stepNumber: 2,
        instruction:
          'Calienta abundante aceite en una sartén a fuego medio. Añade las patatas y la cebolla con una pizca de sal. Cocina tapado durante unos 12-14 minutos, removiendo de vez en cuando hasta que estén tiernas.',
        durationMinutes: 13,
        tip: 'Queremos pochar la patata, no freírla crujiente.',
      },
      {
        stepNumber: 3,
        instruction:
          'Bate los 4 huevos en un cuenco con sal. Escurre bien el aceite de las patatas y cebolla y viértelas inmediatamente en el huevo batido. Deja reposar la mezcla 2 minutos.',
        durationMinutes: 2,
        tip: 'El calor residual de la patata hidrata el huevo y la deja mucho más jugosa.',
      },
      {
        stepNumber: 4,
        instruction:
          'En la misma sartén con apenas unas gotas de aceite caliente, vierte la mezcla. Cocina 2 minutos a fuego medio moviendo los bordes. Dale la vuelta con un plato llano y cocina 1-2 minutos más por el otro lado.',
        durationMinutes: 4,
        tip: 'Si te gusta bien cuajada, déjala 1 minuto extra a fuego suave.',
      },
    ],
    chefTips: [
      'Si no tienes cebolla, hazla solo de patatas y huevo.',
      'Truco express: puedes usar patatas cocidas sobrantes o hechas 5 min al microondas.',
    ],
  },
  {
    id: 'bowl-mediterraneo-garbanzos',
    title: 'Bowl Mediterráneo de Garbanzos y Tomate',
    description:
      'Un plato completo, fresco y nutritivo listo en 10 minutos sin necesidad de encender la estufa ni cocinar.',
    imageUrl: '/assets/images/dish_fresh_bowl_1790137905443.jpg',
    totalTimeMinutes: 10,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    difficulty: 'Muy fácil',
    servings: 2,
    tags: ['Sin cocinar', 'Vegano', 'Alto en fibra', 'Rápido'],
    category: 'Almuerzo fresco',
    ingredients: [
      { name: 'Garbanzos cocidos', amount: '1 bote / 400g', baseQuantity: 400, unit: 'g' },
      { name: 'Tomate', amount: '2 medianos', baseQuantity: 2, unit: 'medianos' },
      { name: 'Cebolla', amount: '1/4 unidad', baseQuantity: 0.25, unit: 'unidad' },
      { name: 'Atún en lata', amount: '1 lata (opcional)', isOptional: true },
      { name: 'Aceite de oliva', amount: '2 cucharadas (básico)' },
      { name: 'Limón', amount: 'Zumo de 1/2 limón', isOptional: true },
      { name: 'Sal y orégano', amount: 'Al gusto (básico)' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction:
          'Enjuaga los garbanzos cocidos en un colador bajo agua fría del grifo para retirar el líquido de conservación y escúrrelos bien.',
        durationMinutes: 2,
        tip: 'Secarlos ligeramente ayuda a que el aliño impregne mejor.',
      },
      {
        stepNumber: 2,
        instruction:
          'Corta los tomates en dados pequeños y la cebolla en trocitos muy finos.',
        durationMinutes: 3,
        tip: 'Si la cebolla es muy fuerte, sumérgela en agua fría 5 minutos antes.',
      },
      {
        stepNumber: 3,
        instruction:
          'En un bol grande, mezcla los garbanzos, el tomate, la cebolla y el atún desmenuzado si lo tienes.',
        durationMinutes: 2,
      },
      {
        stepNumber: 4,
        instruction:
          'Aliña con el aceite de oliva, el zumo de limón, sal y orégano o perejil. Mezcla suavemente y sirve.',
        durationMinutes: 1,
        tip: 'Se conserva perfecto en la nevera hasta 2 días para llevar en tupper.',
      },
    ],
    chefTips: [
      'Si tienes aguacate o huevo cocido, añádelo para convertirlo en una comida súper saciante.',
    ],
  },
  {
    id: 'revuelto-tomate-huevo',
    title: 'Huevos Revueltos Jugosos con Tomate y Ajo',
    description:
      'Inspirado en el clásico casero de tomate y huevo: cremoso, reconfortante y hecho en menos de 10 minutos.',
    imageUrl: '/assets/images/dish_rustic_skillet_1790137892853.jpg',
    totalTimeMinutes: 10,
    prepTimeMinutes: 3,
    cookTimeMinutes: 7,
    difficulty: 'Muy fácil',
    servings: 2,
    tags: ['Menos de 10 min', 'Desayuno o Cena', 'Vegetariano', 'Proteico'],
    category: 'Cena rápida',
    ingredients: [
      { name: 'Huevos', amount: '4 unidades', baseQuantity: 4, unit: 'unidades' },
      { name: 'Tomate', amount: '2 maduros', baseQuantity: 2, unit: 'maduros' },
      { name: 'Ajo', amount: '1 diente', baseQuantity: 1, unit: 'diente' },
      { name: 'Pan / Tostadas', amount: '4 rebanadas', baseQuantity: 4, unit: 'rebanadas', isOptional: true },
      { name: 'Aceite de oliva', amount: '1 cucharada (básico)' },
      { name: 'Sal y pimienta', amount: 'Al gusto (básico)' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction:
          'Ralla o pica finamente los tomates maduros. Pica el diente de ajo bien pequeño.',
        durationMinutes: 2,
      },
      {
        stepNumber: 2,
        instruction:
          'Calienta la cucharada de aceite en una sartén. Agrega el ajo 30 segundos y luego añade el tomate rallado con una pizca de sal. Cocina a fuego medio 3 minutos hasta que reduzca el agua.',
        durationMinutes: 3,
        tip: 'Concentrar el tomate intensifica su dulzor natural.',
      },
      {
        stepNumber: 3,
        instruction:
          'Bate los huevos suavemente con sal y pimienta. Baja el fuego al mínimo y viértelos sobre el tomate en la sartén.',
        durationMinutes: 1,
      },
      {
        stepNumber: 4,
        instruction:
          'Remueve con una espátula suavemente haciendo movimientos envolventes durante 1-2 minutos. Retira del fuego cuando el huevo aún esté jugoso y brillante (se terminará de cuajar con el calor residual).',
        durationMinutes: 2,
        tip: 'El secreto de un buen revuelto es no secarlo en la sartén.',
      },
    ],
    chefTips: [
      'Sirve sobre tostadas de pan crujiente frotadas con un toque de ajo si te gusta.',
      'Si tienes queso rallado o feta, espolvoréalo al apagar el fuego.',
    ],
  },
  {
    id: 'arroz-salteado-express',
    title: 'Arroz Salteado Express con Verduras y Atún',
    description:
      'La receta definitiva para aprovechar arroz blanco del día anterior o preparar un almuerzo completo en minutos.',
    imageUrl: '/assets/images/dish_fresh_bowl_1790137905443.jpg',
    totalTimeMinutes: 15,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    difficulty: 'Fácil',
    servings: 2,
    tags: ['Aprovechamiento', 'En una sartén', 'Rápido'],
    category: 'Almuerzo / Cena',
    ingredients: [
      { name: 'Arroz', amount: '1 taza (o 2 tazas cocido)', baseQuantity: 1, unit: 'taza' },
      { name: 'Atún en lata', amount: '1 o 2 latas', baseQuantity: 2, unit: 'latas' },
      { name: 'Zanahoria', amount: '1 unidad rallada', baseQuantity: 1, unit: 'unidad', isOptional: true },
      { name: 'Cebolla', amount: '1/2 unidad', baseQuantity: 0.5, unit: 'unidad' },
      { name: 'Huevos', amount: '1 unidad', baseQuantity: 1, unit: 'unidad', isOptional: true },
      { name: 'Salsa de soja', amount: '1 cucharada (opcional)', isOptional: true },
      { name: 'Aceite de oliva', amount: '2 cucharadas (básico)' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction:
          'Pica la cebolla y ralla la zanahoria. Si el arroz no está cocido, cuécelo en agua con sal 12 min y escúrrelo.',
        durationMinutes: 5,
      },
      {
        stepNumber: 2,
        instruction:
          'En una sartén grande a fuego medio-alto con aceite, saltea la cebolla y zanahoria 3-4 minutos hasta que comiencen a dorarse.',
        durationMinutes: 4,
      },
      {
        stepNumber: 3,
        instruction:
          'Empuja las verduras a un lado de la sartén, rompe el huevo en el espacio libre y revuélvelo rápidamente hasta que cuaje.',
        durationMinutes: 1,
        tip: 'Esto le da la textura clásica de arroz estilo wok.',
      },
      {
        stepNumber: 4,
        instruction:
          'Añade el arroz cocido y el atún escurrido. Saltea todo junto a fuego vivo 2 minutos. Añade la salsa de soja o una pizca de sal y pimienta al gusto.',
        durationMinutes: 2,
      },
    ],
    chefTips: [
      'Funciona con cualquier verdura que tengas en la nevera: calabacín, pimiento o guisantes.',
    ],
  },
  {
    id: 'quesadillas-crujientes-queso',
    title: 'Quesadillas Doradas con Queso y Tomate',
    description:
      'Crujientes por fuera, con queso fundido y jugoso tomate por dentro. La cena más fácil y rápida del mundo.',
    imageUrl: '/assets/images/dish_rustic_skillet_1790137892853.jpg',
    totalTimeMinutes: 8,
    prepTimeMinutes: 2,
    cookTimeMinutes: 6,
    difficulty: 'Muy fácil',
    servings: 2,
    tags: ['Menos de 10 min', 'Snack o Cena', 'Vegetariano', 'Crujiente'],
    category: 'Cena rápida',
    ingredients: [
      { name: 'Tortillas de maíz/trigo', amount: '4 tortillas', baseQuantity: 4, unit: 'tortillas' },
      { name: 'Queso rallado', amount: '120g (mozzarella, gouda o el que tengas)', baseQuantity: 120, unit: 'g' },
      { name: 'Tomate', amount: '1 unidad en rodajas finas', baseQuantity: 1, unit: 'unidad', isOptional: true },
      { name: 'Orégano', amount: '1 pizca (opcional)', isOptional: true },
      { name: 'Aceite o mantequilla', amount: 'Unas gotas para la sartén (básico)' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction:
          'Coloca una tortilla en la encimera. Cubre la mitad con una capa de queso rallado, rodajas finas de tomate y una pizca de orégano. Dobla la tortilla por la mitad formando una medialuna.',
        durationMinutes: 2,
      },
      {
        stepNumber: 2,
        instruction:
          'Calienta una sartén a fuego medio con apenas una gota de aceite o mantequilla esparcida con papel de cocina.',
        durationMinutes: 1,
      },
      {
        stepNumber: 3,
        instruction:
          'Coloca las quesadillas en la sartén. Cocina 2-3 minutos por lado hasta que la tortilla esté dorada y crujiente y el queso esté completamente fundido.',
        durationMinutes: 5,
        tip: 'Presiona suavemente con la espátula para que dore parejo.',
      },
    ],
    chefTips: [
      'Añade atún, pollo desmenuzado o espinacas crudas antes de doblar para sumar nutrientes.',
    ],
  },
  {
    id: 'pechuga-pollo-limon-ajo',
    title: 'Pechuga de Pollo Jugosa al Limón y Ajo',
    description:
      'El secreto para que la pechuga de pollo quede tierna, dorada y con una salsa cítrica deliciosa en 15 minutos.',
    imageUrl: '/assets/images/dish_rustic_skillet_1790137892853.jpg',
    totalTimeMinutes: 15,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    difficulty: 'Fácil',
    servings: 2,
    tags: ['Alto en proteína', 'Sin gluten', 'Bajo en grasa', 'Sartén'],
    category: 'Almuerzo / Cena',
    ingredients: [
      { name: 'Pechuga de pollo', amount: '2 filetes gruesos (unos 350g)', baseQuantity: 350, unit: 'g' },
      { name: 'Limón', amount: '1 limón entero (jugo y ralladura)', baseQuantity: 1, unit: 'unidad' },
      { name: 'Ajo', amount: '2 dientes picados', baseQuantity: 2, unit: 'dientes' },
      { name: 'Perejil', amount: '1 cucharada picado', isOptional: true },
      { name: 'Aceite de oliva', amount: '1 cucharada (básico)' },
      { name: 'Sal y pimienta', amount: 'Al gusto (básico)' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction:
          'Sazona los filetes de pollo con sal, pimienta y un toque del ajo picado por ambos lados.',
        durationMinutes: 2,
      },
      {
        stepNumber: 2,
        instruction:
          'Calienta la sartén con el aceite a fuego medio-alto. Coloca las pechugas y dóralas durante 4 minutos sin moverlas para que sellen bien.',
        durationMinutes: 4,
        tip: 'No pinches la carne para que no pierda sus jugos naturales.',
      },
      {
        stepNumber: 3,
        instruction:
          'Dales la vuelta y cocina 3 minutos más. Añade el resto del ajo picado al fondo de la sartén.',
        durationMinutes: 3,
      },
      {
        stepNumber: 4,
        instruction:
          'Exprime el zumo de limón directamente en la sartén. Raspa el fondo con una cuchara de madera para disolver los jugos caramelizados. Deja reducir la salsa 1 minuto a fuego suave y espolvorea perejil.',
        durationMinutes: 2,
        tip: 'El limón desglasa la sartén creando una salsa increíble sin añadir crema.',
      },
    ],
    chefTips: [
      'Acompaña con arroz blanco, patatas cocidas o ensalada fresca.',
    ],
  },
];
