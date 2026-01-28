import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VocabularyService } from '../../shared/services/vocabulary.service';
import { VocabularyDTO } from '../../shared/models/vocabulary.model';
@Component({
  selector: 'app-flashcard',
  imports: [CommonModule],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.css',
})
export class FlashcardComponent implements OnInit {
  vocabularies = signal<VocabularyDTO[]>([]);
  currentIndex = signal(0);
  showBack = signal(false);
  showTurkish = signal(false);

  constructor(private vocabularyService: VocabularyService) { }

  ngOnInit() {
    const lessonId = 1; // replace with dynamic lesson ID if needed
    this.vocabularyService.getByLesson(lessonId).subscribe(data => {
      this.vocabularies.set(data);
    });
  }

  nextCard() {
    const next = this.currentIndex() + 1;
    if (next < this.vocabularies().length) {
      this.currentIndex.set(next);
      this.showBack.set(false);
      this.showTurkish.set(false);
    }
  }

  previousCard() {
    const prev = this.currentIndex() - 1;
    if (prev >= 0) {
      this.currentIndex.set(prev);
      this.showBack.set(false);
      this.showTurkish.set(false);
    }
  }

  toggleBack() {
    this.showBack.set(!this.showBack());
  }

  toggleTurkish() {
    this.showTurkish.set(!this.showTurkish());
  }
}
