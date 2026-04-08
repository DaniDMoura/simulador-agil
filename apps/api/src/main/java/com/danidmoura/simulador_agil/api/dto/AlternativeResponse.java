package com.danidmoura.simulador_agil.api.dto;

public record AlternativeResponse (
        String letter,
        String text,
        String file,
        Boolean isCorrect
) {
}
