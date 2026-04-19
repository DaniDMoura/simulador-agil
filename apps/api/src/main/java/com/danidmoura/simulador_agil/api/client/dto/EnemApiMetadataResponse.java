package com.danidmoura.simulador_agil.api.client.dto;

import lombok.Builder;

@Builder
public record EnemApiMetadataResponse(
        Integer limit,
        Integer offset,
        Integer total,
        Boolean hasMore
) {
}
