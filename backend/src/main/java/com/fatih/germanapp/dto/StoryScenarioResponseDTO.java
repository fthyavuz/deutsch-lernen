package com.fatih.germanapp.dto;

import lombok.Data;
import java.util.List;

@Data
public class StoryScenarioResponseDTO {
    private List<StoryScenarioDTO> scenarios;

    public StoryScenarioResponseDTO(List<StoryScenarioDTO> scenarios) {
        this.scenarios = scenarios;
    }
}
