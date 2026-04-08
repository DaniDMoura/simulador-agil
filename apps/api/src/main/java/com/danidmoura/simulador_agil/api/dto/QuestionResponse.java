package com.danidmoura.simulador_agil.api.dto;

import java.io.Serializable;
import java.util.List;

public record QuestionResponse (
        String title,
        String discipline,
        Integer year,
        String correctAlternative,
        String context,
        List<String> files,
        String alternativesIntroduction,
        List<AlternativeResponse> alternatives
) implements Serializable {
}
