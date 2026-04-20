package com.danidmoura.simulador_agil.api.service;

import com.danidmoura.simulador_agil.api.dto.AlternativeResponse;
import com.danidmoura.simulador_agil.api.dto.QuestionRequest;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import com.danidmoura.simulador_agil.api.exception.NoSubjectsEnabledException;
import com.danidmoura.simulador_agil.api.util.QuestionFetcher;
import com.danidmoura.simulador_agil.api.util.QuestionRandomProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class QuestionServiceTest {

    @Mock
    private QuestionFetcher questionFetcher;

    @Mock
    private QuestionRandomProvider questionRandomProvider;

    @InjectMocks
    private QuestionService questionService;

    @Test
    public void shouldReturnQuestionsWhenRequestIsValid() {
        QuestionRequest questionRequest = QuestionRequest.builder()
                .number(1)
                .minYear(2020)
                .maxYear(2023)
                .enableCienciasNatureza(true)
                .enableCienciasHumanas(true)
                .enableLinguagens(true)
                .enableMatematica(true)
                .build();

        when(questionFetcher.getQuestionResponses(
                2020,
                List.of(
                        "ciencias-natureza",
                        "ciencias-humanas",
                        "linguagens",
                        "matematica"
                )
        ))
                .thenReturn(
                        List.of(
                                QuestionResponse.builder()
                                        .title("Q1")
                                        .discipline("matematica")
                                        .year(2020)
                                        .correctAlternative("A")
                                        .context("ctx")
                                        .files(List.of())
                                        .alternativesIntroduction("intro")
                                        .alternatives(List.of(
                                                AlternativeResponse.builder()
                                                        .letter("A")
                                                        .text("opt1")
                                                        .file(null)
                                                        .isCorrect(true)
                                                        .build(),
                                                AlternativeResponse.builder()
                                                        .letter("B")
                                                        .text("opt2")
                                                        .file(null)
                                                        .isCorrect(false)
                                                        .build()
                                        )).build(),
                                QuestionResponse.builder()
                                        .title("Q2")
                                        .discipline("ciencias-humanas")
                                        .year(2022)
                                        .correctAlternative("B")
                                        .context("ctx")
                                        .files(List.of())
                                        .alternativesIntroduction("intro")
                                        .alternatives(List.of())
                                        .build()
                        )
                );

        when(questionRandomProvider.shuffle(anyList()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        List<QuestionResponse> questionResponses = questionService.getQuestions(questionRequest);

        assertEquals(1, questionResponses.size());

        QuestionResponse questions = questionResponses.getFirst();

        assertEquals("Q1", questions.title());
        assertEquals("matematica", questions.discipline());
        assertEquals(2020, questions.year());
        assertEquals("A", questions.correctAlternative());
        assertEquals("ctx", questions.context());

        assertTrue(questions.files().isEmpty());
        assertEquals("intro", questions.alternativesIntroduction());

        assertEquals(2, questions.alternatives().size());
        assertEquals("A", questions.alternatives().getFirst().letter());

        verify(questionFetcher, atLeastOnce())
                .getQuestionResponses(anyInt(), anyList());

        verify(questionRandomProvider, times(2))
                .shuffle(anyList());
    }
    @Test
    public void shouldThrowNoSubjectsEnabledExceptionWhenNoSubjectsAreEnabled() {
        QuestionRequest questionRequest = QuestionRequest.builder()
                .number(1)
                .minYear(2020)
                .maxYear(2023)
                .enableCienciasNatureza(false)
                .enableCienciasHumanas(false)
                .enableLinguagens(false)
                .enableMatematica(false)
                .build();

        assertThrows(NoSubjectsEnabledException.class,
                () -> questionService.getQuestions(questionRequest));

        verifyNoInteractions(questionFetcher);
    }
}