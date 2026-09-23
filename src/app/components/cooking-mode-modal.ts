import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService } from '../services/recipe.service';
import { RecipeStep } from '../models/recipe.model';

@Component({
  selector: 'app-cooking-mode-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (recipe(); as r) {
      <div
        class="fixed inset-0 z-50 flex flex-col bg-stone-900 text-stone-100 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="'Modo cocina: ' + r.title"
      >
        <!-- Top header bar -->
        <header class="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-stone-800 bg-stone-900/90 backdrop-blur-md sticky top-0 z-10">
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
            <div class="min-w-0">
              <h2 class="text-base sm:text-lg font-semibold tracking-tight truncate text-stone-100">
                {{ r.title }}
              </h2>
              <p class="text-xs text-stone-400">
                Modo Cocina Paso a Paso · Paso {{ currentStepIndex() + 1 }} de {{ r.steps.length }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Text-to-speech button -->
            <button
              type="button"
              (click)="speakCurrentStep()"
              class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-700 bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              [attr.aria-label]="isSpeaking() ? 'Detener lectura en voz alta' : 'Escuchar paso en voz alta'"
            >
              <mat-icon class="text-emerald-400 text-sm">
                {{ isSpeaking() ? 'volume_off' : 'volume_up' }}
              </mat-icon>
              <span class="hidden sm:inline">{{ isSpeaking() ? 'Pausar audio' : 'Leer paso' }}</span>
            </button>

            <!-- Exit button -->
            <button
              type="button"
              (click)="close()"
              class="inline-flex items-center justify-center w-10 h-10 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Salir del modo cocina"
            >
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </header>

        <!-- Progress bar across steps -->
        <div class="w-full bg-stone-800 h-1.5" role="progressbar" [attr.aria-valuenow]="progressPercentage()" aria-valuemin="0" aria-valuemax="100">
          <div
            class="bg-emerald-500 h-full transition-all duration-300 ease-out"
            [style.width.%]="progressPercentage()"
          ></div>
        </div>

        <!-- Main content area -->
        <main class="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-between">
          @if (!isFinished()) {
            @if (currentStep(); as step) {
              <div class="space-y-8 animate-fadeIn">
                <!-- Step number indicator -->
                <div class="flex items-center justify-between text-xs text-stone-400 uppercase tracking-wider font-semibold">
                  <span>Paso {{ step.stepNumber }} de {{ r.steps.length }}</span>
                  @if (step.durationMinutes) {
                    <span class="inline-flex items-center gap-1 text-emerald-400">
                      <mat-icon class="text-xs">timer</mat-icon>
                      Aprox. {{ step.durationMinutes }} min
                    </span>
                  }
                </div>

                <!-- Giant accessible step instruction -->
                <div class="space-y-4">
                  <p class="text-2xl sm:text-3xl md:text-4xl font-medium text-stone-50 leading-relaxed tracking-tight">
                    {{ step.instruction }}
                  </p>

                  @if (step.tip) {
                    <div class="p-4 sm:p-5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200 flex items-start gap-3 mt-4">
                      <mat-icon class="text-amber-400 shrink-0 mt-0.5">lightbulb</mat-icon>
                      <div class="text-sm sm:text-base leading-snug">
                        <strong class="font-semibold block text-amber-300 mb-0.5">Consejo del Chef:</strong>
                        {{ step.tip }}
                      </div>
                    </div>
                  }
                </div>

                <!-- Kitchen Countdown Timer -->
                <div class="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 mt-6">
                  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                        <mat-icon>hourglass_top</mat-icon>
                      </div>
                      <div>
                        <div class="text-xs text-stone-400 font-medium">Temporizador de cocina</div>
                        <div class="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-emerald-300 tabular-nums">
                          {{ formattedTime() }}
                        </div>
                      </div>
                    </div>

                    <!-- Timer controls -->
                    <div class="flex items-center gap-2">
                      @if (!isTimerRunning()) {
                        <button
                          type="button"
                          (click)="startTimer()"
                          class="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm inline-flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
                        >
                          <mat-icon class="text-sm">play_arrow</mat-icon>
                          Iniciar
                        </button>
                      } @else {
                        <button
                          type="button"
                          (click)="pauseTimer()"
                          class="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm inline-flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
                        >
                          <mat-icon class="text-sm">pause</mat-icon>
                          Pausar
                        </button>
                      }

                      <button
                        type="button"
                        (click)="resetTimer()"
                        class="px-3 py-2.5 rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-700 hover:text-stone-100 font-medium text-sm inline-flex items-center gap-1 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
                        aria-label="Reiniciar temporizador"
                      >
                        <mat-icon class="text-sm">replay</mat-icon>
                        <span class="hidden sm:inline">Reiniciar</span>
                      </button>

                      <!-- Quick add minutes -->
                      <button
                        type="button"
                        (click)="addMinutesToTimer(1)"
                        class="px-3 py-2.5 rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-700 hover:text-stone-100 font-medium text-xs transition-colors"
                        title="Sumar 1 minuto"
                      >
                        +1 min
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          } @else {
            <!-- Finished cooking celebration screen -->
            <div class="py-12 text-center space-y-6 animate-fadeIn">
              <div class="w-20 h-20 rounded-full bg-emerald-900/60 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center">
                <mat-icon style="font-size: 40px; width: 40px; height: 40px;">restaurant</mat-icon>
              </div>
              <div class="space-y-2">
                <h3 class="text-3xl font-bold text-stone-100 tracking-tight">
                  ¡Buen provecho! Receta completada
                </h3>
                <p class="text-stone-300 max-w-md mx-auto text-base">
                  Has preparado <strong class="text-emerald-300">{{ r.title }}</strong> con los ingredientes que tenías en casa.
                </p>
              </div>

              <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  (click)="recipeService.toggleFavorite(r)"
                  class="px-5 py-3 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium text-sm inline-flex items-center gap-2 transition-colors"
                >
                  <mat-icon [class.text-rose-400]="r.isFavorite">
                    {{ r.isFavorite ? 'favorite' : 'favorite_border' }}
                  </mat-icon>
                  {{ r.isFavorite ? 'En tus favoritos' : 'Guardar en Favoritos' }}
                </button>

                <button
                  type="button"
                  (click)="close()"
                  class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm inline-flex items-center gap-2 transition-colors shadow-lg"
                >
                  <mat-icon>check</mat-icon>
                  Finalizar y Volver
                </button>
              </div>
            </div>
          }

          <!-- Step navigation footer -->
          @if (!isFinished()) {
            <footer class="mt-12 pt-6 border-t border-stone-800 flex items-center justify-between gap-4">
              <button
                type="button"
                (click)="prevStep()"
                [disabled]="currentStepIndex() === 0"
                class="px-5 py-3 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-stone-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm inline-flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <mat-icon>arrow_back</mat-icon>
                <span>Paso anterior</span>
              </button>

              <div class="text-stone-400 text-xs hidden sm:block">
                Presiona las flechas del teclado ← / → para navegar
              </div>

              @if (currentStepIndex() < (recipe()?.steps?.length || 1) - 1) {
                <button
                  type="button"
                  (click)="nextStep()"
                  class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm inline-flex items-center gap-2 transition-colors shadow-md focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <span>Siguiente paso</span>
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              } @else {
                <button
                  type="button"
                  (click)="markFinished()"
                  class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm inline-flex items-center gap-2 transition-colors shadow-md focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <span>¡Terminar Receta!</span>
                  <mat-icon>celebration</mat-icon>
                </button>
              }
            </footer>
          }
        </main>
      </div>
    }
  `,
})
export class CookingModeModal implements OnInit, OnDestroy {
  readonly recipeService = inject(RecipeService);

  readonly recipe = this.recipeService.activeRecipeForCooking;
  readonly currentStepIndex = this.recipeService.currentCookingStepIndex;
  readonly isFinished = signal<boolean>(false);

  // Timer state
  readonly timerSeconds = signal<number>(180);
  readonly isTimerRunning = signal<boolean>(false);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  // Speech state
  readonly isSpeaking = signal<boolean>(false);

  readonly currentStep = computed<RecipeStep | null>(() => {
    const r = this.recipe();
    if (!r || !r.steps) return null;
    return r.steps[this.currentStepIndex()] || null;
  });

  readonly progressPercentage = computed<number>(() => {
    const r = this.recipe();
    if (!r || !r.steps.length) return 0;
    if (this.isFinished()) return 100;
    return Math.round(((this.currentStepIndex() + 1) / r.steps.length) * 100);
  });

  readonly formattedTime = computed<string>(() => {
    const totalSecs = this.timerSeconds();
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  ngOnInit(): void {
    this.syncTimerWithStep();
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.stopSpeaking();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowRight') {
      this.nextStep();
    } else if (e.key === 'ArrowLeft') {
      this.prevStep();
    } else if (e.key === 'Escape') {
      this.close();
    }
  };

  private syncTimerWithStep(): void {
    const step = this.currentStep();
    const duration = step?.durationMinutes || 3;
    this.timerSeconds.set(duration * 60);
    this.stopTimer();
  }

  startTimer(): void {
    if (this.isTimerRunning()) return;
    this.isTimerRunning.set(true);

    this.timerInterval = setInterval(() => {
      const current = this.timerSeconds();
      if (current <= 1) {
        this.timerSeconds.set(0);
        this.stopTimer();
        this.playTimerChime();
      } else {
        this.timerSeconds.set(current - 1);
      }
    }, 1000);
  }

  pauseTimer(): void {
    this.stopTimer();
  }

  resetTimer(): void {
    this.stopTimer();
    this.syncTimerWithStep();
  }

  addMinutesToTimer(minutes: number): void {
    this.timerSeconds.update((s) => s + minutes * 60);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isTimerRunning.set(false);
  }

  /**
   * Pleasant browser Web Audio synth chime when timer rings
   */
  private playTimerChime(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const AudioCtx = window.AudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (freq: number, delay: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + dur);
      };

      playTone(523.25, 0, 0.4); // C5
      playTone(659.25, 0.2, 0.4); // E5
      playTone(783.99, 0.4, 0.6); // G5
    } catch (e) {
      console.warn('Audio chime not supported', e);
    }
  }

  // Text-To-Speech reader
  speakCurrentStep(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (this.isSpeaking()) {
      window.speechSynthesis.cancel();
      this.isSpeaking.set(false);
      return;
    }

    const step = this.currentStep();
    if (!step) return;

    window.speechSynthesis.cancel();
    const textToSpeak = `Paso número ${step.stepNumber}. ${step.instruction}. ${
      step.tip ? 'Consejo del chef: ' + step.tip : ''
    }`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;

    utterance.onend = () => {
      this.isSpeaking.set(false);
    };

    utterance.onerror = () => {
      this.isSpeaking.set(false);
    };

    this.isSpeaking.set(true);
    window.speechSynthesis.speak(utterance);
  }

  private stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking.set(false);
    }
  }

  nextStep(): void {
    this.stopSpeaking();
    this.recipeService.nextCookingStep();
    this.syncTimerWithStep();
  }

  prevStep(): void {
    this.stopSpeaking();
    this.recipeService.prevCookingStep();
    this.syncTimerWithStep();
  }

  markFinished(): void {
    this.stopSpeaking();
    this.stopTimer();
    this.isFinished.set(true);
  }

  close(): void {
    this.stopSpeaking();
    this.stopTimer();
    this.recipeService.closeCooking();
  }
}
