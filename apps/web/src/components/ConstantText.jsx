import React from "react";

/**
 * Component to wrap static constant text that requires the serif typography.
 * Enforces the usage of Granaina Limpia and limits vertical expansion to 2 lines.
 */
const ConstantText = ({ children, className = "" }) => {
  return (
    <span className={`font-constant block line-clamp-2 leading-tight ${className}`}>
      {children}
    </span>
  );
};

export default ConstantText;
