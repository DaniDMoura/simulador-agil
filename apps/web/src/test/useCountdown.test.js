import { renderHook, act } from "@testing-library/react";
import { useCountdown } from "../hooks/useCountdown";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates time left correctly", () => {
    const targetDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 2; 
    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current.timeLeft.days).toBe(2);
    expect(result.current.formatTimeLeft()).toContain("2 dias");
  });

  it("updates time left every second", () => {
    const targetDate = new Date().getTime() + 1000 * 10; 
    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current.timeLeft.seconds).toBe(10);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.timeLeft.seconds).toBe(9);
  });

  it('returns "O ENEM já começou!" when target date has passed', () => {
    const targetDate = new Date().getTime() - 1000; 
    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current.formatTimeLeft()).toBe("O ENEM já começou!");
  });
});
