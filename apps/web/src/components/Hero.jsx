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
    <h1 className="flex justify-center w-full opacity-0 mb-6 md:mb-8 text-center animate-appear transition-colors duration-300">
      <ConstantText className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] max-w-[95vw] md:max-w-[85vw] lg:max-w-[80vw] font-medium leading-tight tracking-tight text-stone-100">
        {frasePrincipal}
      </ConstantText>
    </h1>
  );
};

export default Hero;
