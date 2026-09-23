import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CURATED_RECIPES, INGREDIENT_CATEGORIES } from '../data/curated-recipes';
import { Recipe, RecipeIngredient } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private http = inject(HttpClient);

  // Common quick-select pantry ingredients
  readonly ingredientCategories = INGREDIENT_CATEGORIES;

  // Selected ingredients in user's pantry
  readonly selectedIngredients = signal<string[]>([
    'Huevos',
    'Tomate',
    'Ajo',
  ]);

  // Whether user has basic pantry staples (salt, pepper, oil, water)
  readonly hasBasicStaples = signal<boolean>(true);

  // Filters
  readonly maxTimeFilter = signal<number | null>(null);
  readonly difficultyFilter = signal<string>('Todas');
  readonly dietaryFilter = signal<string>('Todas');
  readonly searchQuery = signal<string>('');

  // AI Generated recipes
  readonly aiGeneratedRecipes = signal<Recipe[]>([]);
  readonly isAiLoading = signal<boolean>(false);
  readonly aiError = signal<string | null>(null);

  // Favorites stored in localStorage
  readonly favorites = signal<Recipe[]>(this.loadFavoritesFromStorage());

  // Active navigation / view state
  readonly activeTab = signal<'despensa' | 'recetas' | 'favoritas' | 'ia'>('recetas');
  readonly activeRecipeForDetail = signal<Recipe | null>(null);
  readonly activeRecipeForCooking = signal<Recipe | null>(null);
  readonly currentCookingStepIndex = signal<number>(0);

  /**
   * Helper to normalize strings for comparison (removes accents, lowercase)
   */
  private normalize(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  /**
   * Combines curated recipes and AI generated recipes, calculating dynamic match percentages
   */
  readonly allRecipesWithMatch = computed(() => {
    const userIngredients = this.selectedIngredients().map((i) => this.normalize(i));
    const all = [...this.aiGeneratedRecipes(), ...CURATED_RECIPES];
    const favIds = new Set(this.favorites().map((f) => f.id));

    return all.map((recipe) => {
      // Filter out basic staples if user assumes they have them
      const keyIngredients = recipe.ingredients.filter((ing) => {
        const norm = this.normalize(ing.name);
        if (norm.includes('(basico)') || norm.includes('basico')) return false;
        if (norm === 'sal' || norm === 'pimienta' || norm === 'agua' || norm === 'aceite de oliva') return false;
        return true;
      });

      let matchedCount = 0;
      const updatedIngredients: RecipeIngredient[] = recipe.ingredients.map((ing) => {
        const normIng = this.normalize(ing.name);
        const isMatched = userIngredients.some(
          (userIng) =>
            normIng.includes(userIng) ||
            userIng.includes(normIng) ||
            (normIng.includes('huevo') && userIng.includes('huevo')) ||
            (normIng.includes('pasta') && userIng.includes('pasta')) ||
            (normIng.includes('patata') && userIng.includes('patata')) ||
            (normIng.includes('tomate') && userIng.includes('tomate')) ||
            (normIng.includes('arroz') && userIng.includes('arroz')) ||
            (normIng.includes('pollo') && userIng.includes('pollo')) ||
            (normIng.includes('garbanzo') && userIng.includes('garbanzo')) ||
            (normIng.includes('atun') && userIng.includes('atun'))
        );

        if (isMatched) {
          matchedCount++;
        }

        return {
          ...ing,
          isUserIngredient: isMatched,
        };
      });

      const totalRequired = Math.max(1, keyIngredients.length);
      const matchPercentage = Math.min(
        100,
        Math.round((matchedCount / totalRequired) * 100)
      );

      return {
        ...recipe,
        ingredients: updatedIngredients,
        matchedIngredientsCount: matchedCount,
        totalKeyIngredientsCount: totalRequired,
        matchPercentage,
        isFavorite: favIds.has(recipe.id),
      };
    });
  });

  /**
   * Filtered & sorted recipe list based on active filters and ingredient match
   */
  readonly filteredRecipes = computed(() => {
    const timeLimit = this.maxTimeFilter();
    const diff = this.difficultyFilter();
    const dietary = this.dietaryFilter();
    const query = this.normalize(this.searchQuery());

    return this.allRecipesWithMatch()
      .filter((recipe) => {
        if (timeLimit !== null && recipe.totalTimeMinutes > timeLimit) {
          return false;
        }

        if (diff !== 'Todas' && recipe.difficulty !== diff) {
          return false;
        }

        if (dietary !== 'Todas') {
          const hasTag = recipe.tags.some((t) =>
            this.normalize(t).includes(this.normalize(dietary))
          );
          if (!hasTag) return false;
        }

        if (query) {
          const matchTitle = this.normalize(recipe.title).includes(query);
          const matchDesc = this.normalize(recipe.description).includes(query);
          const matchIng = recipe.ingredients.some((i) =>
            this.normalize(i.name).includes(query)
          );
          if (!matchTitle && !matchDesc && !matchIng) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // High match percentage first
        const matchDiff = (b.matchPercentage || 0) - (a.matchPercentage || 0);
        if (matchDiff !== 0) return matchDiff;
        // Then quicker recipes first
        return a.totalTimeMinutes - b.totalTimeMinutes;
      });
  });

  // Count of recipes with 100% or > 70% match
  readonly readyToCookCount = computed(() => {
    return this.allRecipesWithMatch().filter((r) => (r.matchPercentage || 0) >= 80).length;
  });

  // Ingredient methods
  addIngredient(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;

    const current = this.selectedIngredients();
    const exists = current.some(
      (item) => this.normalize(item) === this.normalize(trimmed)
    );

    if (!exists) {
      this.selectedIngredients.set([...current, trimmed]);
    }
  }

  toggleIngredient(name: string): void {
    const current = this.selectedIngredients();
    const exists = current.some(
      (item) => this.normalize(item) === this.normalize(name)
    );

    if (exists) {
      this.removeIngredient(name);
    } else {
      this.addIngredient(name);
    }
  }

  isIngredientSelected(name: string): boolean {
    const norm = this.normalize(name);
    return this.selectedIngredients().some(
      (item) => this.normalize(item) === norm
    );
  }

  removeIngredient(name: string): void {
    const norm = this.normalize(name);
    this.selectedIngredients.set(
      this.selectedIngredients().filter((item) => this.normalize(item) !== norm)
    );
  }

  clearIngredients(): void {
    this.selectedIngredients.set([]);
  }

  // Favorites methods
  private loadFavoritesFromStorage(): Recipe[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    try {
      const data = localStorage.getItem('alacena_favorites');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveFavoritesToStorage(favorites: Recipe[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('alacena_favorites', JSON.stringify(favorites));
      } catch (e) {
        console.error('Error guardando favoritos', e);
      }
    }
  }

  toggleFavorite(recipe: Recipe): void {
    const current = this.favorites();
    const exists = current.some((f) => f.id === recipe.id);
    let updated: Recipe[];

    if (exists) {
      updated = current.filter((f) => f.id !== recipe.id);
    } else {
      updated = [{ ...recipe, isFavorite: true }, ...current];
    }

    this.favorites.set(updated);
    this.saveFavoritesToStorage(updated);
  }

  // AI Recipe Generation
  async generateAiRecipes(): Promise<void> {
    const ingredients = this.selectedIngredients();
    if (ingredients.length === 0) {
      this.aiError.set('Añade al menos un ingrediente para que la IA diseñe recetas.');
      return;
    }

    this.isAiLoading.set(true);
    this.aiError.set(null);

    const payload = {
      ingredients,
      hasStaples: this.hasBasicStaples(),
      maxTime: this.maxTimeFilter() || 35,
      difficulty: this.difficultyFilter() === 'Todas' ? 'Fácil' : this.difficultyFilter(),
      dietary: this.dietaryFilter() === 'Todas' ? 'Cualquiera' : this.dietaryFilter(),
    };

    try {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error en el servidor al generar recetas.');
      }

      const data = await response.json();
      if (data && Array.isArray(data.recipes) && data.recipes.length > 0) {
        const newRecipes: Recipe[] = (data.recipes as Recipe[]).map((r: Recipe, idx: number) => ({
          ...r,
          id: r.id || `ai-${Date.now()}-${idx}`,
          imageUrl: idx === 0 
            ? '/assets/images/dish_quick_pasta_1790137880686.jpg' 
            : '/assets/images/dish_rustic_skillet_1790137892853.jpg',
          category: 'Creada con IA',
          isCustomAi: true,
        }));

        this.aiGeneratedRecipes.set([...newRecipes, ...this.aiGeneratedRecipes()]);
        this.activeTab.set('recetas');
      } else {
        throw new Error('No se generaron recetas para esos ingredientes.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No fue posible conectar con el asistente de cocina.';
      this.aiError.set(message);
    } finally {
      this.isAiLoading.set(false);
    }
  }

  // Modal / Detail methods
  openRecipeDetail(recipe: Recipe): void {
    this.activeRecipeForDetail.set(recipe);
  }

  closeRecipeDetail(): void {
    this.activeRecipeForDetail.set(null);
  }

  startCooking(recipe: Recipe): void {
    this.activeRecipeForDetail.set(null);
    this.activeRecipeForCooking.set(recipe);
    this.currentCookingStepIndex.set(0);
  }

  closeCooking(): void {
    this.activeRecipeForCooking.set(null);
  }

  nextCookingStep(): void {
    const recipe = this.activeRecipeForCooking();
    if (!recipe) return;
    const current = this.currentCookingStepIndex();
    if (current < recipe.steps.length - 1) {
      this.currentCookingStepIndex.set(current + 1);
    }
  }

  prevCookingStep(): void {
    const current = this.currentCookingStepIndex();
    if (current > 0) {
      this.currentCookingStepIndex.set(current - 1);
    }
  }
}
