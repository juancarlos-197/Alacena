import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService } from './services/recipe.service';
import { RecipeCardComponent } from './components/recipe-card';
import { RecipeDetailModal } from './components/recipe-detail-modal';
import { CookingModeModal } from './components/cooking-mode-modal';
import { PantryManager } from './components/pantry-manager';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    RecipeCardComponent,
    RecipeDetailModal,
    CookingModeModal,
    PantryManager,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly recipeService = inject(RecipeService);

  readonly searchControl = new FormControl('');

  // Local filter controls
  readonly timeFilters: { label: string; value: number | null }[] = [
    { label: 'Cualquiera', value: null },
    { label: '< 15 min', value: 15 },
    { label: '< 25 min', value: 25 },
    { label: '< 35 min', value: 35 },
  ];

  readonly difficultyFilters = ['Todas', 'Muy fácil', 'Fácil'];
  readonly dietaryFilters = ['Todas', 'Vegetariano', 'Sin gluten', 'Rápido'];

  // AI Generator local parameters
  readonly aiMealType = new FormControl('Cena rápida');
  readonly aiDifficulty = new FormControl('Fácil');
  readonly aiMaxTime = new FormControl(25);

  constructor() {
    this.searchControl.valueChanges.subscribe((val) => {
      this.recipeService.searchQuery.set(val || '');
    });
  }

  setTab(tab: 'despensa' | 'recetas' | 'favoritas' | 'ia'): void {
    this.recipeService.activeTab.set(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  setTimeFilter(time: number | null): void {
    this.recipeService.maxTimeFilter.set(time);
  }

  setDifficultyFilter(diff: string): void {
    this.recipeService.difficultyFilter.set(diff);
  }

  setDietaryFilter(diet: string): void {
    this.recipeService.dietaryFilter.set(diet);
  }

  generateAiRecipes(): void {
    this.recipeService.generateAiRecipes();
  }

  openFirstReadyRecipe(): void {
    const list = this.recipeService.filteredRecipes();
    if (list.length > 0) {
      this.recipeService.openRecipeDetail(list[0]);
    }
  }
}
