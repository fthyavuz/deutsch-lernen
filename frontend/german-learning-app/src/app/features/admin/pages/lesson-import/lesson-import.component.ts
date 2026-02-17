import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminImportService } from '../../../../shared/services/admin-import.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lesson-import',
  imports: [CommonModule, FormsModule],
  templateUrl: './lesson-import.component.html',
  styleUrl: './lesson-import.component.css'
})
export class LessonImportComponent {
  private importService = inject(AdminImportService);
  private router = inject(Router);

  jsonContent = '';
  importing = signal(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);
  copied = signal<boolean>(false);

  private readonly PROMPT_TEMPLATE = `Act as a German language teaching assistant. Your task is to generate a JSON object for a new German lesson.

Specific Content Requirements:
1. Vocabularies: Provide EXACTLY 1 high-quality example sentence for each word. 
   - IMPORTANT: For all Nouns, you MUST include their articles (der, die, das) in the 'germanWord' field.
2. Quiz Question Order: Randomize the order of questions. They should NOT follow the alphabetical or chronological order of the vocabulary list.
3. Multiple Choice (MCQ):
   - Create 1 MCQ for EACH vocabulary word using situational explanations or German definitions.
   - ANSWER DISTRIBUTION: Distribute correct answers evenly across options A, B, C, and D.
   - The 'correctAnswer' field MUST be the exact text of the correct option (e.g., "der Tisch").
4. Matching: For every 5 words, create 1 MATCHING question.
   - Use vertical bars (|) to separate pairs: "Wort:Meaning|Wort:Meaning".
5. Fill-in-the-blank: If there are verbs, create 5 additional questions at the end to test verb conjugations.
6. Language: All questions and explanations MUST be in German. Only the English translations/meanings should be in English.
7. Output ONLY the raw JSON output.

Structure the JSON exactly like this Example Schema:
{
  "title": "[Title]",
  "description": "[Description]",
  "lessonOrder": 1,
  "levelCode": "[Level]",
  "vocabularies": [
    {
      "germanWord": "der Tisch",
      "englishMeaning": "table",
      "turkishMeaning": "masa",
      "germanExplanation": "Ein Möbelstück mit vier Beinen.",
      "relatedWords": "Stuhl, Küche",
      "exampleSentences": [{"germanSentence": "Das Essen steht auf dem Tisch.", "englishTranslation": "The food is on the table.", "turkishTranslation": "Yemek masanın üstünde."}]
    }
  ],
  "quizQuestions": [
    {"type": "MULTIPLE_CHOICE", "question": "Wo isst man normalerweise?", "optionA": "Im Bett", "optionB": "Auf dem Tisch", "optionC": "Im Schrank", "optionD": "An der Wand", "correctAnswer": "Auf dem Tisch"},
    {"type": "MATCHING", "question": "Ordnen Sie zu.", "matchingPairs": "Haus:House|Baum:Tree"},
    {"type": "FILL_IN_THE_BLANK", "question": "Ich ___ (essen) einen Apfel.", "correctAnswer": "esse"}
  ]
}

--- DATA INPUT ---
Lesson Title: [YOUR_LESSON_TITLE_HERE]
Level: [LEVEL_HERE, e.g., A1.1]
Words to include: [YOUR_COMMA_SEPARATED_WORDS_HERE]`;

  copyPromptTemplate() {
    navigator.clipboard.writeText(this.PROMPT_TEMPLATE).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  onImport() {
    if (!this.jsonContent.trim()) {
      this.error.set('Please paste JSON content');
      return;
    }

    try {
      const data = JSON.parse(this.jsonContent);
      this.importing.set(true);
      this.error.set(null);
      this.success.set(false);

      this.importService.importLesson(data).subscribe({
        next: () => {
          this.importing.set(false);
          this.success.set(true);
          setTimeout(() => this.router.navigate(['/admin/lessons']), 2000);
        },
        error: (err) => {
          this.importing.set(false);
          this.error.set(err.error?.message || 'Import failed. Check JSON structure.');
        }
      });
    } catch (e) {
      this.error.set('Invalid JSON format');
    }
  }

  cancel() {
    this.router.navigate(['/admin/lessons']);
  }
}
