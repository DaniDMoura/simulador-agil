package com.danidmoura.simulador_agil.api.controller;

import com.danidmoura.simulador_agil.api.dto.QuestionRequest;
import com.danidmoura.simulador_agil.api.dto.QuestionResponse;
import com.danidmoura.simulador_agil.api.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public ResponseEntity<List<QuestionResponse>> getQuestions(
            @Valid @RequestBody QuestionRequest questionRequest
    ) {
        return ResponseEntity.ok(
                questionService.getQuestions(questionRequest)
        );
    }
}
