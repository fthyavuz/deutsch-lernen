import { Component, input, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminGrammarService } from '../../../../../shared/services/admin-grammar.service';
import { GrammarTopicDTO, GrammarCardDTO, GrammarExerciseDTO, GrammarTopicImportDTO } from '../../../../../shared/models/grammar.model';

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

  // Import preview state
  showPreview = signal(false);
  previewTopics = signal<GrammarTopicImportDTO[]>([]);
  editingPreviewExercise = signal<{ topicIdx: number; exIdx: number } | null>(null);
  previewSentence = '';
  previewAnswer = '';
  previewHint = '';

  get grammarPrompt(): string {
    return `Act as a German language teaching assistant. Generate grammar topic content for a JSON import.

Rules for exercises:
- Use ___ (three underscores) for the blank in the sentence
- The "hint" field MUST always include the BASE / INFINITIVE form of the target word:
  • Verb → infinitive + tense/person: "schreiben (Infinitiv, 3. Pers. Sg. Präsens)"
  • Adjective → base form + case/gender: "groß (Adjektiv, Nom., Neutr., indefinit)"
  • Article → definiteness + gender + case: "definit, mask., Akkusativ"
  • Noun → nominative singular form: "der Mann (Akkusativ Plural)"
- All explanations and exercise sentences must be in German
- Examples: real, natural German sentences, pipe-separated
- 2–4 rule cards per topic; exactly 3 exercises per card (N cards × 3 = total exercises)

Return ONLY raw JSON — no markdown, no code fences:
{
  "topics": [
    {
      "name": "Akkusativ",
      "cards": [
        {
          "orderIndex": 1,
          "title": "Was ist der Akkusativ?",
          "explanation": "Der Akkusativ ist der 4. Fall und bezeichnet das direkte Objekt.",
          "examples": "Ich sehe den Mann.|Er kauft einen Apfel.|Sie trinkt die Milch."
        }
      ],
      "exercises": [
        {
          "orderIndex": 1,
          "sentence": "Ich sehe ___ Mann.",
          "answer": "den",
          "hint": "definit, mask., Akkusativ"
        },
        {
          "orderIndex": 2,
          "sentence": "Er ___ jeden Tag Sport.",
          "answer": "macht",
          "hint": "machen (Infinitiv, 3. Pers. Sg. Präsens)"
        },
        {
          "orderIndex": 3,
          "sentence": "Das ist ein ___ Auto.",
          "answer": "rotes",
          "hint": "rot (Adjektiv, Nom., Neutr., indefinit)"
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

  // ── Import Preview Flow ───────────────────────────────────────

  parseAndPreview() {
    if (!this.jsonContent.trim()) { this.importError.set('Paste JSON first'); return; }
    try {
      const data = JSON.parse(this.jsonContent);
      if (!data.topics || !Array.isArray(data.topics)) {
        this.importError.set('JSON must contain a "topics" array');
        return;
      }
      this.previewTopics.set(JSON.parse(JSON.stringify(data.topics)));
      this.showPreview.set(true);
      this.importError.set(null);
      this.editingPreviewExercise.set(null);
    } catch {
      this.importError.set('Invalid JSON');
    }
  }

  cancelPreview() {
    this.showPreview.set(false);
    this.previewTopics.set([]);
    this.editingPreviewExercise.set(null);
  }

  deletePreviewTopic(topicIdx: number) {
    this.previewTopics.update(t => t.filter((_, i) => i !== topicIdx));
  }

  deletePreviewCard(topicIdx: number, cardIdx: number) {
    this.previewTopics.update(topics =>
      topics.map((t, ti) => ti !== topicIdx ? t : { ...t, cards: t.cards.filter((_, i) => i !== cardIdx) })
    );
  }

  deletePreviewExercise(topicIdx: number, exIdx: number) {
    const current = this.editingPreviewExercise();
    if (current?.topicIdx === topicIdx && current?.exIdx === exIdx) {
      this.editingPreviewExercise.set(null);
    }
    this.previewTopics.update(topics =>
      topics.map((t, ti) => ti !== topicIdx ? t : { ...t, exercises: t.exercises.filter((_, i) => i !== exIdx) })
    );
  }

  startEditPreviewExercise(topicIdx: number, exIdx: number) {
    const ex = this.previewTopics()[topicIdx].exercises[exIdx];
    this.previewSentence = ex.sentence;
    this.previewAnswer = ex.answer;
    this.previewHint = ex.hint;
    this.editingPreviewExercise.set({ topicIdx, exIdx });
  }

  savePreviewExercise() {
    const item = this.editingPreviewExercise();
    if (!item) return;
    this.previewTopics.update(topics =>
      topics.map((t, ti) => ti !== item.topicIdx ? t : {
        ...t,
        exercises: t.exercises.map((ex, ei) => ei !== item.exIdx ? ex : {
          ...ex, sentence: this.previewSentence, answer: this.previewAnswer, hint: this.previewHint
        })
      })
    );
    this.editingPreviewExercise.set(null);
  }

  cancelPreviewEdit() {
    this.editingPreviewExercise.set(null);
  }

  confirmImport() {
    const data = { lessonId: this.lessonId(), topics: this.previewTopics() };
    this.importing.set(true);
    this.importError.set(null);
    this.grammarService.importGrammar(data).subscribe({
      next: () => {
        this.importing.set(false);
        this.importSuccess.set(true);
        this.jsonContent = '';
        this.showPreview.set(false);
        this.showImport.set(false);
        this.previewTopics.set([]);
        this.loadTopics();
        setTimeout(() => this.importSuccess.set(false), 3000);
      },
      error: (err) => {
        this.importing.set(false);
        this.importError.set(err.error?.message || 'Import failed');
      }
    });
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
