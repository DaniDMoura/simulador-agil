package com.danidmoura.simulador_agil.api.service;

import com.danidmoura.simulador_agil.api.dto.QuestionRequest;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import com.danidmoura.simulador_agil.api.exception.NoSubjectsEnabledException;
import com.danidmoura.simulador_agil.api.exception.QuestionRequestOutOfBoundsException;
import com.danidmoura.simulador_agil.api.util.QuestionFetcher;
import com.danidmoura.simulador_agil.api.util.QuestionRandomProvider;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.IntStream;

@Service
public class QuestionService {

    private static final int QUESTIONS_PER_SUBJECT = 45;

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
        validateSubjects(subjects);

        int maxAllowedQuestions = calculateMaxAllowedQuestions(req);
        validateNumberOfQuestions(req, maxAllowedQuestions);

        List<Integer> years = questionRandomProvider.shuffle(buildYears(req));

        List<QuestionResponse> questionsResult = new ArrayList<>();
        HashSet<String> uniqueQuestionIds = new HashSet<>();

        while (uniqueQuestionIds.size() < req.number()) {
            Integer year = years.get(questionRandomProvider.nextInt(years.size()));

            List<QuestionResponse> questions = questionFetcher.getQuestionResponses(year, subjects);

            questionsResult.addAll(questions);

            List<String> questionIds = questions.stream()
                            .map(question -> question.title() + question.year())
                            .distinct()
                            .toList();

            uniqueQuestionIds.addAll(questionIds);
        }

        questionsResult = questionRandomProvider.shuffle(questionsResult);

        return questionsResult.stream()
                .limit(req.number())
                .toList();
    }

    private void validateSubjects(List<String> subjects) {
        if (subjects.isEmpty()) throw new NoSubjectsEnabledException();
    }

    private void validateNumberOfQuestions(QuestionRequest req, int maxAllowedQuestions) {
        if (req.number() > calculateMaxAllowedQuestions(req)) throw new QuestionRequestOutOfBoundsException("Requested: " + req.number() + ", max allowed: " + maxAllowedQuestions);
    }

    private int countEnabledSubjects(QuestionRequest req) {
        int count = 0;
        if (req.enableCienciasHumanas()) count++;
        if (req.enableCienciasNatureza()) count++;
        if (req.enableLinguagens()) count++;
        if (req.enableMatematica()) count++;
        return count;
    }

    private int calculateMaxAllowedQuestions(QuestionRequest req) {
        int totalYears = (req.maxYear() - req.minYear()) + 1;
        int enabledSubjects = countEnabledSubjects(req);
        return enabledSubjects * QUESTIONS_PER_SUBJECT * totalYears;
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
}
