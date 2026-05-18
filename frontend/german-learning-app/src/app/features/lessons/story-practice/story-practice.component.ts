import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VocabularyService } from '../../../shared/services/vocabulary.service';
import { StoryScenarioService } from '../../../shared/services/story-scenario.service';
import { LevelService } from '../../../shared/services/level.service';
import { VocabularyDTO } from '../../../shared/models/vocabulary.model';
import { StoryScenario } from '../../../shared/models/story-scenario.model';

const STORAGE_KEY = (lessonId: number) => `story-scenarios-${lessonId}`;

@Component({
  selector: 'app-story-practice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-practice.component.html',
  styleUrl: './story-practice.component.css',
})
export class StoryPracticeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vocabularyService = inject(VocabularyService);
  private scenarioService = inject(StoryScenarioService);
  private levelService = inject(LevelService);

  loading = signal(true);
  generating = signal(false);
  errorMessage = signal<string | null>(null);
  vocabularies = signal<VocabularyDTO[]>([]);
  scenarios = signal<StoryScenario[]>([]);
  userTexts = signal<string[]>([]);
  copiedIndex = signal<number | null>(null);

  private lessonId = 0;
  private levelCode = '';

  ngOnInit() {
    this.lessonId = Number(this.route.snapshot.paramMap.get('id'));
    const levelId = Number(this.route.snapshot.queryParamMap.get('levelId'));

    this.vocabularyService.getByLesson(this.lessonId).subscribe({
      next: (data) => {
        this.vocabularies.set(data);
        this.loading.set(false);
        const saved = localStorage.getItem(STORAGE_KEY(this.lessonId));
        if (saved) {
          const parsed: StoryScenario[] = JSON.parse(saved);
          this.scenarios.set(parsed);
          this.userTexts.set(parsed.map(() => ''));
        }
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/404']);
      }
    });

    if (levelId) {
      this.levelService.getLevelById(levelId).subscribe({
        next: (level) => { this.levelCode = level.code; },
        error: () => {}
      });
    }
  }

  generate() {
    if (this.generating()) return;
    this.generating.set(true);
    this.errorMessage.set(null);
    const request = {
      words: this.vocabularies().map(v => ({
        germanWord: v.germanWord,
        englishMeaning: v.englishMeaning,
        germanExplanation: v.germanExplanation,
      })),
      levelCode: this.levelCode || undefined,
    };
    this.scenarioService.generateScenarios(request).subscribe({
      next: (res) => {
        this.generating.set(false);
        if (!res.scenarios || res.scenarios.length === 0) {
          this.errorMessage.set('The AI could not generate scenarios. Please try again.');
          return;
        }
        this.scenarios.set(res.scenarios);
        this.userTexts.set(res.scenarios.map(() => ''));
        localStorage.setItem(STORAGE_KEY(this.lessonId), JSON.stringify(res.scenarios));
      },
      error: () => {
        this.generating.set(false);
        this.errorMessage.set('Something went wrong. Please check your connection and try again.');
      }
    });
  }

  setUserText(index: number, value: string) {
    const texts = [...this.userTexts()];
    texts[index] = value;
    this.userTexts.set(texts);
  }

  wordCount(text: string): number {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(w => w.length > 0).length;
  }

  copyScenario(index: number) {
    const scenario = this.scenarios()[index];
    const userText = this.userTexts()[index];
    const text =
      `Schreibaufgabe: ${scenario.title}\n\n` +
      `Aufgabe: ${scenario.prompt}\n\n` +
      `Wörter: ${scenario.words.join(', ')}\n\n` +
      `Meine Geschichte:\n${userText}\n\n` +
      `---\n` +
      `Bitte gib mir Feedback zu meinem deutschen Text. Achte besonders auf Grammatik, Wortstellung und die Verwendung der vorgegebenen Wörter.`;

    navigator.clipboard.writeText(text).then(() => {
      this.copiedIndex.set(index);
      setTimeout(() => this.copiedIndex.set(null), 2000);
    });
  }

  hasScenarios(): boolean {
    return this.scenarios().length > 0;
  }

  goBack() {
    const levelId = this.route.snapshot.queryParamMap.get('levelId');
    this.router.navigate([`/lessons/${this.lessonId}`], levelId ? { queryParams: { levelId } } : {});
  }
}
