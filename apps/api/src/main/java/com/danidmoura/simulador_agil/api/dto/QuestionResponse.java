package com.danidmoura.simulador_agil.api.dto;

import lombok.Builder;
import lombok.Singular;

import java.io.Serializable;
import java.util.List;

@Builder
public record QuestionResponse (
        String title,
        String discipline,
        Integer year,
        String correctAlternative,
        String context,
        List<String> files,
        String alternativesIntroduction,
        @Singular List<AlternativeResponse> alternatives
) implements Serializable {
}
