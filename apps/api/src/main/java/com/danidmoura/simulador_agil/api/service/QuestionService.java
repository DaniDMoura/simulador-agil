package com.danidmoura.simulador_agil.api.service;

import com.danidmoura.simulador_agil.api.client.QuestionClient;
import com.danidmoura.simulador_agil.api.client.dto.EnemApiQuestionResponse;
import com.danidmoura.simulador_agil.api.client.dto.EnemApiResponse;
import com.danidmoura.simulador_agil.api.dto.QuestionRequest;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import com.danidmoura.simulador_agil.api.exception.NoSubjectsEnabledException;
import org.springframework.cache.annotation.Cacheable;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

public class QuestionService {

    private final QuestionClient questionClient;

    public QuestionService(QuestionClient questionClient) {
        this.questionClient = questionClient;
    }

    @Cacheable(
            value = "questions",
            key = "T(java.util.Objects).hash(#req.number, #req.minYear, #req.maxYear, #req.enableCienciasNatureza, #req.enableCienciasHumanas, #req.enableLinguagens, #req.enableMatematica)"
    )
    public List<QuestionResponse> getQuestions(QuestionRequest req) {
        List<String> subjects = getEnabledSubjects(req);
        if (subjects.isEmpty()) throw new NoSubjectsEnabledException();

        int target = req.number();
        int batchSize = 180;

        List<Integer> years = IntStream
                .rangeClosed(req.minYear(), req.maxYear())
                .boxed()
                .toList();

        Collections.shuffle(years);

        int calls = calculateCalls(target, years.size());

        List<QuestionResponse> result = years.stream()
                .limit(calls)
                .parallel()
                .map(year -> {
                    int offset = ThreadLocalRandom.current()
                            .nextInt(0, 180);

                    EnemApiResponse response = questionClient
                            .fetchQuestions(year, offset, batchSize)
                            .getBody();

                    if (response == null) return List.<QuestionResponse>of();

                    return response.questions().stream()
                            .filter(q -> subjects.contains(q.discipline()))
                            .map(this::toQuestionResponse)
                            .toList();
                })
                .flatMap(List::stream)
                .limit(target)
                .toList();

        Collections.shuffle(result);

        return result;
    }

    private QuestionResponse toQuestionResponse(EnemApiQuestionResponse enemApiQuestionResponse) {
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

    private int calculateCalls(int target, int totalYears) {
        int calls = (int) Math.ceil(target / 60.0);

        return Math.min(
                Math.max(4, calls),
                totalYears
        );
    }

    private List<String> getEnabledSubjects(QuestionRequest req) {
        List<String> subjects = new ArrayList<>();

        if (req.enableCienciasNatureza()) subjects.add("ciencias-natureza");
        if (req.enableCienciasHumanas()) subjects.add("ciencias-humanas");
        if (req.enableLinguagens()) subjects.add("linguagens");
        if (req.enableMatematica()) subjects.add("matematica");

        return subjects;
    }
}
