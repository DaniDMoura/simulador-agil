package com.danidmoura.simulador_agil.api;

import com.danidmoura.simulador_agil.api.config.RateLimitFilter;
import com.danidmoura.simulador_agil.api.dto.AlternativeResponse;
import com.danidmoura.simulador_agil.api.dto.QuestionRequest;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import com.danidmoura.simulador_agil.api.service.QuestionService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RateLimitIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private QuestionService questionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldMake30RequestPerMinute() throws Exception {
        QuestionRequest questionRequest = QuestionRequest.builder()
                .number(1)
                .minYear(2020)
                .maxYear(2023)
                .enableCienciasNatureza(true)
                .enableCienciasHumanas(true)
                .enableLinguagens(true)
                .enableMatematica(true)
                .build();

        when(questionService.getQuestions(any())).thenReturn(
                List.of(
                        QuestionResponse.builder()
                                .title("Q1")
                                .discipline("math")
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
                )
        );

        for (int i = 0; i < 30; i++) {
            mockMvc.perform(post("/api/questions")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(questionRequest)))
                            .andExpect(status().isOk());
        }

        mockMvc.perform(post("/api/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionRequest)))
                        .andExpect(status().isTooManyRequests());

        verify(questionService, times(30)).getQuestions(any());
        verifyNoMoreInteractions(questionService);
    }
}
