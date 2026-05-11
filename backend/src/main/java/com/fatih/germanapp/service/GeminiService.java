package com.fatih.germanapp.service;

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
            generationConfig.put("maxOutputTokens", 800);
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
