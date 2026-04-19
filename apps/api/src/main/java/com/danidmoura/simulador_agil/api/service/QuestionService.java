package com.danidmoura.simulador_agil.api.service;

import com.danidmoura.simulador_agil.api.dto.QuestionRequest;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import com.danidmoura.simulador_agil.api.exception.NoSubjectsEnabledException;
import com.danidmoura.simulador_agil.api.util.QuestionFetcher;
import com.danidmoura.simulador_agil.api.util.QuestionRandomProvider;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class QuestionService {

    private final QuestionFetcher questionFetcher;
    private final QuestionRandomProvider questionRandomProvider;

    public QuestionService(QuestionFetcher questionFetcher, QuestionRandomProvider questionRandomProvider) {
        this.questionFetcher = questionFetcher;
        this.questionRandomProvider = questionRandomProvider;
    }

    @Cacheable(
            value = "questions",
            key = "T(java.util.Objects).hash(#req.number, #req.minYear, #req.maxYear, #req.enableCienciasNatureza, #req.enableCienciasHumanas, #req.enableLinguagens, #req.enableMatematica)"
    )
    public List<QuestionResponse> getQuestions(QuestionRequest req) {
        List<String> subjects = buildEnabledSubjects(req);
        if (subjects.isEmpty()) throw new NoSubjectsEnabledException();

        List<Integer> years = buildYears(req);
        questionRandomProvider.shuffle(years);

        int calls = calculateCalls(req.number(), years.size());

        List<QuestionResponse> result = years.stream()
                .limit(calls)
                .map(year -> questionFetcher.getQuestionResponses(year, subjects))
                .flatMap(List::stream)
                .limit(req.number())
                .collect(Collectors.toCollection(ArrayList::new));

        questionRandomProvider.shuffle(result);

        return result;
    }

    private List<String> buildEnabledSubjects(QuestionRequest req) {
        List<String> subjects = new ArrayList<>();

        if (req.enableCienciasNatureza()) subjects.add("ciencias-natureza");
        if (req.enableCienciasHumanas()) subjects.add("ciencias-humanas");
        if (req.enableLinguagens()) subjects.add("linguagens");
        if (req.enableMatematica()) subjects.add("matematica");

        return subjects;
    }

    private List<Integer> buildYears(QuestionRequest req) {
        return IntStream
                .rangeClosed(req.minYear(), req.maxYear())
                .boxed()
                .toList();
    }

    private int calculateCalls(int target, int totalYears) {
        int calls = (int) Math.ceil(target / 60.0);

        return Math.min(
                Math.max(4, calls),
                totalYears
        );
    }
}
