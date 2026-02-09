import { Component, inject, OnInit, signal } from '@angular/core';
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

  // Computed would be better but simple getter for now
  get currentVocabulary() {
    return () => this.vocabularies()[this.currentIndex()];
  }

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
      }
    });
  }

  next() {
    if (this.currentIndex() < this.vocabularies().length - 1) {
      this.currentIndex.update(i => i + 1);
    } else {
      this.finished.set(true);
    }
  }

  prev() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
      this.finished.set(false);
    }
  }

  restart() {
    this.currentIndex.set(0);
    this.finished.set(false);
  }

  startQuiz() {
    const lessonId = this.route.snapshot.paramMap.get('id');
    this.router.navigate([`/lessons/${lessonId}/quiz`]);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
