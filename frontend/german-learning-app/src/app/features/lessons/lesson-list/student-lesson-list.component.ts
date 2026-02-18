import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LevelService } from '../../../shared/services/level.service';
import { ProgressService } from '../../../shared/services/progress.service';
import { LevelDTO } from '../../../shared/models/level.model';
import { UserProgressResponseDTO } from '../../../shared/models/user-progress.model';
import { LessonDTO } from '../../../shared/models/lesson.model';
import { forkJoin, map, switchMap } from 'rxjs';

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
  private route = inject(ActivatedRoute);

  level = signal<LevelWithProgress | null>(null);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    this.route.params.pipe(
      map(params => params['levelId'] ? Number(params['levelId']) : null),
      switchMap(levelId => {
        const progress$ = this.progressService.getMyProgress();

        if (levelId) {
          // Fetch specific level
          return forkJoin({
            level: this.levelService.getLevelById(levelId),
            progress: progress$
          }).pipe(
            map(({ level, progress }) => [this.processLevel(level, progress)])
          );
        } else {
          // Fetch all levels (fallback)
          return forkJoin({
            levels: this.levelService.getAllLevels(),
            progress: progress$
          }).pipe(
            map(({ levels, progress }) => levels.map(l => this.processLevel(l, progress)))
          );
        }
      })
    ).subscribe({
      next: (processedLevels) => {
        if (processedLevels && processedLevels.length > 0) {
          this.level.set(processedLevels[0]);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.loading.set(false);
      }
    });
  }

  private processLevel(level: LevelDTO, userProgress: UserProgressResponseDTO[]): LevelWithProgress {
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
  }

  startLesson(id: number) {
    const currentLevel = this.level();
    this.router.navigate(['/lessons', id], {
      queryParams: { levelId: currentLevel?.id }
    });
  }

  goBack() {
    this.router.navigate(['/lessons']);
  }
}
