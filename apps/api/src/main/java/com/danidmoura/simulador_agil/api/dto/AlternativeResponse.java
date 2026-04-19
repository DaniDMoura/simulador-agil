package com.danidmoura.simulador_agil.api.dto;

import lombok.Builder;

@Builder
public record AlternativeResponse (
        String letter,
        String text,
        String file,
        Boolean isCorrect
) {
}
