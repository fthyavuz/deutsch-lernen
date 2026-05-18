package com.fatih.germanapp.controller;

import com.fatih.germanapp.dto.AiSentenceRequestDTO;
import com.fatih.germanapp.dto.AiSentenceResponseDTO;
import com.fatih.germanapp.dto.StoryScenarioRequestDTO;
import com.fatih.germanapp.dto.StoryScenarioResponseDTO;
import com.fatih.germanapp.service.GeminiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiSentenceController {

    private final GeminiService geminiService;

    public AiSentenceController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/sentence-feedback")
    public AiSentenceResponseDTO getSentenceFeedback(@RequestBody AiSentenceRequestDTO request) {
        String feedback = geminiService.checkSentence(
                request.getWord(),
                request.getGermanExplanation(),
                request.getUserSentence()
        );
        return new AiSentenceResponseDTO(feedback);
    }

    @PostMapping("/story-scenarios")
    public StoryScenarioResponseDTO getStoryScenarios(@RequestBody StoryScenarioRequestDTO request) {
        return new StoryScenarioResponseDTO(
            geminiService.generateStoryScenarios(request.getWords(), request.getLevelCode())
        );
    }
}
