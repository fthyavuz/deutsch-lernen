import { Component, input, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminGrammarService } from '../../../../../shared/services/admin-grammar.service';
import { GrammarTopicDTO, GrammarCardDTO, GrammarExerciseDTO } from '../../../../../shared/models/grammar.model';

type EditMode = 'none' | 'topic' | 'card' | 'exercise';

@Component({
  selector: 'app-grammar-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grammar-list.component.html',
  styleUrl: './grammar-list.component.css',
})
export class GrammarListComponent implements OnInit {
  lessonId = input.required<number>();

  private grammarService = inject(AdminGrammarService);

  topics = signal<GrammarTopicDTO[]>([]);
  expandedTopicId = signal<number | null>(null);
  importing = signal(false);
  importError = signal<string | null>(null);
  importSuccess = signal(false);
  showImport = signal(false);
  jsonContent = '';
  copied = signal(false);

  // Inline edit state
  editMode = signal<EditMode>('none');
  editId = signal<number | null>(null);
  editParentId = signal<number | null>(null);

  // Form fields
  formName = signal('');
  formTitle = signal('');
  formExplanation = signal('');
  formExamples = signal('');
  formSentence = signal('');
  formAnswer = signal('');
  formHint = signal('');
  formOrderIndex = signal(0);

  get grammarPrompt(): string {
    return `Act as a German language teaching assistant. Generate grammar topic content for a JSON import.

For each grammar topic, provide:
- Rule cards (you decide the number — typically 2-4 per topic)
- Exactly 3 fill-in-the-blank exercises per card (so N cards = N×3 exercises total)
- All explanations and exercise sentences must be in German
- Examples should be real, natural German sentences

Return ONLY raw JSON in this exact structure:
{
  "topics": [
    {
      "name": "Akkusativ",
      "cards": [
        {
          "orderIndex": 1,
          "title": "Was ist der Akkusativ?",
          "explanation": "Der Akkusativ ist der 4. Fall...",
          "examples": "Ich sehe den Mann.|Er kauft einen Apfel.|Sie trinkt die Milch."
        }
      ],
      "exercises": [
        {
          "orderIndex": 1,
          "sentence": "Ich sehe ___ Mann. (der)",
          "answer": "den",
          "hint": "maskulin, definit"
        }
      ]
    }
  ]
}

--- DATA INPUT ---
Lesson ID: ${this.lessonId()}
Grammar topics to cover: [e.g. Akkusativ, Dativ]
Number of cards per topic: [e.g. 3]`;
  }

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.grammarService.getByLesson(this.lessonId()).subscribe(data => this.topics.set(data));
  }

  toggleTopic(id: number) {
    this.expandedTopicId.set(this.expandedTopicId() === id ? null : id);
  }

  copyPrompt() {
    navigator.clipboard.writeText(this.grammarPrompt).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  onImport() {
    if (!this.jsonContent.trim()) { this.importError.set('Paste JSON first'); return; }
    try {
      const data = JSON.parse(this.jsonContent);
      data.lessonId = this.lessonId();
      this.importing.set(true);
      this.importError.set(null);
      this.grammarService.importGrammar(data).subscribe({
        next: () => { this.importing.set(false); this.importSuccess.set(true); this.jsonContent = ''; this.loadTopics(); setTimeout(() => this.importSuccess.set(false), 3000); },
        error: (err) => { this.importing.set(false); this.importError.set(err.error?.message || 'Import failed'); }
      });
    } catch { this.importError.set('Invalid JSON'); }
  }

  // ── Topic CRUD ──────────────────────────────────────────────

  startAddTopic() {
    this.editMode.set('topic'); this.editId.set(null); this.formName.set('');
  }

  startEditTopic(topic: GrammarTopicDTO) {
    this.editMode.set('topic'); this.editId.set(topic.id); this.formName.set(topic.name);
  }

  saveTopic() {
    if (!this.formName().trim()) return;
    if (this.editId()) {
      this.grammarService.updateTopic(this.editId()!, this.formName()).subscribe(() => { this.cancelEdit(); this.loadTopics(); });
    } else {
      this.grammarService.createTopic(this.lessonId(), this.formName()).subscribe(() => { this.cancelEdit(); this.loadTopics(); });
    }
  }

  deleteTopic(id: number) {
    if (confirm('Delete this grammar topic and all its cards and exercises?')) {
      this.grammarService.deleteTopic(id).subscribe(() => this.loadTopics());
    }
  }

  // ── Card CRUD ────────────────────────────────────────────────

  startAddCard(topicId: number, currentCount: number) {
    this.editMode.set('card'); this.editId.set(null); this.editParentId.set(topicId);
    this.formTitle.set(''); this.formExplanation.set(''); this.formExamples.set('');
    this.formOrderIndex.set(currentCount + 1);
  }

  startEditCard(topicId: number, card: GrammarCardDTO) {
    this.editMode.set('card'); this.editId.set(card.id); this.editParentId.set(topicId);
    this.formTitle.set(card.title); this.formExplanation.set(card.explanation);
    this.formExamples.set(card.examples); this.formOrderIndex.set(card.orderIndex);
  }

  saveCard() {
    if (!this.formTitle().trim()) return;
    const payload = { topicId: this.editParentId()!, orderIndex: this.formOrderIndex(), title: this.formTitle(), explanation: this.formExplanation(), examples: this.formExamples() };
    if (this.editId()) {
      this.grammarService.updateCard(this.editId()!, payload).subscribe(() => { this.cancelEdit(); this.loadTopics(); });
    } else {
      this.grammarService.createCard(payload).subscribe(() => { this.cancelEdit(); this.loadTopics(); });
    }
  }

  deleteCard(id: number) {
    if (confirm('Delete this card?')) {
      this.grammarService.deleteCard(id).subscribe(() => this.loadTopics());
    }
  }

  // ── Exercise CRUD ────────────────────────────────────────────

  startAddExercise(topicId: number, currentCount: number) {
    this.editMode.set('exercise'); this.editId.set(null); this.editParentId.set(topicId);
    this.formSentence.set(''); this.formAnswer.set(''); this.formHint.set('');
    this.formOrderIndex.set(currentCount + 1);
  }

  startEditExercise(topicId: number, ex: GrammarExerciseDTO) {
    this.editMode.set('exercise'); this.editId.set(ex.id); this.editParentId.set(topicId);
    this.formSentence.set(ex.sentence); this.formHint.set(ex.hint);
    this.formOrderIndex.set(ex.orderIndex);
  }

  saveExercise() {
    if (!this.formSentence().trim() || !this.formAnswer().trim()) return;
    const payload = { topicId: this.editParentId()!, orderIndex: this.formOrderIndex(), sentence: this.formSentence(), answer: this.formAnswer(), hint: this.formHint() };
    if (this.editId()) {
      this.grammarService.updateExercise(this.editId()!, payload).subscribe(() => { this.cancelEdit(); this.loadTopics(); });
    } else {
      this.grammarService.createExercise(payload).subscribe(() => { this.cancelEdit(); this.loadTopics(); });
    }
  }

  deleteExercise(id: number) {
    if (confirm('Delete this exercise?')) {
      this.grammarService.deleteExercise(id).subscribe(() => this.loadTopics());
    }
  }

  cancelEdit() {
    this.editMode.set('none'); this.editId.set(null); this.editParentId.set(null);
  }

  isEditing(mode: EditMode, id: number | null, parentId?: number): boolean {
    if (this.editMode() !== mode) return false;
    if (id !== null) return this.editId() === id;
    return this.editParentId() === parentId;
  }
}
