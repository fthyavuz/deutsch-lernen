import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminQuizService } from '../../../../../shared/services/admin-quiz.service';
import { QuizQuestionType } from '../../../../../shared/models/admin-quiz.model';

@Component({
  selector: 'app-quiz-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quiz-form.component.html',
  styleUrl: './quiz-form.component.css',
})
export class QuizFormComponent {
  private fb = inject(FormBuilder);
  private quizService = inject(AdminQuizService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  lessonId = signal<number>(0);
  quizId = signal<number | null>(null);
  quizTypes = Object.values(QuizQuestionType);

  form = this.fb.group({
    type: [QuizQuestionType.MULTIPLE_CHOICE, Validators.required],
    question: ['', Validators.required],
    optionA: ['', Validators.required],
    optionB: ['', Validators.required],
    optionC: ['', Validators.required],
    optionD: ['', Validators.required],
    correctAnswer: ['', Validators.required],
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) this.lessonId.set(id);

      const quizId = params.get('quizId');
      if (quizId) {
        this.quizId.set(Number(quizId));
        this.loadQuiz(Number(quizId));
      }
    });

    // Reset options if type changes
    this.form.get('type')?.valueChanges.subscribe(type => {
      this.updateValidators(type as QuizQuestionType);
    });

    // Initial check
    this.updateValidators(this.form.get('type')?.value as QuizQuestionType);
  }

  private updateValidators(type: QuizQuestionType) {
    const options = ['optionA', 'optionB', 'optionC', 'optionD'];

    if (type === QuizQuestionType.MULTIPLE_CHOICE) {
      options.forEach(opt => {
        this.form.get(opt)?.setValidators(Validators.required);
        this.form.get(opt)?.updateValueAndValidity();
      });
    } else {
      options.forEach(opt => {
        this.form.get(opt)?.clearValidators();
        this.form.get(opt)?.updateValueAndValidity();
      });
    }
  }


  loadQuiz(id: number) {
    // We don't have a getById in the service yet, usually we might get it from the list or add a getById endpoint.
    // Assuming for now we might need to fetch all and find, or add getById. 
    // Let's add getById to service actually, or just use the list for now if the API support isn't explicitly shown.
    // The user showed "getByLesson", "update", "delete", "create". 
    // IMPORTANT: The user did NOT show a getById in the API description.
    // I will try to fetch all by lesson and find the one to edit, or asking the user might be too slow.
    // I'll assume standard REST behavior and try to implement it, but for safety, I'll fetch by lesson and filter since I know that endpoint exists.

    if (this.lessonId()) {
      this.quizService.getByLesson(this.lessonId()).subscribe(quizzes => {
        const quiz = quizzes.find(q => q.id === id);
        if (quiz) {
          this.form.patchValue({
            type: quiz.type,
            question: quiz.question,
            optionA: quiz.optionA,
            optionB: quiz.optionB,
            optionC: quiz.optionC,
            optionD: quiz.optionD,
            correctAnswer: quiz.correctAnswer
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const request = {
      lessonId: this.lessonId(),
      type: formValue.type!,
      question: formValue.question!,
      optionA: formValue.optionA || '',
      optionB: formValue.optionB || '',
      optionC: formValue.optionC || '',
      optionD: formValue.optionD || '',
      correctAnswer: formValue.correctAnswer!,
    };

    if (this.quizId()) {
      this.quizService.update(this.quizId()!, request).subscribe(() => {
        this.goBack();
      });
    } else {
      this.quizService.create(request).subscribe(() => {
        this.goBack();
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/lessons', this.lessonId()]);
  }
}
