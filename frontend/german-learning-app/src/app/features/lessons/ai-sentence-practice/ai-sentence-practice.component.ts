import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VocabularyService } from '../../../shared/services/vocabulary.service';
import { AiSentenceService } from '../../../shared/services/ai-sentence.service';
import { VocabularyDTO } from '../../../shared/models/vocabulary.model';

type Mode = 'practice' | 'retry' | 'summary';

@Component({
  selector: 'app-ai-sentence-practice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-sentence-practice.component.html',
  styleUrl: './ai-sentence-practice.component.css',
})
export class AiSentencePracticeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vocabularyService = inject(VocabularyService);
  private aiService = inject(AiSentenceService);

  loading = signal(true);
  checking = signal(false);

  activeWords = signal<VocabularyDTO[]>([]);
  skippedWords = signal<VocabularyDTO[]>([]);
  wordIndex = signal(0);

  userSentence = signal('');
  feedback = signal('');
  submitted = signal(false);
  mode = signal<Mode>('practice');
  totalPracticed = signal(0);

  currentWord = computed(() => this.activeWords()[this.wordIndex()] ?? null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vocabularyService.getByLesson(id).subscribe({
      next: (data) => {
        this.activeWords.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/404']);
      }
    });
  }

  setSentence(value: string) { this.userSentence.set(value); }

  submitSentence() {
    const word = this.currentWord();
    if (!word || !this.userSentence().trim() || this.checking()) return;

    this.checking.set(true);
    this.aiService.getFeedback({
      word: word.germanWord,
      germanExplanation: word.germanExplanation,
      userSentence: this.userSentence().trim(),
    }).subscribe({
      next: (res) => {
        this.feedback.set(res.feedback);
        this.submitted.set(true);
        this.checking.set(false);
        this.totalPracticed.update(n => n + 1);
      },
      error: () => {
        this.feedback.set('Could not get feedback. Please check your connection and try again.');
        this.submitted.set(true);
        this.checking.set(false);
      }
    });
  }

  skip() {
    this.skippedWords.update(arr => [...arr, this.currentWord()!]);
    this.advance();
  }

  next() { this.advance(); }

  private advance() {
    if (this.wordIndex() < this.activeWords().length - 1) {
      this.wordIndex.update(i => i + 1);
      this.resetCard();
    } else {
      if (this.skippedWords().length > 0) {
        this.activeWords.set(this.skippedWords());
        this.skippedWords.set([]);
        this.wordIndex.set(0);
        this.resetCard();
        this.mode.set('retry');
      } else {
        this.mode.set('summary');
      }
    }
  }

  private resetCard() {
    this.userSentence.set('');
    this.feedback.set('');
    this.submitted.set(false);
  }

  goBack() {
    const id = this.route.snapshot.paramMap.get('id');
    const levelId = this.route.snapshot.queryParamMap.get('levelId');
    this.router.navigate([`/lessons/${id}`], levelId ? { queryParams: { levelId } } : {});
  }
}
