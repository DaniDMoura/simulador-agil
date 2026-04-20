package com.danidmoura.simulador_agil.api;

import com.danidmoura.simulador_agil.api.dto.QuestionRequest;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import com.danidmoura.simulador_agil.api.util.QuestionFetcher;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Objects;


import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@EnableCaching
public class CacheIntegrationTest {

    @MockitoBean
    private QuestionFetcher questionFetcher;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CacheManager cacheManager;

    @Test
    public void shouldCacheResponse() throws Exception {
        QuestionRequest questionRequest = QuestionRequest.builder()
                .number(1)
                .minYear(2020)
                .maxYear(2023)
                .enableCienciasNatureza(true)
                .enableCienciasHumanas(true)
                .enableLinguagens(true)
                .enableMatematica(true)
                .build();

        List<String> allowedSubjects = List.of(
                "ciencias-natureza",
                "ciencias-humanas",
                "linguagens",
                "matematica"
        );

        when(questionFetcher.getQuestionResponses(2020, allowedSubjects))
                .thenReturn(
                        List.of(
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

        mockMvc.perform(post("/api/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        mockMvc.perform(post("/api/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(questionFetcher, times(1)).getQuestionResponses(2020, allowedSubjects);
    }

    @AfterEach
    public void clearCache() {
        Objects.requireNonNull(cacheManager.getCache("questions")).clear();
    }
}
