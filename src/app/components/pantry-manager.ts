import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-pantry-manager',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <section class="space-y-6" aria-labelledby="pantry-heading">
      <!-- Section header with count and quick actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <h2 id="pantry-heading" class="text-lg font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <mat-icon class="text-emerald-700">kitchen</mat-icon>
            ¿Qué tienes hoy en tu cocina?
          </h2>
          <p class="text-xs text-stone-500 mt-0.5">
            Selecciona lo que tengas en tu nevera o despensa para encontrar recetas inmediatas.
          </p>
        </div>

        <div class="flex items-center gap-2">
          @if (recipeService.selectedIngredients().length > 0) {
            <button
              type="button"
              (click)="recipeService.clearIngredients()"
              class="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <mat-icon class="text-xs">clear_all</mat-icon>
              Limpiar todo
            </button>
          }

          <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200 tabular-nums">
            {{ recipeService.selectedIngredients().length }} ingredientes
          </span>
        </div>
      </div>

      <!-- Currently Selected Ingredients Tray -->
      <div class="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-600">
          <span>Ingredientes en tu lista</span>
          @if (recipeService.selectedIngredients().length === 0) {
            <span class="text-amber-700 font-normal lowercase">Selecciona abajo o escribe para empezar</span>
          }
        </div>

        @if (recipeService.selectedIngredients().length > 0) {
          <div class="flex flex-wrap gap-2" role="list" aria-label="Ingredientes seleccionados">
            @for (ing of recipeService.selectedIngredients(); track ing) {
              <span
                class="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs sm:text-sm font-medium transition-all"
                role="listitem"
              >
                <span>{{ ing }}</span>
                <button
                  type="button"
                  (click)="recipeService.removeIngredient(ing)"
                  class="w-5 h-5 rounded-full flex items-center justify-center text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600"
                  [attr.aria-label]="'Eliminar ' + ing + ' de mi lista'"
                >
                  <mat-icon style="font-size: 14px; width: 14px; height: 14px;">close</mat-icon>
                </button>
              </span>
            }
          </div>
        } @else {
          <p class="text-sm text-stone-500 italic py-2">
            No has añadido ningún ingrediente aún. Toca los ingredientes comunes de abajo o escribe los tuyos.
          </p>
        }

        <!-- Custom Ingredient Input -->
        <div class="pt-2 border-t border-stone-100">
          <form (submit)="addCustomIngredient($event)" class="flex gap-2">
            <div class="relative flex-1">
              <input
                type="text"
                [formControl]="customInputControl"
                placeholder="Escribe otro ingrediente (ej: champiñones, yogur, calabaza)..."
                class="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 bg-stone-50/50 text-stone-900 placeholder-stone-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus-visible:outline-none transition-colors"
                aria-label="Añadir ingrediente personalizado"
              />
            </div>
            <button
              type="submit"
              class="px-4 py-2 bg-stone-900 hover:bg-stone-800 active:bg-black text-white text-xs sm:text-sm font-medium rounded-xl inline-flex items-center gap-1.5 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <mat-icon class="text-sm">add</mat-icon>
              <span>Añadir</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Quick Categories Picker -->
      <div class="space-y-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Ingredientes habituales (un toque para sumar o quitar)
        </h3>

        <div class="space-y-3">
          @for (category of recipeService.ingredientCategories; track category.name) {
            <div class="p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-xs space-y-2">
              <div class="flex items-center gap-2 text-xs font-semibold text-stone-700">
                <mat-icon class="text-emerald-700 text-sm">{{ category.icon }}</mat-icon>
                <span>{{ category.name }}</span>
              </div>

              <div class="flex flex-wrap gap-1.5">
                @for (item of category.items; track item) {
                  @let isSelected = recipeService.isIngredientSelected(item);
                  <button
                    type="button"
                    (click)="recipeService.toggleIngredient(item)"
                    [attr.aria-pressed]="isSelected"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600"
                    [ngClass]="{
                      'bg-emerald-800 text-white shadow-xs': isSelected,
                      'bg-stone-100 hover:bg-stone-200 text-stone-700': !isSelected
                    }"
                  >
                    @if (isSelected) {
                      <mat-icon style="font-size: 14px; width: 14px; height: 14px;">check</mat-icon>
                    } @else {
                      <mat-icon style="font-size: 14px; width: 14px; height: 14px;" class="text-stone-400">add</mat-icon>
                    }
                    <span>{{ item }}</span>
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Staples checkbox -->
      <div class="p-3.5 rounded-xl bg-stone-100/80 border border-stone-200 flex items-center justify-between gap-3">
        <label class="flex items-center gap-2.5 cursor-pointer select-none text-xs sm:text-sm text-stone-700">
          <input
            type="checkbox"
            [checked]="recipeService.hasBasicStaples()"
            (change)="recipeService.hasBasicStaples.set(!recipeService.hasBasicStaples())"
            class="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-stone-300"
          />
          <span>Tengo básicos de cocina (sal, pimienta, aceite de oliva, agua)</span>
        </label>
        <span class="text-xs text-stone-500 hidden sm:inline">Recomendado</span>
      </div>
    </section>
  `,
})
export class PantryManager {
  readonly recipeService = inject(RecipeService);
  readonly customInputControl = new FormControl('');

  addCustomIngredient(e: Event): void {
    e.preventDefault();
    const value = this.customInputControl.value;
    if (value && value.trim()) {
      this.recipeService.addIngredient(value);
      this.customInputControl.reset();
    }
  }
}
