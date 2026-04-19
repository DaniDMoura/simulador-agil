package com.danidmoura.simulador_agil.api.util;

import com.danidmoura.simulador_agil.api.client.QuestionClient;
import com.danidmoura.simulador_agil.api.client.dto.EnemApiResponse;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class QuestionFetcher {

    private final QuestionClient questionClient;
    private final QuestionMapper questionMapper;
    private final QuestionRandomProvider questionRandomProvider;

    public QuestionFetcher(QuestionClient questionClient, QuestionMapper questionMapper, QuestionRandomProvider questionRandomProvider) {
        this.questionClient = questionClient;
        this.questionMapper = questionMapper;
        this.questionRandomProvider = questionRandomProvider;
    }

    public List<QuestionResponse> getQuestionResponses(Integer year, List<String> subjects) {
        int offset = questionRandomProvider.nextInt(180);

        EnemApiResponse response = questionClient
                .fetchQuestions(year, offset, 180)
                .getBody();

        if (response == null) return List.of();

        return response.questions().stream()
                .filter(q -> subjects.contains(q.discipline()))
                .map(questionMapper::toQuestionResponse)
                .toList();
    }
}
