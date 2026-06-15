package com.danidmoura.simulador_agil.api.util;

import com.danidmoura.simulador_agil.api.client.dto.EnemApiQuestionResponse;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapper {
    public QuestionResponse toQuestionResponse(EnemApiQuestionResponse enemApiQuestionResponse) {
        return QuestionResponse.builder()
                .title(enemApiQuestionResponse.title())
                .discipline(enemApiQuestionResponse.discipline())
                .year(enemApiQuestionResponse.year())
                .correctAlternative(enemApiQuestionResponse.correctAlternative())
                .context(enemApiQuestionResponse.context())
                .files(enemApiQuestionResponse.files())
                .alternativesIntroduction(enemApiQuestionResponse.alternativesIntroduction())
                .alternatives(enemApiQuestionResponse.alternatives())
                .build();
    }
}
