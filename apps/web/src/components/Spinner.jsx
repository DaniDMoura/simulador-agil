import React from "react";

/**
 * Reusable Spinner component that uses the project's official Eclipse.svg asset.
 * Applies a smooth CSS-based rotation for consistent UI control.
 */
const Spinner = ({ className = "w-5 h-5" }) => {
  return (
    <img 
      src="/Eclipse.svg" 
      alt="Carregando..." 
      className={`spinner-rotate inline-block ${className}`}
    />
  );
};

export default Spinner;
