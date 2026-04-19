package com.danidmoura.simulador_agil.api.util;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class QuestionRandomProvider {

    public int nextInt(int bound) {
        return ThreadLocalRandom.current().nextInt(bound);
    }

    public <T> void shuffle(List<T> list) {
        Collections.shuffle(list);
    }
}
