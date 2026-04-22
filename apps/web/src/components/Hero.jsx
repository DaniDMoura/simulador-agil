import React, { useState, useEffect } from "react";
import { FRASES } from "../constants/appConstants";
import ConstantText from "./ConstantText";

const Hero = () => {
  const [frasePrincipal, setFrasePrincipal] = useState(null);

  useEffect(() => {
    const index = Math.floor(Math.random() * FRASES.length);
    setFrasePrincipal(FRASES[index]);
  }, []);

  return (
    <h1 
      className="flex justify-center w-full opacity-0 mb-8 text-center animate-appear transition-colors duration-300"
      style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)', maxWidth: '28ch' }}
    >
      <ConstantText className="font-medium leading-tight tracking-tight text-text text-balance">
        {frasePrincipal}
      </ConstantText>
    </h1>
  );
};

export default Hero;
