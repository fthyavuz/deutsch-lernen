import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminVocabularyService } from '../../../../shared/services/admin-vocabulary.service';
import { VocabularyDTO } from '../../../../shared/models/vocabulary.model';

@Component({
  selector: 'app-vocabulary-list',
  imports: [CommonModule],
  templateUrl: './vocabulary-list.component.html',
  styleUrl: './vocabulary-list.component.css',
})
export class VocabularyListComponent {
  private service = inject(AdminVocabularyService);
  vocabularies: VocabularyDTO[] = [];

  constructor() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(vocabularies => {
      this.vocabularies = vocabularies;
    });
  }

  delete(id: number) {
    if (!confirm('Delete this word?')) return;
    this.service.delete(id).subscribe(() => {
      this.load();
    });
  }

}
