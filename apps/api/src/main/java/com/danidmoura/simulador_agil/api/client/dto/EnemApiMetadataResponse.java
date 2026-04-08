package com.danidmoura.simulador_agil.api.client.dto;

public record EnemApiMetadataResponse(
        Integer limit,
        Integer offset,
        Integer total,
        Boolean hasMore
) {
}
