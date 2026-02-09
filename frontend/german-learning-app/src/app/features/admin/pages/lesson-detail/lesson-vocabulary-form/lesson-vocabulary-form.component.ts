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
    vocabularyId: number | null = null;

    form = this.fb.nonNullable.group({
        germanWord: ['', Validators.required],
        englishMeaning: ['', Validators.required],
        turkishMeaning: ['', Validators.required],
        germanExplanation: ['', Validators.required],
        relatedWords: ['', Validators.required],
        germanSentence: [''],
        englishSentenceTranslation: [''],
        turkishSentenceTranslation: ['']
    });

    ngOnInit() {
        this.lessonId = Number(this.route.snapshot.paramMap.get('id'));
        const vocabId = this.route.snapshot.paramMap.get('vocabularyId');

        if (vocabId) {
            this.vocabularyId = Number(vocabId);
            this.loadVocabulary(this.vocabularyId);
        }
    }

    loadVocabulary(id: number) {
        this.service.getByLesson(this.lessonId).subscribe(vocabularies => {
            const vocab = vocabularies.find(v => v.id === id);
            if (vocab) {
                this.form.patchValue({
                    germanWord: vocab.germanWord,
                    englishMeaning: vocab.englishMeaning,
                    turkishMeaning: vocab.turkishMeaning,
                    germanExplanation: vocab.germanExplanation,
                    relatedWords: vocab.relatedWords
                });

                // Load first example sentence if exists
                if (vocab.exampleSentences && vocab.exampleSentences.length > 0) {
                    const firstSentence = vocab.exampleSentences[0];
                    this.form.patchValue({
                        germanSentence: firstSentence.germanSentence,
                        englishSentenceTranslation: firstSentence.englishTranslation,
                        turkishSentenceTranslation: firstSentence.turkishTranslation
                    });
                }
            }
        });
    }

    submit() {
        if (this.form.invalid) return;

        const formValue = this.form.getRawValue();
        const request: AdminVocabularyRequest = {
            lessonId: this.lessonId,
            germanWord: formValue.germanWord,
            englishMeaning: formValue.englishMeaning,
            turkishMeaning: formValue.turkishMeaning,
            germanExplanation: formValue.germanExplanation,
            relatedWords: formValue.relatedWords,
            exampleSentences: [{
                germanSentence: formValue.germanSentence,
                englishTranslation: formValue.englishSentenceTranslation,
                turkishTranslation: formValue.turkishSentenceTranslation
            }]
        };

        if (this.vocabularyId) {
            // Update existing
            this.service.update(this.vocabularyId, request).subscribe(() => {
                this.router.navigate(['../../'], { relativeTo: this.route });
            });
        } else {
            // Create new
            this.service.create(request).subscribe(() => {
                this.router.navigate(['../../'], { relativeTo: this.route });
            });
        }
    }

    cancel() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }
}
