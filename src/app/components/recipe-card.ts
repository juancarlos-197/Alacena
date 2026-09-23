import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @let r = recipe();
    <article
      class="group flex flex-col bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
      [attr.aria-label]="r.title"
    >
      <!-- Image container -->
      <div class="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden">
        @if (r.imageUrl) {
          <img
            [src]="r.imageUrl"
            [alt]="r.title"
            referrerpolicy="no-referrer"
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        } @else {
          <div class="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
            <mat-icon style="font-size: 36px; width: 36px; height: 36px;">restaurant</mat-icon>
            <span class="text-xs uppercase tracking-wider font-medium mt-1">Receta Fácil</span>
          </div>
        }

        <!-- Gradient protection -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

        <!-- Category & AI badge -->
        <div class="absolute top-3 left-3 flex items-center gap-1.5">
          <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-stone-900/80 backdrop-blur-xs text-white">
            {{ r.category }}
          </span>
          @if (r.isCustomAi) {
            <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-600/90 backdrop-blur-xs text-white inline-flex items-center gap-1">
              <mat-icon style="font-size: 12px; width: 12px; height: 12px;">auto_awesome</mat-icon>
              IA
            </span>
          }
        </div>

        <!-- Favorite button -->
        <button
          type="button"
          (click)="onToggleFavorite($event, r)"
          class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-sm backdrop-blur-xs flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600"
          [attr.aria-label]="r.isFavorite ? 'Quitar ' + r.title + ' de favoritos' : 'Guardar ' + r.title + ' en favoritos'"
        >
          <mat-icon class="text-sm" [class.text-rose-500]="r.isFavorite">
            {{ r.isFavorite ? 'favorite' : 'favorite_border' }}
          </mat-icon>
        </button>

        <!-- Match overlay badge -->
        <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span class="inline-flex items-center gap-1">
            <mat-icon class="text-xs">timer</mat-icon>
            {{ r.totalTimeMinutes }} min
          </span>

          @if (r.matchPercentage !== undefined) {
            <span
              class="px-2 py-0.5 rounded-md text-[11px] font-bold backdrop-blur-xs"
              [ngClass]="{
                'bg-emerald-500/90 text-white': (r.matchPercentage || 0) >= 80,
                'bg-amber-500/90 text-white': (r.matchPercentage || 0) >= 50 && (r.matchPercentage || 0) < 80,
                'bg-stone-800/80 text-stone-200': (r.matchPercentage || 0) < 50
              }"
            >
              {{ r.matchPercentage }}% ingredientes listos
            </span>
          }
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <!-- Unboxed metadata following Zero-Pill rule -->
          <div class="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <span>{{ r.difficulty }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ r.servings }} porciones</span>
            <span aria-hidden="true">·</span>
            <span>{{ r.steps.length }} pasos</span>
          </div>

          <h3 class="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">
            {{ r.title }}
          </h3>

          <p class="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {{ r.description }}
          </p>
        </div>

        <!-- Ingredient Match Progress & Summary -->
        <div class="pt-2 border-t border-stone-100 space-y-2">
          <div class="flex items-center justify-between text-[11px] text-stone-500 font-medium">
            <span>Ingredientes que tienes:</span>
            <span class="font-bold text-stone-800 tabular-nums">
              {{ r.matchedIngredientsCount || 0 }} de {{ r.totalKeyIngredientsCount || r.ingredients.length }}
            </span>
          </div>

          <div class="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden" role="progressbar" [attr.aria-valuenow]="r.matchPercentage || 0" aria-valuemin="0" aria-valuemax="100">
            <div
              class="h-full rounded-full transition-all duration-300"
              [ngClass]="{
                'bg-emerald-600': (r.matchPercentage || 0) >= 80,
                'bg-amber-500': (r.matchPercentage || 0) >= 50 && (r.matchPercentage || 0) < 80,
                'bg-stone-400': (r.matchPercentage || 0) < 50
              }"
              [style.width.%]="r.matchPercentage || 0"
            ></div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-2 pt-1">
          <button
            type="button"
            (click)="recipeService.openRecipeDetail(r)"
            class="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800 font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <mat-icon class="text-xs">visibility</mat-icon>
            <span>Ver Receta</span>
          </button>

          <button
            type="button"
            (click)="recipeService.startCooking(r)"
            class="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-600"
            title="Iniciar modo cocina guiado paso a paso"
          >
            <mat-icon class="text-xs">skillet</mat-icon>
            <span class="hidden sm:inline">Cocinar</span>
          </button>
        </div>
      </div>
    </article>
  `,
})
export class RecipeCardComponent {
  readonly recipe = input.required<Recipe>();
  readonly recipeService = inject(RecipeService);

  onToggleFavorite(event: MouseEvent, recipe: Recipe): void {
    event.stopPropagation();
    this.recipeService.toggleFavorite(recipe);
  }
}
