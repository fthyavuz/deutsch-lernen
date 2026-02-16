import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminLessonDTO } from '../../../../shared/models/admin-lesson.model';
import { AdminLessonService } from '../../../../shared/services/admin-lesson.service';
import { LevelService } from '../../../../shared/services/level.service';
import { LevelDTO } from '../../../../shared/models/level.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lesson-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lesson-form.component.html',
  styleUrl: './lesson-form.component.css',
})
export class LessonFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(AdminLessonService);
  private levelService = inject(LevelService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  lessonId?: number;
  levels = signal<LevelDTO[]>([]);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    lessonOrder: [1, Validators.required],
    levelId: [null as number | null, Validators.required]
  });

  ngOnInit() {
    this.loadLevels();
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.lessonId = +id;
      this.loadLesson(this.lessonId);
    }
  }

  loadLevels() {
    this.levelService.getAllLevels().subscribe(all => this.levels.set(all));
  }

  loadLesson(id: number) {
    this.service.getAll().subscribe(lessons => {
      const lesson = lessons.find(l => l.id === id);
      if (!lesson) return;

      this.form.patchValue({
        title: lesson.title,
        description: lesson.description,
        lessonOrder: lesson.lessonOrder,
        levelId: lesson.levelId || null
      });
    });
  }

  submit() {
    const dto: AdminLessonDTO = this.form.getRawValue() as any;

    if (this.isEditMode && this.lessonId) {
      this.service.update(this.lessonId, dto).subscribe(() => {
        this.router.navigate(['/admin/lessons']);
      });
    } else {
      this.service.create(dto).subscribe(() => {
        this.router.navigate(['/admin/lessons']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/lessons']);
  }
}
