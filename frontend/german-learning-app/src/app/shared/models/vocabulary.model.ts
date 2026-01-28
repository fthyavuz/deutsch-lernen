import { ExampleSentenceDTO } from "./example-sentence.model";

// src/app/shared/models/vocabulary.model.ts
export interface VocabularyDTO {
    id: number;
    germanWord: string;
    englishMeaning: string;
    turkishMeaning: string;
    germanExplanation?: string;
    relatedWords?: string; // comma-separated
    exampleSentences?: ExampleSentenceDTO[];
}
