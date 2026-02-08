import { Component, input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminQuizService } from '../../../../../shared/services/admin-quiz.service';
import { AdminQuizQuestionResponseDTO } from '../../../../../shared/models/admin-quiz.model';


@Component({
  selector: 'app-quiz-list',
  imports: [CommonModule],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.css',
})
export class QuizListComponent implements OnInit {
  lessonId = input.required<number>();
  quizzes = signal<AdminQuizQuestionResponseDTO[]>([]);

  private quizService = inject(AdminQuizService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  ngOnInit() {
    this.loadQuizzes();
  }
  loadQuizzes() {
    this.quizService.getByLesson(this.lessonId()).subscribe(data => {
      this.quizzes.set(data);
    });
  }
  editQuiz(id: number) {
    this.router.navigate(['quiz/edit', id], { relativeTo: this.route });
  }
  deleteQuiz(id: number) {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.quizService.delete(id).subscribe(() => this.loadQuizzes());
    }
  }
}
