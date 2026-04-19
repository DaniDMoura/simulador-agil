package com.danidmoura.simulador_agil.api.client.dto;

import com.danidmoura.simulador_agil.api.dto.AlternativeResponse;
import lombok.Builder;
import lombok.Singular;

import java.util.List;

@Builder
public record EnemApiQuestionResponse(
        String title,
        Integer index,
        String discipline,
        String language,
        Integer year,
        String context,
        List<String> files,
        String correctAlternative,
        String alternativesIntroduction,
        @Singular List<AlternativeResponse> alternatives
) {
}
