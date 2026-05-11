import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VocabularyService } from '../../../shared/services/vocabulary.service';
import { ProgressService } from '../../../shared/services/progress.service';
import { VocabularyDTO } from '../../../shared/models/vocabulary.model';
import { FlashcardComponent } from './flashcard/flashcard.component';

type Mode = 'flashcard' | 'writing' | 'writing-done' | 'writing-summary';

@Component({
  selector: 'app-student-lesson-detail',
  standalone: true,
  imports: [CommonModule, FlashcardComponent],
  templateUrl: './student-lesson-detail.component.html',
  styleUrl: './student-lesson-detail.component.css',
})
export class StudentLessonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vocabularyService = inject(VocabularyService);
  private progressService = inject(ProgressService);

  vocabularies = signal<VocabularyDTO[]>([]);
  currentIndex = signal(0);
  loading = signal(true);
  finished = signal(false);

  // Writing practice state
  mode = signal<Mode>('flashcard');
  writingIndex = signal(0);
  userInput = signal('');
  submitted = signal(false);
  isCorrect = signal<boolean | null>(null);
  correctCount = signal(0);

  // Retry state (session-only, not persisted)
  activeWritingWords = signal<VocabularyDTO[]>([]);
  wrongWords = signal<VocabularyDTO[]>([]);
  attemptCount = signal(0);
  firstAttemptScore = signal<number | null>(null);

  currentVocabulary = computed(() => this.vocabularies()[this.currentIndex()]);
  writingWord = computed(() => this.activeWritingWords()[this.writingIndex()]);
  writingScore = computed(() => {
    const total = this.activeWritingWords().length;
    return total > 0 ? Math.round((this.correctCount() / total) * 100) : 0;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadVocabularies(id);
      }
    });
  }

  loadVocabularies(lessonId: number) {
    this.loading.set(true);
    this.vocabularyService.getByLesson(lessonId).subscribe({
      next: (data) => {
        this.vocabularies.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        this.router.navigate(['/404']);
      }
    });
  }

  next() {
    if (this.currentIndex() < this.vocabularies().length - 1) {
      this.currentIndex.update(i => i + 1);
      this.scrollToCard(this.currentIndex());
    } else {
      this.finished.set(true);
    }
  }

  prev() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
      this.scrollToCard(this.currentIndex());
      this.finished.set(false);
    }
  }

  scrollToCard(index: number) {
    const el = document.getElementById(`card-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onScroll(event: Event) {
    const container = event.target as HTMLElement;
    const scrollTop = container.scrollTop;
    const height = container.clientHeight;

    // Calculate which card is most visible
    const newIndex = Math.round(scrollTop / height);
    if (newIndex !== this.currentIndex() && newIndex < this.vocabularies().length) {
      this.currentIndex.set(newIndex);
    }

    // Detect end of scroll
    if (scrollTop + height >= container.scrollHeight - 10) {
      this.finished.set(true);
    } else {
      this.finished.set(false);
    }
  }

  restart() {
    this.currentIndex.set(0);
    this.finished.set(false);
    this.scrollToCard(0);
  }

  startQuiz() {
    const lessonId = this.route.snapshot.paramMap.get('id');
    this.router.navigate([`/lessons/${lessonId}/quiz`]);
  }

  startGrammarPractice() {
    const lessonId = this.route.snapshot.paramMap.get('id');
    const levelId = this.route.snapshot.queryParamMap.get('levelId');
    this.router.navigate([`/lessons/${lessonId}/grammar`], levelId ? { queryParams: { levelId } } : {});
  }

  goBack() {
    const levelId = this.route.snapshot.queryParamMap.get('levelId');
    if (levelId) {
      this.router.navigate(['/lessons/level', levelId]);
    } else {
      this.router.navigate(['/']);
    }
  }

  // Writing practice
  startWritingPractice() {
    this.activeWritingWords.set(this.vocabularies());
    this.wrongWords.set([]);
    this.writingIndex.set(0);
    this.userInput.set('');
    this.submitted.set(false);
    this.isCorrect.set(null);
    this.correctCount.set(0);
    this.attemptCount.set(0);
    this.firstAttemptScore.set(null);
    this.mode.set('writing');
  }

  setUserInput(value: string) {
    this.userInput.set(value);
  }

  submitAnswer() {
    const word = this.writingWord();
    const correct = this.userInput().trim() === word.germanWord;
    this.isCorrect.set(correct);
    if (correct) {
      this.correctCount.update(c => c + 1);
    } else {
      this.wrongWords.update(words => [...words, word]);
    }
    this.submitted.set(true);
  }

  nextWritingCard() {
    if (this.writingIndex() < this.activeWritingWords().length - 1) {
      this.writingIndex.update(i => i + 1);
      this.userInput.set('');
      this.submitted.set(false);
      this.isCorrect.set(null);
    } else {
      this.attemptCount.update(c => c + 1);

      if (this.firstAttemptScore() === null) {
        const lessonId = Number(this.route.snapshot.paramMap.get('id'));
        const score = this.writingScore();
        this.progressService.saveProgress({ lessonId, score }).subscribe();
        this.firstAttemptScore.set(score);
      }

      if (this.wrongWords().length === 0) {
        this.mode.set('writing-summary');
      } else {
        this.mode.set('writing-done');
      }
    }
  }

  retryWrongAnswers() {
    this.activeWritingWords.set(this.wrongWords());
    this.wrongWords.set([]);
    this.writingIndex.set(0);
    this.userInput.set('');
    this.submitted.set(false);
    this.isCorrect.set(null);
    this.correctCount.set(0);
    this.mode.set('writing');
  }
}
