import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LevelService } from '../../../shared/services/level.service';
import { ProgressService } from '../../../shared/services/progress.service';
import { LevelDTO } from '../../../shared/models/level.model';
import { UserProgressResponseDTO } from '../../../shared/models/user-progress.model';
import { LessonDTO } from '../../../shared/models/lesson.model';

interface LessonWithProgress extends LessonDTO {
  progress?: UserProgressResponseDTO;
}

interface LevelWithProgress extends Omit<LevelDTO, 'lessons'> {
  lessons: LessonWithProgress[];
  completedCount: number;
  totalCount: number;
}

@Component({
  selector: 'app-student-lesson-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-lesson-list.component.html',
  styleUrl: './student-lesson-list.component.css',
})
export class StudentLessonListComponent implements OnInit {
  private levelService = inject(LevelService);
  private progressService = inject(ProgressService);
  private router = inject(Router);

  levels = signal<LevelWithProgress[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    // Fetch levels (which include lessons) and progress
    const levels$ = this.levelService.getAllLevels();
    const progress$ = this.progressService.getMyProgress();

    levels$.subscribe({
      next: (allLevels) => {
        progress$.subscribe({
          next: (userProgress) => {
            const combined: LevelWithProgress[] = allLevels.map(level => {
              const lessonsWithProg = (level.lessons || []).map(lesson => {
                const prog = userProgress.find(p => p.lessonId === lesson.id);
                return { ...lesson, progress: prog };
              });

              // Sort lessons within the level
              lessonsWithProg.sort((a, b) => (a.lessonOrder || a.id) - (b.lessonOrder || b.id));

              const completedCount = lessonsWithProg.filter(l => l.progress?.completed).length;

              return {
                ...level,
                lessons: lessonsWithProg,
                completedCount,
                totalCount: lessonsWithProg.length
              };
            });

            this.levels.set(combined);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error fetching progress:', err);
            // Still show levels/lessons even if progress fails
            const partial = allLevels.map(lvl => ({
              ...lvl,
              lessons: lvl.lessons || [],
              completedCount: 0,
              totalCount: (lvl.lessons || []).length
            }));
            this.levels.set(partial);
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching levels:', err);
        this.loading.set(false);
      }
    });
  }

  startLesson(id: number) {
    this.router.navigate(['/lessons', id]);
  }
}
