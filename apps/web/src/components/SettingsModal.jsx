import React from "react";
import Modal from "./Modal";

const SettingsModal = ({
  onClose,
  linguagens,
  setLinguagens,
  cienciasHumanas,
  setCienciasHumanas,
  cienciasNatureza,
  setCienciasNatureza,
  matematica,
  setMatematica,
  minYear,
  setMinYear,
  maxYear,
  setMaxYear,
}) => {
  const subjects = [
    { label: "Linguagens", state: linguagens, setter: setLinguagens },
    { label: "Ciências Humanas", state: cienciasHumanas, setter: setCienciasHumanas },
    { label: "Ciências da Natureza", state: cienciasNatureza, setter: setCienciasNatureza },
    { label: "Matemática", state: matematica, setter: setMatematica },
  ];

  return (
    <Modal title="Filtros do Simulado" onClose={onClose}>
      <div className="space-y-8 py-2">
        <section>
          <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">
            Disciplinas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map(({ label, state, setter }) => (
              <button
                key={label}
                className={`p-4 transition-all cursor-pointer duration-300 rounded-xl flex items-center justify-center text-sm font-semibold border-2 ${
                  state
                    ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "bg-stone-700/20 border-stone-700 text-stone-500 hover:border-stone-600 hover:text-stone-400"
                } active:scale-[0.97]`}
                onClick={() => setter(!state)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-6">
            Ano da Prova
          </h3>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-stone-300 font-medium">Ano Inicial</span>
                <span className="text-blue-400 font-bold text-lg">{minYear}</span>
              </div>
              <input
                className="w-full h-2 bg-stone-700 rounded-lg appearance-none accent-blue-500 hover:accent-blue-400 transition-all"
                type="range"
                min={2010}
                max={2023}
                value={minYear}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  setMinYear(newValue);
                  if (newValue > maxYear) setMaxYear(newValue);
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-stone-300 font-medium">Ano Final</span>
                <span className="text-blue-400 font-bold text-lg">{maxYear}</span>
              </div>
              <input
                className="w-full h-2 bg-stone-700 rounded-lg appearance-none accent-blue-500 hover:accent-blue-400 transition-all"
                type="range"
                min={2010}
                max={2023}
                value={maxYear}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  setMaxYear(newValue);
                  if (newValue < minYear) setMinYear(newValue);
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default SettingsModal;
