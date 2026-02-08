export interface AdminVocabularyRequest {
    lessonId: number;
    germanWord: string;
    englishMeaning: string;
    turkishMeaning: string;
    germanExplanation: string;
    relatedWords: string;
    exampleSentences: {
        germanSentence: string;
        englishTranslation: string;
        turkishTranslation: string;
    }[];
}
