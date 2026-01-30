import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminLessonService } from '../../../../shared/services/admin-lesson.service';
import { VocabularyListComponent } from './vocabulary-list/vocabulary-list.component';

@Component({
    selector: 'app-lesson-detail',
    imports: [CommonModule, VocabularyListComponent],
    templateUrl: './lesson-detail.component.html',
    styleUrl: './lesson-detail.component.css',
})
export class LessonDetailComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private lessonService = inject(AdminLessonService);

    lessonId = signal<number>(0);
    lessonTitle = signal<string>('Loading...');
    activeTab = signal<'vocab' | 'quiz'>('vocab');

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.lessonId.set(id);
            this.loadLessonDetails(id);
        }
    }

    loadLessonDetails(id: number) {
        this.lessonService.getAll().subscribe(lessons => {
            const lesson = lessons.find(l => l.id === id);
            if (lesson) {
                this.lessonTitle.set(lesson.title);
            }
        });
    }

    addVocabulary() {
        this.router.navigate(['vocab/new'], { relativeTo: this.route });
    }
}
