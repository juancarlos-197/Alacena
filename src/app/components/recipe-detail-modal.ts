import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService } from '../services/recipe.service';
import { Recipe, RecipeIngredient } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-detail-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (recipe(); as r) {
      <div
        class="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="r.title"
      >
        <div
          class="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-fadeIn"
        >
          <!-- Top bar with close and favorite buttons -->
          <div class="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              type="button"
              (click)="recipeService.toggleFavorite(r)"
              class="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur-xs flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600"
              [attr.aria-label]="r.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
            >
              <mat-icon [class.text-rose-500]="r.isFavorite">
                {{ r.isFavorite ? 'favorite' : 'favorite_border' }}
              </mat-icon>
            </button>

            <button
              type="button"
              (click)="close()"
              class="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur-xs flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600"
              aria-label="Cerrar detalle de receta"
            >
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Hero Image or Visual Header -->
          <div class="relative w-full h-48 sm:h-64 bg-stone-100 shrink-0 overflow-hidden">
            @if (r.imageUrl) {
              <img
                [src]="r.imageUrl"
                [alt]="r.title"
                referrerpolicy="no-referrer"
                class="w-full h-full object-cover"
              />
            } @else {
              <div class="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
                <mat-icon style="font-size: 48px; width: 48px; height: 48px;">soup_kitchen</mat-icon>
                <span class="text-xs uppercase tracking-wider font-medium mt-1">Receta Casera</span>
              </div>
            }
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <!-- Overlaid Title on Image -->
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <div class="text-xs text-stone-200 uppercase tracking-wider font-semibold mb-1">
                {{ r.category }}
              </div>
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-xs">
                {{ r.title }}
              </h1>
            </div>
          </div>

          <!-- Scrollable Body -->
          <div class="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
            <!-- Metadata & Match Status -->
            <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div class="flex items-center gap-2 text-xs sm:text-sm text-stone-500 font-medium">
                <span class="inline-flex items-center gap-1">
                  <mat-icon class="text-xs text-stone-400">schedule</mat-icon>
                  {{ r.totalTimeMinutes }} min
                </span>
                <span aria-hidden="true">·</span>
                <span class="inline-flex items-center gap-1">
                  <mat-icon class="text-xs text-stone-400">bar_chart</mat-icon>
                  {{ r.difficulty }}
                </span>
                <span aria-hidden="true">·</span>
                <span>{{ r.steps.length }} pasos</span>
              </div>

              <!-- Match badge / percentage -->
              @if (r.matchPercentage !== undefined) {
                <div class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md"
                  [ngClass]="{
                    'bg-emerald-50 text-emerald-800 border border-emerald-200': (r.matchPercentage || 0) >= 80,
                    'bg-amber-50 text-amber-800 border border-amber-200': (r.matchPercentage || 0) >= 50 && (r.matchPercentage || 0) < 80,
                    'bg-stone-100 text-stone-700': (r.matchPercentage || 0) < 50
                  }"
                >
                  <mat-icon class="text-xs">
                    {{ (r.matchPercentage || 0) >= 80 ? 'check_circle' : 'inventory_2' }}
                  </mat-icon>
                  <span>{{ r.matchPercentage }}% en tu cocina</span>
                </div>
              }
            </div>

            <!-- Description -->
            <p class="text-sm sm:text-base text-stone-600 leading-relaxed">
              {{ r.description }}
            </p>

            <!-- Portion scaler -->
            <div class="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-emerald-700 text-sm">group</mat-icon>
                <span class="text-sm font-medium text-stone-800">Calcular porciones:</span>
              </div>

              <div class="flex items-center gap-1">
                @for (serv of [1, 2, 4, 6]; track serv) {
                  <button
                    type="button"
                    (click)="selectedServings.set(serv)"
                    class="w-8 h-8 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600"
                    [ngClass]="{
                      'bg-emerald-800 text-white shadow-xs': selectedServings() === serv,
                      'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100': selectedServings() !== serv
                    }"
                    [attr.aria-label]="serv + ' porciones'"
                  >
                    {{ serv }}
                  </button>
                }
              </div>
            </div>

            <!-- Ingredients checklist -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h2 class="text-sm font-semibold uppercase tracking-wider text-stone-700">
                  Ingredientes ({{ scaledIngredients().length }})
                </h2>
                <span class="text-xs text-stone-400">
                  Para {{ selectedServings() }} {{ selectedServings() === 1 ? 'persona' : 'personas' }}
                </span>
              </div>

              <div class="space-y-1.5">
                @for (ing of scaledIngredients(); track ing.name) {
                  <label
                    class="flex items-start gap-3 p-2.5 rounded-lg border border-transparent hover:bg-stone-50 transition-colors cursor-pointer select-none"
                    [class.bg-emerald-50/40]="ing.isUserIngredient"
                  >
                    <input
                      type="checkbox"
                      [checked]="checkedIngredients().has(ing.name)"
                      (change)="toggleCheckedIngredient(ing.name)"
                      class="mt-1 w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 focus:ring-offset-0 border-stone-300"
                    />
                    <div class="flex-1 min-w-0 flex items-baseline justify-between gap-2">
                      <span
                        class="text-sm text-stone-800"
                        [class.line-through]="checkedIngredients().has(ing.name)"
                        [class.text-stone-400]="checkedIngredients().has(ing.name)"
                      >
                        {{ ing.name }}
                        @if (ing.isOptional) {
                          <span class="text-xs text-stone-400">(opcional)</span>
                        }
                      </span>
                      <span class="text-xs font-semibold text-stone-600 tabular-nums shrink-0">
                        {{ ing.amount }}
                      </span>
                    </div>

                    @if (ing.isUserIngredient) {
                      <span class="text-[11px] font-medium text-emerald-700 shrink-0 ml-1" title="Tienes este ingrediente en tu lista">
                        En casa
                      </span>
                    }
                  </label>
                }
              </div>
            </div>

            <!-- Steps Summary -->
            <div class="space-y-3">
              <h2 class="text-sm font-semibold uppercase tracking-wider text-stone-700">
                Pasos de preparación ({{ r.steps.length }})
              </h2>

              <ol class="space-y-3">
                @for (step of r.steps; track step.stepNumber) {
                  <li class="flex items-start gap-3 text-sm text-stone-700">
                    <span class="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-stone-200">
                      {{ step.stepNumber }}
                    </span>
                    <div class="flex-1 leading-relaxed">
                      {{ step.instruction }}
                    </div>
                  </li>
                }
              </ol>
            </div>

            <!-- Chef tips -->
            @if (r.chefTips && r.chefTips.length > 0) {
              <div class="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div class="flex items-center gap-2 text-amber-900 font-semibold text-xs uppercase tracking-wider">
                  <mat-icon class="text-amber-600 text-sm">emoji_objects</mat-icon>
                  <span>Secretos y sustituciones del Chef</span>
                </div>
                <ul class="text-xs sm:text-sm text-amber-950 space-y-1 list-disc list-inside">
                  @for (tip of r.chefTips; track tip) {
                    <li>{{ tip }}</li>
                  }
                </ul>
              </div>
            }
          </div>

          <!-- Bottom Action Bar -->
          <div class="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              (click)="copyRecipe()"
              class="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600"
              title="Copiar texto de receta al portapapeles"
            >
              <mat-icon class="text-sm">content_copy</mat-icon>
              <span>{{ copyStatus() }}</span>
            </button>

            <button
              type="button"
              (click)="startCooking(r)"
              class="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-medium text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <mat-icon class="text-sm">skillet</mat-icon>
              <span>Cocinar Paso a Paso</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class RecipeDetailModal {
  readonly recipeService = inject(RecipeService);
  readonly recipe = this.recipeService.activeRecipeForDetail;

  readonly selectedServings = signal<number>(2);
  readonly checkedIngredients = signal<Set<string>>(new Set());
  readonly copyStatus = signal<string>('Copiar');

  /**
   * Recalculates ingredient amounts based on selected servings ratio
   */
  readonly scaledIngredients = computed<RecipeIngredient[]>(() => {
    const r = this.recipe();
    if (!r) return [];

    const baseServings = r.servings || 2;
    const currentServings = this.selectedServings();
    const ratio = currentServings / baseServings;

    return r.ingredients.map((ing) => {
      if (ing.baseQuantity !== undefined && ing.unit) {
        const scaledQty = Math.round(ing.baseQuantity * ratio * 10) / 10;
        return {
          ...ing,
          amount: `${scaledQty}${ing.unit}`,
        };
      }
      return ing;
    });
  });

  toggleCheckedIngredient(name: string): void {
    const current = new Set(this.checkedIngredients());
    if (current.has(name)) {
      current.delete(name);
    } else {
      current.add(name);
    }
    this.checkedIngredients.set(current);
  }

  copyRecipe(): void {
    const r = this.recipe();
    if (!r) return;

    let text = `🍳 ${r.title}\n`;
    text += `⏱ Tiempo: ${r.totalTimeMinutes} min | Dificultad: ${r.difficulty} | Para: ${this.selectedServings()} personas\n\n`;
    text += `📝 Ingredientes:\n`;
    for (const ing of this.scaledIngredients()) {
      text += `• ${ing.name}: ${ing.amount}\n`;
    }
    text += `\n👨‍🍳 Pasos:\n`;
    for (const step of r.steps) {
      text += `${step.stepNumber}. ${step.instruction}\n`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copyStatus.set('¡Copiado!');
        setTimeout(() => this.copyStatus.set('Copiar'), 2000);
      });
    }
  }

  startCooking(recipe: Recipe): void {
    this.recipeService.startCooking(recipe);
  }

  close(): void {
    this.recipeService.closeRecipeDetail();
  }
}
