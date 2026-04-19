package com.danidmoura.simulador_agil.api.client.dto;

import lombok.Builder;
import lombok.Singular;

import java.util.List;

@Builder
public record EnemApiResponse(
    EnemApiMetadataResponse metadata,
    @Singular List<EnemApiQuestionResponse> questions
) {
}
