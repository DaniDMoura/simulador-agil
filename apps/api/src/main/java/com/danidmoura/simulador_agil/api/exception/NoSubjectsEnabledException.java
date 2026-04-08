package com.danidmoura.simulador_agil.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class NoSubjectsEnabledException extends ApplicationException {

    @Override
    public ProblemDetail problemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problemDetail.setTitle("No subjects were enabled");
        problemDetail.setDetail("At least one subject must be enabled");
        return problemDetail;
    }
}
