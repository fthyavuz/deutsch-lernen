import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LessonService } from '../../../shared/services/lesson.service';
import { ProgressService } from '../../../shared/services/progress.service';
import { LessonDTO } from '../../../shared/models/lesson.model';
import { UserProgressResponseDTO } from '../../../shared/models/user-progress.model';

interface LessonWithProgress extends LessonDTO {
  progress?: UserProgressResponseDTO;
}

@Component({
  selector: 'app-student-lesson-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-lesson-list.component.html',
  styleUrl: './student-lesson-list.component.css',
})
export class StudentLessonListComponent implements OnInit {
  private lessonService = inject(LessonService);
  private progressService = inject(ProgressService);
  private router = inject(Router);

  lessons = signal<LessonWithProgress[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    // Fetch both lessons and progress
    const lessons$ = this.lessonService.getAllLessons();
    const progress$ = this.progressService.getMyProgress();

    // Use a simple approach: subscribe to both, then combine
    // In a real app, forkJoin is better, but this is fine for now
    lessons$.subscribe({
      next: (allLessons) => {
        progress$.subscribe({
          next: (userProgress) => {
            const combined = allLessons.map(lesson => {
              const prog = userProgress.find(p => p.lessonId === lesson.id);
              return { ...lesson, progress: prog };
            });
            // Sort by lessonOrder if available, or id
            combined.sort((a, b) => (a.lessonOrder || a.id) - (b.lessonOrder || b.id));
            this.lessons.set(combined);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error fetching progress:', err);
            // Still show lessons even if progress fails
            this.lessons.set(allLessons);
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching lessons:', err);
        this.loading.set(false);
      }
    });
  }

  startLesson(id: number) {
    this.router.navigate(['/lessons', id]);
  }
}
