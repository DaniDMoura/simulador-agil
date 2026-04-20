import { describe, it, expect } from "vitest";
import { parseApiError } from "../utils/errorParser";

describe("parseApiError", () => {
  it("parses validation errors (RFC 7807) correctly", () => {
    const error = {
      response: {
        status: 400,
        data: {
          title: "Your request parameters didn't validate.",
          "invalid-params": [
            { name: "number", reason: "must not be null" }
          ]
        }
      }
    };

    const result = parseApiError(error);

    expect(result.title).toBe("Your request parameters didn't validate.");
    expect(result.status).toBe(400);
    expect(result.validationErrors).toHaveLength(1);
    expect(result.validationErrors[0]).toEqual({ name: "number", reason: "must not be null" });
  });

  it("handles generic 500 server errors", () => {
    const error = {
      response: {
        status: 500,
        data: {
          title: "Internal Server Error"
        }
      }
    };

    const result = parseApiError(error);

    expect(result.title).toBe("Internal Server Error");
    expect(result.status).toBe(500);
    expect(result.validationErrors).toEqual([]);
  });

  it("provides fallback for unexpected response shapes", () => {
    const error = {
      response: {
        status: 404,
        data: "Not Found" 
      }
    };

    const result = parseApiError(error);

    expect(result.title).toBe("Falha na requisição");
    expect(result.status).toBe(404);
  });

  it("handles null/undefined/network errors gracefully", () => {
    const resultNull = parseApiError(null);
    expect(resultNull.title).toBe("Erro inesperado");
    expect(resultNull.status).toBe(500);

    const networkError = { message: "Network Error" };
    const resultNetwork = parseApiError(networkError);
    expect(resultNetwork.detail).toBe("Network Error");
  });
});
