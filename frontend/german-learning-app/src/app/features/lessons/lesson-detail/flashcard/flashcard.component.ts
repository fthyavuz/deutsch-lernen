import { Component, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VocabularyDTO } from '../../../../shared/models/vocabulary.model';

@Component({
    selector: 'app-flashcard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './flashcard.component.html',
    styleUrl: './flashcard.component.css',
})
export class FlashcardComponent {
    vocabulary = input.required<VocabularyDTO>();

    constructor() {
        // Reset card state when vocabulary changes
        effect(() => {
            this.vocabulary();
            this.isFlipped = false;
            this.showingEnglish = false;
            this.showingTurkish = false;
        });
    }

    isFlipped = false;
    showingEnglish = false;
    showingTurkish = false;

    get currentSentence() {
        return this.vocabulary().exampleSentences?.[0];
    }

    flip() {
        this.isFlipped = !this.isFlipped;
        // Reset states when flipping back to front, optional
        if (!this.isFlipped) {
            this.showingEnglish = false;
            this.showingTurkish = false;
        }
    }

    showEnglish(event: Event) {
        event.stopPropagation();
        this.showingEnglish = !this.showingEnglish;
        this.showingTurkish = false;
    }

    showTurkish(event: Event) {
        event.stopPropagation();
        this.showingTurkish = !this.showingTurkish;
        this.showingEnglish = false;
    }
}
