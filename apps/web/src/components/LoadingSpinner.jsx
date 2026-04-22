import React from "react";
import Spinner from "./Spinner";

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-[10000] animate-fadeIn">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <Spinner className="w-16 h-16 relative z-10" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">
          Buscando Questões
        </h2>
        <p className="text-neutral-500 text-sm animate-pulse">
          Isso pode levar alguns segundos...
        </p>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
