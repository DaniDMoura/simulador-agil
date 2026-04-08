package com.danidmoura.simulador_agil.api.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record QuestionRequest (
        @NotNull
        @Min(value = 1)
        @Max(value = 180)
        Integer number,

        @NotNull
        @Min(value = 2008)
        @Max(value = 2023)
        Integer minYear,

        @NotNull
        @Min(value = 2010)
        @Max(value = 2023)
        Integer maxYear,

        @NotNull
        Boolean enableCienciasNatureza,
        @NotNull
        Boolean enableCienciasHumanas,
        @NotNull
        Boolean enableLinguagens,
        @NotNull
        Boolean enableMatematica
) {

    @AssertTrue(message = "minYear must be <= maxYear")
    public boolean isValidYearRange() {
        return minYear <= maxYear;
    }

    @AssertTrue(message = "At least one subject must be enabled")
    public boolean isAtLeastOneSubjectEnabled() {
        return enableCienciasNatureza
                || enableCienciasHumanas
                || enableLinguagens
                || enableMatematica;
    }
}
