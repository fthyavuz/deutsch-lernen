package com.fatih.germanapp.dto;

import lombok.Data;
import java.util.List;

@Data
public class StoryScenarioDTO {
    private String title;
    private String prompt;
    private List<String> words;
}
