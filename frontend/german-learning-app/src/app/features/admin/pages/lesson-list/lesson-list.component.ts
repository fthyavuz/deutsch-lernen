import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLessonService } from '../../../../shared/services/admin-lesson.service';
import { Router } from '@angular/router';
import { AdminLessonDTO } from '../../../../shared/models/admin-lesson.model';

@Component({
  selector: 'app-lesson-list',
  imports: [CommonModule],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.css',
})
export class LessonListComponent {
  private service = inject(AdminLessonService);
  private router = inject(Router);

  lessons = signal<AdminLessonDTO[]>([]);

  ngOnInit() {
    this.load();
  }
  load() {
    this.service.getAll().subscribe(data => this.lessons.set(data));
  }

  create() {
    this.router.navigate(['/admin/lessons/new']);
  }

  goToImport() {
    this.router.navigate(['/admin/lessons/import']);
  }

  edit(id: number) {
    this.router.navigate(['/admin/lessons/edit', id]);
  }

  open(id: number) {
    this.router.navigate(['/admin/lessons', id]);
  }

  remove(id: number) {
    if (!confirm('Delete lesson?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
