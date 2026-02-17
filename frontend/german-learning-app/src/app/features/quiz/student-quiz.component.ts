import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../shared/services/quiz.service';
import { QuizQuestionDTO, QuizQuestionType } from '../../shared/models/quiz.model';
import { ProgressService } from '../../shared/services/progress.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-student-quiz',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './student-quiz.component.html',
    styleUrls: ['./student-quiz.component.css', './student-quiz-matching.css']
})
export class StudentQuizComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private quizService = inject(QuizService);
    private progressService = inject(ProgressService);

    lessonId!: number;
    questions = signal<QuizQuestionDTO[]>([]);
    currentIndex = signal(0);
    loading = signal(true);

    // Quiz State
    selectedOption = signal<string | null>(null);
    userInput = signal(''); // For fill-in-the-blank
    isAnswerSubmitted = signal(false);
    isCorrect = signal(false);
    correctAnswer = signal<string | null>(null); // Stores the option key (optionA, etc.)
    backendCorrectAnswer = signal<string | null>(null); // Stores the raw text from backend

    // Results
    score = signal(0);
    quizCompleted = signal(false);

    // Matching State
    matchingItems = signal<{ german: string; translation: string }[]>([]);
    shuffledTranslations = signal<string[]>([]);
    userMatches = signal<Map<string, string>>(new Map()); // german -> translation
    selectedGerman = signal<string | null>(null);
    selectedTranslation = signal<string | null>(null);

    // Computed
    get currentQuestion() {
        return this.questions()[this.currentIndex()];
    }

    get progressPercentage() {
        return ((this.currentIndex()) / this.questions().length) * 100;
    }

    // Expose Math to template
    Math = Math;

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.lessonId = Number(params.get('lessonId'));
            if (this.lessonId) {
                this.loadQuiz();
            }
        });
    }

    loadQuiz() {
        this.loading.set(true);
        this.quizService.getQuizByLesson(this.lessonId).subscribe({
            next: (data) => {
                this.questions.set(data);
                this.loading.set(false);
                // Initialize matching for first question if needed
                if (data.length > 0 && data[0].type === 'MATCHING') {
                    this.initializeMatching(data[0]);
                }
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
            }
        });
    }

    initializeMatching(question: QuizQuestionDTO) {
        if (!question.matchingPairs) return;

        // Parse "Hund:Dog|Katze:Cat|Haus:House"
        const pairs = question.matchingPairs.split('|')
            .map(p => p.trim())
            .filter(p => p.includes(':'))
            .map(pair => {
                const [german, translation] = pair.split(':').map(s => s.trim());
                return { german, translation };
            });

        this.matchingItems.set(pairs);

        // Shuffle translations for right column
        const translations = pairs.map(p => p.translation);
        const shuffled = [...translations].sort(() => Math.random() - 0.5);
        this.shuffledTranslations.set(shuffled);

        this.userMatches.set(new Map());
    }

    selectOption(option: string) {
        if (this.isAnswerSubmitted()) return;
        this.selectedOption.set(option);
    }

    onInputChange(value: string) {
        this.userInput.set(value);
    }

    // Matching methods
    selectGermanWord(word: string) {
        if (this.isAnswerSubmitted()) return;
        this.selectedGerman.set(word);

        // If translation already selected, create match
        if (this.selectedTranslation()) {
            this.createMatch(word, this.selectedTranslation()!);
        }
    }

    selectTranslation(translation: string) {
        if (this.isAnswerSubmitted()) return;
        this.selectedTranslation.set(translation);

        // If German word already selected, create match
        if (this.selectedGerman()) {
            this.createMatch(this.selectedGerman()!, translation);
        }
    }

    createMatch(german: string, translation: string) {
        const matches = new Map(this.userMatches());
        matches.set(german, translation);
        this.userMatches.set(matches);

        // Clear selections
        this.selectedGerman.set(null);
        this.selectedTranslation.set(null);
    }

    unmatch(german: string) {
        if (this.isAnswerSubmitted()) return;
        const matches = new Map(this.userMatches());
        matches.delete(german);
        this.userMatches.set(matches);
    }

    isMatched(item: string, type: 'german' | 'translation'): boolean {
        const matches = this.userMatches();
        if (type === 'german') {
            return matches.has(item);
        } else {
            return Array.from(matches.values()).includes(item);
        }
    }

    submitAnswer() {
        let answerToSend: string;

        if (this.currentQuestion.type === 'FILL_IN_THE_BLANK') {
            if (!this.userInput()) return;
            answerToSend = this.userInput();
        } else if (this.currentQuestion.type === 'MATCHING') {
            // Validate all items are matched
            if (this.userMatches().size !== this.matchingItems().length) {
                return;
            }

            // Format matches as "Hund:Dog|Katze:Cat"
            const matchesArray = Array.from(this.userMatches().entries())
                .map(([german, translation]) => `${german}:${translation}`);
            answerToSend = matchesArray.join('|');
        } else {
            if (!this.selectedOption()) return;
            // Send the actual text value, not the option key
            answerToSend = this.getOptionValue(this.selectedOption()!)!;
        }

        const request = {
            questionId: this.currentQuestion.id,
            selectedAnswer: answerToSend
        };

        this.quizService.submitAnswer(request).subscribe({
            next: (res) => {
                this.isCorrect.set(res.correct);
                this.backendCorrectAnswer.set(res.correctAnswer);

                // Map the backend's answer text back to the option key (optionA, optionB, etc)
                // so we can highlight the correct button
                const answerKey = this.findOptionKeyByValue(res.correctAnswer);
                this.correctAnswer.set(answerKey);

                this.isAnswerSubmitted.set(true);

                if (res.correct) {
                    this.score.update(s => s + 1);
                }
            }
        });
    }

    findOptionKeyByValue(value: string): string | null {
        const q = this.currentQuestion;
        if (q.optionA === value) return 'optionA';
        if (q.optionB === value) return 'optionB';
        if (q.optionC === value) return 'optionC';
        if (q.optionD === value) return 'optionD';
        return null;
    }

    nextQuestion() {
        if (this.currentIndex() < this.questions().length - 1) {
            this.currentIndex.update(i => i + 1);
            this.resetQuestionState();

            // Initialize matching for next question if needed
            const nextQ = this.questions()[this.currentIndex()];
            if (nextQ.type === 'MATCHING') {
                this.initializeMatching(nextQ);
            }
        } else {
            this.finishQuiz();
        }
    }

    getOptionValue(key: string): string | undefined {
        const q = this.currentQuestion;
        if (key === 'optionA') return q.optionA;
        if (key === 'optionB') return q.optionB;
        if (key === 'optionC') return q.optionC;
        if (key === 'optionD') return q.optionD;
        return undefined;
    }

    resetQuestionState() {
        this.selectedOption.set(null);
        this.userInput.set('');
        this.isAnswerSubmitted.set(false);
        this.isCorrect.set(false);
        this.correctAnswer.set(null);
        this.backendCorrectAnswer.set(null);

        // Reset matching state
        this.selectedGerman.set(null);
        this.selectedTranslation.set(null);
        this.userMatches.set(new Map());
    }

    finishQuiz() {
        this.quizCompleted.set(true);
        const finalScore = Math.round((this.score() / this.questions().length) * 100);

        this.progressService.saveProgress({
            lessonId: this.lessonId,
            score: finalScore
        }).subscribe(() => {
            console.log('Progress saved');
        });
    }

    backToLessons() {
        this.router.navigate(['/']);
    }

    retry() {
        // Reload logic: reset everything
        this.currentIndex.set(0);
        this.score.set(0);
        this.quizCompleted.set(false);
        this.resetQuestionState();
        // Optional: Shuffle questions?
    }
}
