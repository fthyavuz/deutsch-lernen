import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GrammarService } from '../../../shared/services/grammar.service';
import { GrammarTopicDTO, GrammarExerciseDTO } from '../../../shared/models/grammar.model';

type GrammarMode = 'topics' | 'cards' | 'exercises' | 'exercises-done' | 'exercises-summary';

@Component({
  selector: 'app-grammar-practice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grammar-practice.component.html',
  styleUrl: './grammar-practice.component.css',
})
export class GrammarPracticeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private grammarService = inject(GrammarService);

  lessonId = signal(0);
  topics = signal<GrammarTopicDTO[]>([]);
  loading = signal(true);

  activeTopic = signal<GrammarTopicDTO | null>(null);
  mode = signal<GrammarMode>('topics');

  // Card swipe state
  cardIndex = signal(0);

  // Exercise practice state (mirrors writing practice pattern)
  activeExercises = signal<GrammarExerciseDTO[]>([]);
  wrongExercises = signal<GrammarExerciseDTO[]>([]);
  exerciseIndex = signal(0);
  userInput = signal('');
  submitted = signal(false);
  isCorrect = signal<boolean | null>(null);
  correctAnswer = signal('');
  correctCount = signal(0);
  attemptCount = signal(0);
  firstAttemptScore = signal<number | null>(null);

  currentCard = computed(() => this.activeTopic()?.cards[this.cardIndex()] ?? null);
  currentExercise = computed(() => this.activeExercises()[this.exerciseIndex()] ?? null);

  exerciseScore = computed(() => {
    const total = this.activeExercises().length;
    return total > 0 ? Math.round((this.correctCount() / total) * 100) : 0;
  });

  currentExamples = computed(() => {
    const card = this.currentCard();
    if (!card?.examples) return [];
    return card.examples.split('|').map(s => s.trim()).filter(s => s.length > 0);
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.lessonId.set(id);
    this.grammarService.getByLesson(id).subscribe({
      next: (data) => { this.topics.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.router.navigate(['/404']); }
    });
  }

  selectTopic(topic: GrammarTopicDTO) {
    this.activeTopic.set(topic);
    this.cardIndex.set(0);
    this.mode.set('cards');
  }

  nextCard() {
    const cards = this.activeTopic()!.cards;
    if (this.cardIndex() < cards.length - 1) {
      this.cardIndex.update(i => i + 1);
    } else {
      this.startExercises();
    }
  }

  prevCard() {
    if (this.cardIndex() > 0) this.cardIndex.update(i => i - 1);
  }

  startExercises() {
    this.activeExercises.set(this.activeTopic()!.exercises);
    this.wrongExercises.set([]);
    this.exerciseIndex.set(0);
    this.userInput.set('');
    this.submitted.set(false);
    this.isCorrect.set(null);
    this.correctCount.set(0);
    this.attemptCount.set(0);
    this.firstAttemptScore.set(null);
    this.mode.set('exercises');
  }

  setUserInput(value: string) { this.userInput.set(value); }

  submitAnswer() {
    const exercise = this.currentExercise();
    if (!exercise || !this.userInput().trim()) return;

    this.grammarService.submitAnswer({ exerciseId: exercise.id, userAnswer: this.userInput() }).subscribe(res => {
      this.isCorrect.set(res.correct);
      this.correctAnswer.set(res.correctAnswer);
      if (res.correct) {
        this.correctCount.update(c => c + 1);
      } else {
        this.wrongExercises.update(arr => [...arr, exercise]);
      }
      this.submitted.set(true);
    });
  }

  nextExercise() {
    if (this.exerciseIndex() < this.activeExercises().length - 1) {
      this.exerciseIndex.update(i => i + 1);
      this.userInput.set('');
      this.submitted.set(false);
      this.isCorrect.set(null);
      this.correctAnswer.set('');
    } else {
      this.attemptCount.update(c => c + 1);
      if (this.firstAttemptScore() === null) {
        this.firstAttemptScore.set(this.exerciseScore());
      }
      if (this.wrongExercises().length === 0) {
        this.mode.set('exercises-summary');
      } else {
        this.mode.set('exercises-done');
      }
    }
  }

  retryWrong() {
    this.activeExercises.set(this.wrongExercises());
    this.wrongExercises.set([]);
    this.exerciseIndex.set(0);
    this.userInput.set('');
    this.submitted.set(false);
    this.isCorrect.set(null);
    this.correctAnswer.set('');
    this.correctCount.set(0);
    this.mode.set('exercises');
  }

  backToTopics() {
    this.activeTopic.set(null);
    this.mode.set('topics');
  }

  goBack() {
    const levelId = this.route.snapshot.queryParamMap.get('levelId');
    if (levelId) {
      this.router.navigate(['/lessons/level', levelId]);
    } else {
      this.router.navigate(['/lessons', this.lessonId()]);
    }
  }
}
