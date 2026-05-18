package com.fatih.germanapp.dto;

import lombok.Data;
import java.util.List;

@Data
public class StoryScenarioRequestDTO {
    private List<StoryVocabItemDTO> words;
}
