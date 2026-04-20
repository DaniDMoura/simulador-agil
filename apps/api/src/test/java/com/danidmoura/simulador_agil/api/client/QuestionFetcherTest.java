package com.danidmoura.simulador_agil.api.client;

import com.danidmoura.simulador_agil.api.client.dto.EnemApiMetadataResponse;
import com.danidmoura.simulador_agil.api.client.dto.EnemApiQuestionResponse;
import com.danidmoura.simulador_agil.api.client.dto.EnemApiResponse;
import com.danidmoura.simulador_agil.api.dto.AlternativeResponse;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import com.danidmoura.simulador_agil.api.util.QuestionFetcher;
import com.danidmoura.simulador_agil.api.util.QuestionMapper;
import com.danidmoura.simulador_agil.api.util.QuestionRandomProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class QuestionFetcherTest {

    @Mock
    private QuestionClient questionClient;

    @Mock
    private QuestionMapper questionMapper;

    @Mock
    private QuestionRandomProvider questionRandomProvider;

    @InjectMocks
    private QuestionFetcher questionFetcher;

    @Test
    public void shouldReturnQuestionsWhenFetch() {
        when(questionRandomProvider.nextInt(anyInt())).thenReturn(3);

        when(questionClient.fetchQuestions(eq(2023), eq(3), anyInt()))
                .thenReturn(ResponseEntity.ok(
                        EnemApiResponse.builder()
                                .metadata(EnemApiMetadataResponse.builder()
                                        .limit(10)
                                        .offset(0)
                                        .total(1)
                                        .hasMore(false)
                                        .build())
                                .question(EnemApiQuestionResponse.builder()
                                        .title("Q1")
                                        .discipline("matematica")
                                        .year(2020)
                                        .correctAlternative("A")
                                        .context("ctx")
                                        .files(List.of())
                                        .alternativesIntroduction("intro")
                                        .alternative(
                                                AlternativeResponse.builder()
                                                        .letter("A")
                                                        .text("opt1")
                                                        .isCorrect(true)
                                                        .build()
                                        )
                                        .build())
                                .build()
                ));

        when(questionMapper.toQuestionResponse(any(EnemApiQuestionResponse.class))).thenReturn(
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
                        ))
                        .build()
        );

        List<String> allowedSubjects = List.of(
                "ciencias-natureza",
                "ciencias-humanas",
                "linguagens",
                "matematica"
        );

        List<QuestionResponse> questionResponses = questionFetcher.getQuestionResponses(
                2023, allowedSubjects
        );

        assertEquals(1, questionResponses.size());

        QuestionResponse question = questionResponses.getFirst();

        assertEquals("Q1", question.title());
        assertEquals("matematica", question.discipline());
        assertEquals(2020, question.year());
        assertEquals("A", question.correctAlternative());
        assertEquals("ctx", question.context());
        assertTrue(question.files().isEmpty());
        assertEquals("intro", question.alternativesIntroduction());

        assertEquals(2, question.alternatives().size());

        assertEquals("A", question.alternatives().get(0).letter());
        assertEquals("opt1", question.alternatives().get(0).text());
        assertTrue(question.alternatives().get(0).isCorrect());

        assertEquals("B", question.alternatives().get(1).letter());
        assertEquals("opt2", question.alternatives().get(1).text());
        assertFalse(question.alternatives().get(1).isCorrect());

        assertTrue(allowedSubjects.contains(question.discipline()));
    }

    @Test
    public void shouldReturnEmptyListWhenResponseIsNull() {
        when(questionRandomProvider.nextInt(anyInt())).thenReturn(3);

        when(questionClient.fetchQuestions(eq(2023), eq(3), anyInt()))
                .thenReturn(ResponseEntity.ok(
                        EnemApiResponse.builder()
                                .metadata(EnemApiMetadataResponse.builder()
                                        .limit(0)
                                        .offset(0)
                                        .total(0)
                                        .hasMore(false)
                                        .build())
                                .questions(List.of())
                                .build()
                ));

        List<QuestionResponse> questionResponses = questionFetcher.getQuestionResponses(
                2023,
                List.of(
                        "ciencias-natureza",
                        "ciencias-humanas",
                        "linguagens",
                        "matematica"
                )
        );

        assertTrue(questionResponses.isEmpty());
    }
}
