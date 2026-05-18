package com.fatih.germanapp.service;

import com.fatih.germanapp.dto.StoryScenarioDTO;
import com.fatih.germanapp.dto.StoryVocabItemDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public String checkSentence(String word, String germanExplanation, String userSentence) {
        if (apiKey == null || apiKey.isBlank()) {
            return "AI feedback is not configured. Please contact your teacher.";
        }
        try {
            String prompt = buildPrompt(word, germanExplanation, userSentence);

            ObjectNode requestBody = objectMapper.createObjectNode();
            ArrayNode contents = objectMapper.createArrayNode();
            ObjectNode contentNode = objectMapper.createObjectNode();
            ArrayNode parts = objectMapper.createArrayNode();
            ObjectNode textPart = objectMapper.createObjectNode();
            textPart.put("text", prompt);
            parts.add(textPart);
            contentNode.set("parts", parts);
            contents.add(contentNode);
            requestBody.set("contents", contents);

            ObjectNode generationConfig = objectMapper.createObjectNode();
            generationConfig.put("maxOutputTokens", 5000);
            generationConfig.put("temperature", 0.7);
            requestBody.set("generationConfig", generationConfig);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GEMINI_URL + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("Gemini HTTP status: {}", response.statusCode());

            JsonNode root = objectMapper.readTree(response.body());

            if (root.has("error")) {
                String errorMsg = root.path("error").path("message").asText("unknown");
                log.error("Gemini API error: {}", errorMsg);
                return "AI feedback is temporarily unavailable. Please try again later.";
            }

            JsonNode candidates = root.path("candidates");
            if (candidates.isMissingNode() || candidates.isEmpty()) {
                log.error("Gemini response had no candidates. Body: {}", response.body());
                return "AI feedback is temporarily unavailable. Please try again later.";
            }

            return candidates.get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText("Could not get feedback.");

        } catch (Exception e) {
            log.error("Gemini call failed: {}", e.getMessage(), e);
            return "Sorry, I couldn't check your sentence right now. Please try again.";
        }
    }

    public List<StoryScenarioDTO> generateStoryScenarios(List<StoryVocabItemDTO> words) {
        if (apiKey == null || apiKey.isBlank()) {
            return List.of();
        }
        try {
            String prompt = buildScenariosPrompt(words);

            ObjectNode requestBody = objectMapper.createObjectNode();
            ArrayNode contents = objectMapper.createArrayNode();
            ObjectNode contentNode = objectMapper.createObjectNode();
            ArrayNode parts = objectMapper.createArrayNode();
            ObjectNode textPart = objectMapper.createObjectNode();
            textPart.put("text", prompt);
            parts.add(textPart);
            contentNode.set("parts", parts);
            contents.add(contentNode);
            requestBody.set("contents", contents);

            ObjectNode generationConfig = objectMapper.createObjectNode();
            generationConfig.put("maxOutputTokens", 5000);
            generationConfig.put("temperature", 0.8);
            requestBody.set("generationConfig", generationConfig);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GEMINI_URL + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("Gemini story scenarios HTTP status: {}", response.statusCode());

            JsonNode root = objectMapper.readTree(response.body());

            if (root.has("error")) {
                log.error("Gemini API error: {}", root.path("error").path("message").asText());
                return List.of();
            }

            String rawText = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText("");

            // Extract the JSON array from the response, stripping any markdown or extra text
            String json = rawText.trim();
            int start = json.indexOf('[');
            int end = json.lastIndexOf(']');
            if (start == -1 || end == -1 || end < start) {
                log.error("Gemini response did not contain a JSON array. Raw: {}", rawText);
                return List.of();
            }
            json = json.substring(start, end + 1);

            JsonNode scenariosNode = objectMapper.readTree(json);
            List<StoryScenarioDTO> result = new ArrayList<>();
            for (JsonNode node : scenariosNode) {
                StoryScenarioDTO dto = new StoryScenarioDTO();
                dto.setTitle(node.path("title").asText());
                dto.setPrompt(node.path("prompt").asText());
                List<String> wordList = new ArrayList<>();
                for (JsonNode w : node.path("words")) {
                    wordList.add(w.asText());
                }
                dto.setWords(wordList);
                result.add(dto);
            }
            return result;

        } catch (Exception e) {
            log.error("Gemini story scenarios call failed: {}", e.getMessage(), e);
            return List.of();
        }
    }

    private String buildScenariosPrompt(List<StoryVocabItemDTO> words) {
        StringBuilder wordList = new StringBuilder();
        for (StoryVocabItemDTO w : words) {
            wordList.append("- ").append(w.getGermanWord())
                    .append(" (").append(w.getEnglishMeaning()).append(")\n");
        }
        return String.format("""
                You are a German language teacher creating writing practice exercises.

                Given the following German vocabulary words, group them into thematic clusters and create a short story scenario for each cluster.

                Vocabulary words:
                %s
                Rules:
                1. Group the words by semantic or thematic similarity (e.g. food, travel, emotions, daily routine, shopping, work, family).
                2. Each group should contain 5 to 12 words. If there are very few words, make 1-2 scenarios.
                3. For each group, write a realistic German writing prompt (2-3 sentences) that describes a situation where the student would naturally use all of those words.
                4. The prompt should be in German and appropriate for A1-B2 learners.
                5. Return ONLY a valid JSON array — no markdown, no explanation, no code fences.

                Return this exact JSON format:
                [
                  {
                    "title": "Short English title for the scenario",
                    "prompt": "German writing prompt describing the situation...",
                    "words": ["germanWord1", "germanWord2", ...]
                  }
                ]
                """, wordList);
    }

    private String buildPrompt(String word, String germanExplanation, String userSentence) {
        return String.format("""
                You are a German language teacher giving precise, useful feedback on a student's sentence.

                Word being practiced: "%s"
                German explanation: "%s"
                Student's sentence: "%s"

                Rules for your response:
                1. If the sentence is incomplete or does not make sense, say so clearly and give a complete example sentence using "%s".
                2. If there is a grammar mistake, name the exact error (e.g. wrong case, wrong verb form, missing article) and write the corrected sentence.
                3. If the word "%s" is not used correctly, explain why and show the correct usage.
                4. If the sentence is fully correct, confirm it in one line and briefly explain what makes it good (e.g. correct case, natural word order).

                Keep your response to 2-3 lines. Write in German. Add a short English translation in parentheses only when the German explanation is complex.
                Do NOT just say "good start" or "nice try" without giving specific feedback.
                """, word, germanExplanation, userSentence, word, word);
    }
}
