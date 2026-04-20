import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { fetchQuestions } from "../services/questionService";

vi.mock("axios");

describe("questionService", () => {
  it("calls axios.post with correct parameters", async () => {
    const mockData = [{ id: 1, text: "Question 1" }];
    axios.post.mockResolvedValueOnce({ data: mockData });

    const params = {
      number: 10,
      cienciasNatureza: true,
      matematica: false,
      linguagens: true,
      cienciasHumanas: false,
      minYear: 2010,
      maxYear: 2020
    };

    const result = await fetchQuestions(params);

    expect(axios.post).toHaveBeenCalledWith("/api/questions", {
      number: 10,
      minYear: 2010,
      maxYear: 2020,
      enableCienciasNatureza: true,
      enableCienciasHumanas: false,
      enableLinguagens: true,
      enableMatematica: false
    });
    expect(result).toEqual(mockData);
  });
});
