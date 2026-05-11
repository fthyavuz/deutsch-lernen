package com.fatih.germanapp.dto;

import lombok.Data;

@Data
public class AiSentenceRequestDTO {
    private String word;
    private String germanExplanation;
    private String userSentence;
}
