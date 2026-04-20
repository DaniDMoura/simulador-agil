package com.danidmoura.simulador_agil.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class QuestionRequestOutOfBoundsException extends ApplicationException {

    private String message;

    public QuestionRequestOutOfBoundsException(String message) {
        this.message = message;
    }

    @Override
    public ProblemDetail problemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problemDetail.setTitle("Question Request Out Of Bounds");
        problemDetail.setDetail(message);
        return problemDetail;
    }
}
