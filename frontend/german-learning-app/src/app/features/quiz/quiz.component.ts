import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../shared/services/quiz.service';
import { QuizQuestionDTO } from '../../shared/models/quiz.model';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent implements OnInit {
  questions = signal<QuizQuestionDTO[]>([]);
  currentIndex = signal(0);
  userScore = signal(0);
  completed = signal(false);

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    const lessonId = 1; // replace dynamically if needed
    this.quizService.getQuizByLesson(lessonId).subscribe(data => this.questions.set(data));
  }

  submitAnswer(answer: string) {
    const question = this.questions()[this.currentIndex()];
    this.quizService.submitAnswer({ questionId: question.id, selectedAnswer: answer }).subscribe(res => {
      if (res.correct) {
        this.userScore.set(this.userScore() + 1);
      }

      const next = this.currentIndex() + 1;
      if (next < this.questions().length) {
        this.currentIndex.set(next);
      } else {
        this.completed.set(true);
      }
    });
  }
}
