package com.danidmoura.simulador_agil.api.controller;

import com.danidmoura.simulador_agil.api.config.RateLimitFilter;
import com.danidmoura.simulador_agil.api.dto.AlternativeResponse;
import com.danidmoura.simulador_agil.api.dto.QuestionRequest;
import com.danidmoura.simulador_agil.api.service.QuestionService;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
public class QuestionControllerTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private QuestionService questionService;

    @Test
    public void shouldReturnStatusOkAndQuestionResponseWhenValidRequest() throws Exception {
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

        mockMvc.perform(post("/api/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(questionRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Q1")))
                .andExpect(jsonPath("$[0].discipline", is("math")))
                .andExpect(jsonPath("$[0].year", is(2020)))
                .andExpect(jsonPath("$[0].correctAlternative", is("A")))
                .andExpect(jsonPath("$[0].context", is("ctx")))
                .andExpect(jsonPath("$[0].files", hasSize(0)))
                .andExpect(jsonPath("$[0].alternativesIntroduction", is("intro")))
                .andExpect(jsonPath("$[0].alternatives", hasSize(2)))
                .andExpect(jsonPath("$[0].alternatives[0].letter", is("A")));
    }

    @Test
    public void shouldReturnStatusBadRequestWhenNullFields() throws Exception {
        QuestionRequest questionRequest = QuestionRequest.builder()
                .number(null)
                .minYear(2020)
                .maxYear(2023)
                .enableCienciasNatureza(true)
                .enableCienciasHumanas(true)
                .enableLinguagens(true)
                .enableMatematica(true)
                .build();

        mockMvc.perform(post("/api/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(questionRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.title", is("Your request parameters didn't validate.")))
                .andExpect(jsonPath("$.invalid-params[*].name", hasItem("number")))
                .andExpect(jsonPath("$.invalid-params[*].reason", hasItem("must not be null")));
    }

    @ParameterizedTest
    @CsvSource({
            "0, must be greater than or equal to 1",
            "181, must be less than or equal to 180"
    })
    public void shouldReturnStatusBadRequestWhenNumberOfQuestionsIsInvalid(int number, String expectedMessage) throws Exception {
        QuestionRequest questionRequest = QuestionRequest.builder()
                .number(number)
                .minYear(2020)
                .maxYear(2023)
                .enableCienciasNatureza(true)
                .enableCienciasHumanas(true)
                .enableLinguagens(true)
                .enableMatematica(true)
                .build();

        mockMvc.perform(post("/api/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.title", is("Your request parameters didn't validate.")))
                .andExpect(jsonPath("$.invalid-params[*].name", hasItem("number")))
                .andExpect(jsonPath("$.invalid-params[*].reason", hasItem(expectedMessage)));
    }

    @ParameterizedTest
    @CsvSource({
            "2007, must be greater than or equal to 2008",
            "2024, must be less than or equal to 2023"
    })
    public void shouldReturnStatusBadRequestWhenMinYearIsInvalid(int minYear, String expectedMessage) throws Exception {
        QuestionRequest questionRequest = QuestionRequest.builder()
                .number(1)
                .minYear(minYear)
                .maxYear(2023)
                .enableCienciasNatureza(true)
                .enableCienciasHumanas(true)
                .enableLinguagens(true)
                .enableMatematica(true)
                .build();

        mockMvc.perform(post("/api/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.title", is("Your request parameters didn't validate.")))
                .andExpect(jsonPath("$.invalid-params[*].name", hasItem("minYear")))
                .andExpect(jsonPath("$.invalid-params[*].reason", hasItem(expectedMessage)));
    }

    @ParameterizedTest
    @CsvSource({
            "2007, must be greater than or equal to 2008",
            "2024, must be less than or equal to 2023"
    })
    public void shouldReturnStatusBadRequestWhenMaxYearIsInvalid(int maxYear, String expectedMessage) throws Exception {
        QuestionRequest questionRequest = QuestionRequest.builder()
                .number(1)
                .minYear(2020)
                .maxYear(maxYear)
                .enableCienciasNatureza(true)
                .enableCienciasHumanas(true)
                .enableLinguagens(true)
                .enableMatematica(true)
                .build();

        mockMvc.perform(post("/api/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.title", is("Your request parameters didn't validate.")))
                .andExpect(jsonPath("$.invalid-params[*].name", hasItem("maxYear")))
                .andExpect(jsonPath("$.invalid-params[*].reason", hasItem(expectedMessage)));
    }

    @Test
    public void shouldReturnBadRequestWhenMaxYearIsBeforeMinYear() throws Exception {
        QuestionRequest questionRequest = QuestionRequest.builder()
                .number(1)
                .minYear(2020)
                .maxYear(2019)
                .enableCienciasNatureza(true)
                .enableCienciasHumanas(true)
                .enableLinguagens(true)
                .enableMatematica(true)
                .build();

        mockMvc.perform(post("/api/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.title", is("Your request parameters didn't validate.")))
                .andExpect(jsonPath("$.invalid-params[*].name", hasItem("validYearRange")))
                .andExpect(jsonPath("$.invalid-params[*].reason", hasItem("minYear must be <= maxYear")));
    }

    @Test
    public void shouldReturnBadRequestWhenAllSubjectsAreDisabled() throws Exception {
        QuestionRequest questionRequest = QuestionRequest.builder()
                .number(1)
                .minYear(2020)
                .maxYear(2023)
                .enableCienciasNatureza(false)
                .enableCienciasHumanas(false)
                .enableLinguagens(false)
                .enableMatematica(false)
                .build();

        mockMvc.perform(post("/api/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.title", is("Your request parameters didn't validate.")))
                .andExpect(jsonPath("$.invalid-params[*].name", hasItem("atLeastOneSubjectEnabled")))
                .andExpect(jsonPath("$.invalid-params[*].reason", hasItem("At least one subject must be enabled")));
    }


}
