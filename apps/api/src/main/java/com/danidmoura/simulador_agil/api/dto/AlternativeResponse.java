package com.danidmoura.simulador_agil.api.dto;

import lombok.Builder;

import java.io.Serializable;

@Builder
public record AlternativeResponse (
        String letter,
        String text,
        String file,
        Boolean isCorrect
) implements Serializable {
}
