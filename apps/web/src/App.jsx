import React, { useState, useMemo, useCallback } from "react";
import { Buffer } from "buffer";
import "./index.css";

import Simulado from "./Simulado.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Countdown from "./components/Countdown.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ContactModal from "./components/ContactModal.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import DownloadModal from "./components/DownloadModal.jsx";
import ErrorDialog from "./components/ErrorDialog.jsx";
import Spinner from "./components/Spinner.jsx";

import { useQuestionMutation } from "./hooks/useQuestionMutation";

window.Buffer = Buffer;

function App() {
  const [activeSettings, setActiveSettings] = useState(false);
  const [activeContact, setActiveContact] = useState(false);

  const [number, setNumber] = useState(1);
  const [cienciasNatureza, setCienciasNatureza] = useState(true);
  const [matematica, setMatematica] = useState(true);
  const [linguagens, setLinguagens] = useState(true);
  const [cienciasHumanas, setCienciasHumanas] = useState(true);
  const [minYear, setMinYear] = useState(2010);
  const [maxYear, setMaxYear] = useState(2023);

  const mutation = useQuestionMutation();

  const pdfDocument = useMemo(() => {
    if (!mutation.data) return null;
    return <Simulado questions={mutation.data} />;
  }, [mutation.data]);

  const handleSubmit = useCallback(() => {
    mutation.mutate({
      number,
      cienciasNatureza,
      matematica,
      linguagens,
      cienciasHumanas,
      minYear,
      maxYear
    });
  }, [mutation, number, cienciasNatureza, matematica, linguagens, cienciasHumanas, minYear, maxYear]);

  const handleNumberChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 10000) {
      setNumber(value);
    }
  };

  return (
    <div className="min-h-screen bg-[#111010]">
      <header>
        <Navbar 
          onContactClick={() => setActiveContact(true)} 
          onSettingsClick={() => setActiveSettings(true)} 
        />
      </header>

      <main className="flex flex-col justify-center items-center h-screen pt-20">
        
        {activeContact && <ContactModal onClose={() => setActiveContact(false)} />}
        
        {activeSettings && (
          <SettingsModal 
            onClose={() => setActiveSettings(false)}
            linguagens={linguagens}
            setLinguagens={setLinguagens}
            cienciasHumanas={cienciasHumanas}
            setCienciasHumanas={setCienciasHumanas}
            cienciasNatureza={cienciasNatureza}
            setCienciasNatureza={setCienciasNatureza}
            matematica={matematica}
            setMatematica={setMatematica}
            minYear={minYear}
            setMinYear={setMinYear}
            maxYear={maxYear}
            setMaxYear={setMaxYear}
          />
        )}

        <Hero />

        <section className="flex flex-col items-center">
          <div className="flex max-md:flex-col max-md:space-y-2 space-x-2.5">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Entre a quantidade de questões"
              value={number}
              onChange={handleNumberChange}
              className="w-[35vw] max-md:w-[70vw] h-14 bg-stone-800 p-3 text-stone-100 rounded-lg border border-stone-800 focus:border-blue-400 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="w-[100px] max-md:w-[70vw] h-14 bg-blue-400 text-stone-800 p-3 rounded-lg hover:bg-blue-300 transition-all disabled:opacity-50 flex items-center justify-center font-medium"
            >
              {mutation.isPending ? <Spinner className="w-6 h-6 spinner-white" /> : "Enviar"}
            </button>
          </div>

          <p className="text-[14px] mt-[35px] mb-[5vh] text-center text-stone-400">
            Crie seu próprio simulado ENEM, <br />
            entre em <button className="text-blue-400 hover:underline" onClick={() => setActiveSettings(true)}>"Settings"</button> para ajustar os filtros
          </p>
        </section>

        {mutation.data && (
          <DownloadModal 
            pdfDocument={pdfDocument} 
            onClose={() => mutation.reset()} 
          />
        )}
      </main>

      <aside>
        <Countdown />
      </aside>

      {mutation.isError && (
        <ErrorDialog 
          error={mutation.error} 
          onClose={() => mutation.reset()} 
        />
      )}
    </div>
  );
}

export default App;
