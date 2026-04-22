import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import ErrorDialog from "../components/ErrorDialog";

describe("ErrorDialog component", () => {
  const onClose = vi.fn();

  it("Scenario 1: Validation error (400) rendering", () => {
    const mockError = {
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

    render(<ErrorDialog error={mockError} onClose={onClose} />);

    expect(screen.getByText("Your request parameters didn't validate.")).toBeInTheDocument();

    expect(screen.getByText("number")).toBeInTheDocument();
    expect(screen.getByText(/must not be null/)).toBeInTheDocument();
  });

  it("Scenario 2: Server error (500) rendering", () => {
    const mockError = {
      response: {
        status: 500,
        data: {
          title: "Internal Server Error"
        }
      }
    };

    render(<ErrorDialog error={mockError} onClose={onClose} />);

    expect(screen.getByText("Internal Server Error")).toBeInTheDocument();

    expect(screen.queryByText(/Erros de Validação:/i)).not.toBeInTheDocument();
  });

  it("Scenario 3: Unexpected / malformed error rendering", () => {
    render(<ErrorDialog error={{ message: "Something went wrong" }} onClose={onClose} />);

    expect(screen.getByText("Erro inesperado")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("calls onClose when buttons are clicked", () => {
    const mockError = { message: "error" };
    render(<ErrorDialog error={mockError} onClose={onClose} />);

    const closeIcon = screen.getByLabelText("Close modal");
    fireEvent.click(closeIcon);
    expect(onClose).toHaveBeenCalledTimes(1);

    const okButton = screen.getByText("Entendido");
    fireEvent.click(okButton);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("renders nothing when error is null", () => {
    const { container } = render(<ErrorDialog error={null} onClose={onClose} />);
    expect(container).toBeEmptyDOMElement();
  });
});
