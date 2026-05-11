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
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

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
            generationConfig.put("maxOutputTokens", 200);
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
                You are a friendly German language teacher checking a student's sentence.

                Word being practiced: "%s"
                German explanation: "%s"
                Student's sentence: "%s"

                Check the sentence in 2-3 lines maximum:
                - Is the German grammar correct?
                - Is the word "%s" used correctly and naturally?
                - If there is a mistake, gently correct it with the right version.
                - If it is good, confirm it with a short encouraging remark.

                Be warm and encouraging. Write your response in German, with a short English note in parentheses when helpful.
                """, word, germanExplanation, userSentence, word);
    }
}
