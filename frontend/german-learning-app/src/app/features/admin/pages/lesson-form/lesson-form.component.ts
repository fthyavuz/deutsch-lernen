import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminLessonDTO } from '../../../../shared/models/admin-lesson.model';
import { AdminLessonService } from '../../../../shared/services/admin-lesson.service';
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  lessonId?: number;

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    lessonOrder: [1, Validators.required]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.lessonId = +id;
      this.loadLesson(this.lessonId);
    }
  }

  loadLesson(id: number) {
    this.service.getAll().subscribe(lessons => {
      const lesson = lessons.find(l => l.id === id);
      if (!lesson) return;

      this.form.patchValue({
        title: lesson.title,
        description: lesson.description,
        lessonOrder: lesson.lessonOrder
      });
    });
  }

  submit() {
    const dto: AdminLessonDTO = this.form.getRawValue();

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
