import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminVocabularyService } from '../../../../../shared/services/admin-vocabulary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminVocabularyRequest } from '../../../../../shared/models/admin-vocabulary-request.model';

@Component({
    selector: 'app-lesson-vocabulary-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './lesson-vocabulary-form.component.html',
    styleUrl: './lesson-vocabulary-form.component.css'
})
export class LessonVocabularyFormComponent {
    private fb = inject(FormBuilder);
    private service = inject(AdminVocabularyService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    lessonId!: number;

    form = this.fb.nonNullable.group({
        germanWord: ['', Validators.required],
        englishMeaning: ['', Validators.required],
        turkishMeaning: ['', Validators.required],
        germanExplanation: ['', Validators.required],
        relatedWords: ['', Validators.required]
    });

    ngOnInit() {
        this.lessonId = Number(this.route.snapshot.paramMap.get('id'));
    }

    submit() {
        if (this.form.invalid) return;

        const request: AdminVocabularyRequest = {
            ...this.form.getRawValue(),
            lessonId: this.lessonId
        };

        this.service.create(request).subscribe(() => {
            this.router.navigate(['../../'], { relativeTo: this.route });
        });
    }

    cancel() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }
}
