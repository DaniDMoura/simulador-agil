import { describe, it, expect } from "vitest";
import {
  estimateQuestionHeight,
  distributeQuestions,
  isValidImageUrl,
  resolveImageUrl,
  AVAILABLE_CONTENT_HEIGHT,
} from "../utils/pdfLayout";

const makeQuestion = (overrides = {}) => ({
  year: 2023,
  context: "Contexto da questão.",
  alternativesIntroduction: "Assinale a alternativa correta:",
  alternatives: [
    { letter: "A", text: "Alternativa A", file: null, isCorrect: true },
    { letter: "B", text: "Alternativa B", file: null, isCorrect: false },
    { letter: "C", text: "Alternativa C", file: null, isCorrect: false },
    { letter: "D", text: "Alternativa D", file: null, isCorrect: false },
    { letter: "E", text: "Alternativa E", file: null, isCorrect: false },
  ],
  ...overrides,
});

describe("estimateQuestionHeight", () => {
  it("returns a positive height for a minimal question", () => {
    const q = makeQuestion({ context: "Pequeno.", alternativesIntroduction: null });
    expect(estimateQuestionHeight(q)).toBeGreaterThan(0);
  });

  it("increases height for longer context", () => {
    const shortContext = "Curto.";
    const longContext = "A".repeat(500);
    const short = makeQuestion({ context: shortContext });
    const long = makeQuestion({ context: longContext });
    expect(estimateQuestionHeight(long)).toBeGreaterThan(estimateQuestionHeight(short));
  });

  it("increases height for markdown images in context", () => {
    const withoutImage = makeQuestion({ context: "Texto puro." });
    const withImage = makeQuestion({
      context: "Texto puro. ![](https://enem.dev/image.png)",
    });
    expect(estimateQuestionHeight(withImage)).toBeGreaterThan(
      estimateQuestionHeight(withoutImage)
    );
  });

  it("increases height for alternatives with images", () => {
    const baseAlternatives = [
      { letter: "A", text: "Texto", file: null, isCorrect: true },
    ];
    const alternativesWithImage = [
      { letter: "A", text: "Texto", file: "https://enem.dev/a.png", isCorrect: true },
    ];
    const withoutImage = makeQuestion({ alternatives: baseAlternatives });
    const withImage = makeQuestion({ alternatives: alternativesWithImage });
    expect(estimateQuestionHeight(withImage)).toBeGreaterThan(
      estimateQuestionHeight(withoutImage)
    );
  });

  it("handles alternatives where only the image file is present", () => {
    const alternativesOnlyImage = [
      { letter: "A", text: null, file: "https://enem.dev/2016/questions/85/833fc836-0f12-40c2-9c58-7e3888e19f961.png", isCorrect: false },
      { letter: "B", text: null, file: "https://enem.dev/2016/questions/85/36cd457b-9a51-46ad-b1d2-9d001cfea3fb.png", isCorrect: false },
      { letter: "C", text: null, file: "https://enem.dev/2016/questions/85/b9f7a6b9-8121-4c65-b09e-4edd8cd7686e.png", isCorrect: true },
      { letter: "D", text: null, file: "https://enem.dev/2016/questions/85/734af3d9-bff8-4170-87d8-173ed2430611.png", isCorrect: false },
      { letter: "E", text: null, file: "https://enem.dev/2016/questions/85/1e609441-aae0-4ddc-b65f-a436905f8033.png", isCorrect: false },
    ];
    const q = makeQuestion({
      context: "Selecione a alternativa correta.",
      alternatives: alternativesOnlyImage,
    });
    expect(estimateQuestionHeight(q)).toBeGreaterThan(0);
  });
});

describe("distributeQuestions", () => {
  it("places all questions in order and fills column 1 first", () => {
    const questions = Array.from({ length: 4 }, (_, i) =>
      makeQuestion({ context: `Questão ${i + 1}.` })
    );
    const pages = distributeQuestions(questions, AVAILABLE_CONTENT_HEIGHT);

    expect(pages).toHaveLength(1);

    // Column 1 must be filled before column 2; the exact split depends on
    // the height estimator, but the reading order must remain sequential.
    const readingOrder = [
      ...pages[0].left.map((item) => item.index),
      ...pages[0].right.map((item) => item.index),
    ];
    expect(readingOrder).toEqual([0, 1, 2, 3]);
  });

  it("fills column 1 before column 2 on each page", () => {
    const questions = Array.from({ length: 6 }, (_, i) =>
      makeQuestion({ context: `Questão ${i + 1}.` })
    );
    const pages = distributeQuestions(questions, AVAILABLE_CONTENT_HEIGHT);

    // Sequential reading order across left/right columns
    const allIndices = pages.flatMap((page) => [
      ...page.left.map((item) => item.index),
      ...page.right.map((item) => item.index),
    ]);
    expect(allIndices).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("creates a new page only after both columns are full", () => {
    const bigContext = "A".repeat(2000);
    const questions = Array.from({ length: 8 }, (_, i) =>
      makeQuestion({ context: `${bigContext} Questão ${i + 1}.` })
    );
    const pages = distributeQuestions(questions, AVAILABLE_CONTENT_HEIGHT);

    expect(pages.length).toBeGreaterThan(1);

    // No page should receive a question when both columns are already full.
    for (const page of pages) {
      const pageHeight =
        page.left.reduce((sum, { question }) => sum + estimateQuestionHeight(question), 0) +
        page.right.reduce((sum, { question }) => sum + estimateQuestionHeight(question), 0);
      expect(pageHeight).toBeLessThanOrEqual(AVAILABLE_CONTENT_HEIGHT * 2 + 1);
    }
  });

  it("preserves the original question object and index", () => {
    const questions = [makeQuestion({ year: 2020 }), makeQuestion({ year: 2021 })];
    const pages = distributeQuestions(questions, AVAILABLE_CONTENT_HEIGHT);
    expect(pages[0].left[0].question.year).toBe(2020);
    expect(pages[0].left[0].index).toBe(0);
    expect(pages[0].left[1].question.year).toBe(2021);
    expect(pages[0].left[1].index).toBe(1);
  });
});

describe("isValidImageUrl", () => {
  it("accepts absolute http and https URLs", () => {
    expect(isValidImageUrl("https://enem.dev/img.png")).toBe(true);
    expect(isValidImageUrl("http://enem.dev/img.png")).toBe(true);
  });

  it("rejects null, undefined and relative URLs", () => {
    expect(isValidImageUrl(null)).toBe(false);
    expect(isValidImageUrl(undefined)).toBe(false);
    expect(isValidImageUrl("/img.png")).toBe(false);
    expect(isValidImageUrl("img.png")).toBe(false);
    expect(isValidImageUrl("")).toBe(false);
  });
});

describe("resolveImageUrl", () => {
  it("returns absolute URLs unchanged", () => {
    expect(resolveImageUrl("https://enem.dev/img.png")).toBe(
      "https://enem.dev/img.png"
    );
  });

  it("resolves protocol-relative URLs", () => {
    expect(resolveImageUrl("//enem.dev/img.png")).toBe(
      "https://enem.dev/img.png"
    );
  });

  it("resolves relative URLs against enem.dev", () => {
    expect(resolveImageUrl("/img.png")).toBe("https://enem.dev/img.png");
    expect(resolveImageUrl("img.png")).toBe("https://enem.dev/img.png");
  });

  it("returns null for missing or invalid input", () => {
    expect(resolveImageUrl(null)).toBeNull();
    expect(resolveImageUrl("")).toBeNull();
  });
});
