export interface StoryScenario {
  title: string;
  prompt: string;
  words: string[];
}

export interface StoryScenarioResponse {
  scenarios: StoryScenario[];
}

export interface StoryScenarioRequest {
  words: { germanWord: string; englishMeaning: string; germanExplanation: string }[];
}
