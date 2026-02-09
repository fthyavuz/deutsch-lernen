import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminVocabularyService } from '../../../../../shared/services/admin-vocabulary.service';
import { VocabularyDTO } from '../../../../../shared/models/vocabulary.model';

@Component({
    selector: 'app-vocabulary-list',
    imports: [CommonModule],
    templateUrl: './vocabulary-list.component.html',
    styleUrl: './vocabulary-list.component.css'
})
export class VocabularyListComponent implements OnChanges {
    @Input() lessonId!: number;

    private service = inject(AdminVocabularyService);
    private router = inject(Router);

    vocabularies = signal<VocabularyDTO[]>([]);

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['lessonId'] && this.lessonId) {
            this.loadVocabularies();
        }
    }

    loadVocabularies() {
        this.service.getByLesson(this.lessonId).subscribe(data => {
            this.vocabularies.set(data);
        });
    }

    edit(id: number) {
        this.router.navigate(['/admin/lessons', this.lessonId, 'vocabulary', id]);
    }

    delete(id: number) {
        if (confirm('Are you sure you want to delete this vocabulary?')) {
            this.service.delete(id).subscribe(() => {
                this.loadVocabularies();
            });
        }
    }
}
