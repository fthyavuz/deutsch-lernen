import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLessonService } from '../../../../shared/services/admin-lesson.service';
import { LevelService } from '../../../../shared/services/level.service';
import { Router } from '@angular/router';
import { AdminLessonDTO } from '../../../../shared/models/admin-lesson.model';
import { LevelDTO } from '../../../../shared/models/level.model';

@Component({
  selector: 'app-lesson-list',
  imports: [CommonModule],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.css',
})
export class LessonListComponent {
  private service = inject(AdminLessonService);
  private levelService = inject(LevelService);
  private router = inject(Router);

  lessons = signal<AdminLessonDTO[]>([]);
  levels = signal<LevelDTO[]>([]);
  selectedLevelId = signal<number | null>(null);

  filteredLessons = computed(() => {
    const id = this.selectedLevelId();
    return id === null ? this.lessons() : this.lessons().filter(l => l.levelId === id);
  });

  ngOnInit() {
    this.load();
    this.levelService.getAllLevels().subscribe(data => this.levels.set(data));
  }

  load() {
    this.service.getAll().subscribe(data => this.lessons.set(data));
  }

  filterByLevel(id: number | null) {
    this.selectedLevelId.set(id);
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
