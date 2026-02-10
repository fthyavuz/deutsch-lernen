import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminImportService } from '../../../../shared/services/admin-import.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-lesson-import',
    imports: [CommonModule, FormsModule],
    templateUrl: './lesson-import.component.html',
    styleUrl: './lesson-import.component.css'
})
export class LessonImportComponent {
    private importService = inject(AdminImportService);
    private router = inject(Router);

    jsonContent = '';
    importing = signal(false);
    error = signal<string | null>(null);
    success = signal<boolean>(false);

    onImport() {
        if (!this.jsonContent.trim()) {
            this.error.set('Please paste JSON content');
            return;
        }

        try {
            const data = JSON.parse(this.jsonContent);
            this.importing.set(true);
            this.error.set(null);
            this.success.set(false);

            this.importService.importLesson(data).subscribe({
                next: () => {
                    this.importing.set(false);
                    this.success.set(true);
                    setTimeout(() => this.router.navigate(['/admin/lessons']), 2000);
                },
                error: (err) => {
                    this.importing.set(false);
                    this.error.set(err.error?.message || 'Import failed. Check JSON structure.');
                }
            });
        } catch (e) {
            this.error.set('Invalid JSON format');
        }
    }

    cancel() {
        this.router.navigate(['/admin/lessons']);
    }
}
