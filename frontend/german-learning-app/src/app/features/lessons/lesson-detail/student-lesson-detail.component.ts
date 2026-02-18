import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VocabularyService } from '../../../shared/services/vocabulary.service';
import { VocabularyDTO } from '../../../shared/models/vocabulary.model';
import { FlashcardComponent } from './flashcard/flashcard.component';

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

  vocabularies = signal<VocabularyDTO[]>([]);
  currentIndex = signal(0);
  loading = signal(true);
  finished = signal(false);

  currentVocabulary = computed(() => this.vocabularies()[this.currentIndex()]);

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

  goBack() {
    const levelId = this.route.snapshot.queryParamMap.get('levelId');
    if (levelId) {
      this.router.navigate(['/lessons/level', levelId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
