import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsModal from "../components/SettingsModal";
import { describe, it, expect, vi } from "vitest";
import React from "react";

describe("SettingsModal", () => {
  const defaultProps = {
    onClose: vi.fn(),
    linguagens: true,
    setLinguagens: vi.fn(),
    cienciasHumanas: true,
    setCienciasHumanas: vi.fn(),
    cienciasNatureza: true,
    setCienciasNatureza: vi.fn(),
    matematica: true,
    setMatematica: vi.fn(),
    minYear: 2010,
    setMinYear: vi.fn(),
    maxYear: 2023,
    setMaxYear: vi.fn(),
  };

  it("renders with correct discipline states", () => {
    render(<SettingsModal {...defaultProps} />);
    
    expect(screen.getByText("Linguagens")).toHaveClass("bg-primary/10 border-primary");
    expect(screen.getByText("Disciplinas")).toBeInTheDocument();
  });

  it("calls toggle functions on button clicks", () => {
    render(<SettingsModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText("Linguagens"));
    expect(defaultProps.setLinguagens).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Ciências Humanas"));
    expect(defaultProps.setCienciasHumanas).toHaveBeenCalled();
  });

  it("displays current year values", () => {
    render(<SettingsModal {...defaultProps} />);
    
    expect(screen.getByText("Ano Inicial")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
    expect(screen.getByText("Ano Final")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<SettingsModal {...defaultProps} />);
    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
