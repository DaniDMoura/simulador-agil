package com.danidmoura.simulador_agil.api.util;

import com.danidmoura.simulador_agil.api.client.dto.EnemApiQuestionResponse;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapper {
    public QuestionResponse toQuestionResponse(EnemApiQuestionResponse enemApiQuestionResponse) {
        return new QuestionResponse(
                enemApiQuestionResponse.title(),
                enemApiQuestionResponse.discipline(),
                enemApiQuestionResponse.year(),
                enemApiQuestionResponse.correctAlternative(),
                enemApiQuestionResponse.context(),
                enemApiQuestionResponse.files(),
                enemApiQuestionResponse.alternativesIntroduction(),
                enemApiQuestionResponse.alternatives()
        );
    }
}
