package com.danidmoura.simulador_agil.api.client.dto;

import java.util.List;

public record EnemApiResponse(
    EnemApiMetadataResponse metadata,
    List<EnemApiQuestionResponse> questions
) {
}
