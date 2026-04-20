package com.danidmoura.simulador_agil.api.util;

import com.danidmoura.simulador_agil.api.client.QuestionClient;
import com.danidmoura.simulador_agil.api.client.dto.EnemApiResponse;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import feign.FeignException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class QuestionFetcher {

    private static final int MAX_QUESTIONS_PER_YEAR = 180;
    private static final int FETCH_LIMIT = 50;

    private final QuestionClient questionClient;
    private final QuestionMapper questionMapper;
    private final QuestionRandomProvider questionRandomProvider;

    public QuestionFetcher(QuestionClient questionClient, QuestionMapper questionMapper, QuestionRandomProvider questionRandomProvider) {
        this.questionClient = questionClient;
        this.questionMapper = questionMapper;
        this.questionRandomProvider = questionRandomProvider;
    }

    @Retryable(
            retryFor = { FeignException.FeignClientException.TooManyRequests.class },
            maxAttempts = 8,
            backoff = @Backoff(delay = 5000, multiplier = 2.0)
    )
    public List<QuestionResponse> getQuestionResponses(Integer year, List<String> subjects) {
        int maxOffset = Math.max(0, MAX_QUESTIONS_PER_YEAR - FETCH_LIMIT);
        int offset = questionRandomProvider.nextInt(maxOffset + 1);

        EnemApiResponse response = questionClient
                .fetchQuestions(year, offset, 50)
                .getBody();

        if (response == null) return List.of();

        return response.questions().stream()
                .map(questionMapper::toQuestionResponse)
                .filter(question -> subjects == null || subjects.contains(question.discipline()))
                .toList();
    }
}
