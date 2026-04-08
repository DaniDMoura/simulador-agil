package com.danidmoura.simulador_agil.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class ApplicationException extends RuntimeException {

    public ProblemDetail problemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problemDetail.setTitle("Api Internal Server Error");
        problemDetail.setDetail("An unexpected error occurred. Please try again later.");
        return problemDetail;
    }
}
