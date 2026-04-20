package com.danidmoura.simulador_agil.api.client;

import com.danidmoura.simulador_agil.api.client.dto.EnemApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException;

@FeignClient(
        name = "QuestionClient",
        url = "${client.question-client.url}"
)
public interface QuestionClient {

    @GetMapping(
            value = "/v1/exams/{year}/questions",
            produces = "application/json"
    )
    ResponseEntity<EnemApiResponse> fetchQuestions(
            @PathVariable("year") Integer year,
            @RequestParam("offset") Integer offset,
            @RequestParam("limit") Integer limit
    );
}
