import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import "./index.css";
import Simulado from "./Simulado.jsx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Buffer } from "buffer";
import { Download, CheckCircle, X, Star, Instagram, Linkedin, Github, Mail } from "lucide-react";

window.Buffer = Buffer;

const frases = [
  <h1 className="text-stone-100 leading-[1.1] tracking-tight transition-colors duration-300">
    Prepare-se para o{" "}
    <span className="text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer">ENEM</span>{" "}
    com eficiência
  </h1>,

  <h1 className="text-stone-100 leading-[1.1] tracking-tight transition-colors duration-300">
    Plataforma completa de{" "}
    <span className="text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer">simulados</span>{" "}
    e revisões
  </h1>,

  <h1 className="text-stone-100 leading-[1.1] tracking-tight transition-colors duration-300">
    Organize seus estudos para o{" "}
    <span className="text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer">ENEM</span>{" "}
    com inteligência
  </h1>,

  <h1 className="text-stone-100 leading-[1.1] tracking-tight transition-colors duration-300">
    Faça{" "}
    <span className="text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer">simulados</span>{" "}
    e acompanhe seu progresso
  </h1>,

  <h1 className="text-stone-100 leading-[1.1] tracking-tight transition-colors duration-300">
    A melhor forma de estudar para o{" "}
    <span className="text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer">ENEM</span>{" "}
    está aqui
  </h1>,

  <h1 className="text-stone-100 leading-[1.1] tracking-tight transition-colors duration-300">
    Questões organizadas por{" "}
    <span className="text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer">área</span>{" "}
    e por{" "}
    <span className="text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer">ano</span>
  </h1>,

  <h1 className="text-stone-100 leading-[1.1] tracking-tight transition-colors duration-300">
    Estude com provas anteriores do{" "}
    <span className="text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer">ENEM</span>
  </h1>,

  <h1 className="text-stone-100 leading-[1.1] tracking-tight transition-colors duration-300">
    Domine os conteúdos mais cobrados no{" "}
    <span className="text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer">ENEM</span>
  </h1>,

  <h1 className="text-stone-100 leading-[1.1] tracking-tight transition-colors duration-300">
    Revise com foco, acerte mais no{" "}
    <span className="text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer">ENEM</span>
  </h1>,

  <h1 className="text-stone-100 leading-[1.1] tracking-tight transition-colors duration-300">
    Comece agora sua preparação para o{" "}
    <span className="text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer">ENEM</span>
  </h1>
];

const fetchUsers = async ({
  number,
  cienciasNatureza,
  matematica,
  linguagens,
  cienciasHumanas,
  minYear,
  maxYear
}) => {
  const res = await axios.get(
    "backend/api/v1/gerar_simulado",
    {
      params: {
        numero: number,
        ciencias_natureza: cienciasNatureza,
        matematica: matematica,
        linguagens: linguagens,
        ciencias_humanas: cienciasHumanas,
        min_year: minYear,
        max_year: maxYear
      },
    }
  );
  return res.data;
};

const LoadingSpinner = () => (
  <div className="fixed bg-black w-[100vw] h-[100vh] flex items-center justify-center z-[9999] top-0 left-0 opacity-85">
    <div className="flex flex-col items-center space-y-4">
      <img src="/Eclipse.svg"/>
    </div>
  </div>
);

function App() {
  const [numero, setNumero] = useState(1);
  const [activeSettings, setActiveSettings] = useState(false);
  const [activeContact, setActiveContact] = useState(false)

  const [cienciasNatureza, setCienciasNatureza] = useState(true);
  const [matematica, setMatematica] = useState(true);
  const [linguagens, setLinguagens] = useState(true);
  const [cienciasHumanas, setCienciasHumanas] = useState(true);

  const [frasePrincipal, setFrasePrincipal] = useState(frases[0]);
  const [timeLeft, setTimeLeft] = useState({});

  const [minYear, setMinYear] = useState(2010)
  const [maxYear, setMaxYear] = useState(2023)

  const targetDate = new Date('2025-11-09T13:30:00').getTime();

  const mutation = useMutation({
    mutationFn: fetchUsers,
  });

  const pdfDocument = useMemo(() => {
    if (!mutation.data) return null;
    return <Simulado questions={mutation.data} />;
  }, [mutation.data]);

  const handleClick = () => {
    mutation.mutate({
      number: numero,
      cienciasNatureza: cienciasNatureza,
      matematica: matematica,
      linguagens: linguagens,
      cienciasHumanas: cienciasHumanas,
      minYear: minYear,
      maxYear: maxYear
    });
  };

  const handleUpdate = (e) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 10000) {
      setNumero(value);
    }
  };

  useEffect(() => {
    const index = Math.floor(Math.random() * frases.length);
    setFrasePrincipal(frases[index]);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatTimeLeft = () => {
    if (!timeLeft.days && !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds) {
      return "O ENEM já começou!";
    }

    const parts = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days} dias`);
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours} horas`);
    if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes} minutos`);

    return `Faltam ${parts.join(', ')} para o ENEM 2025`;
  };

  return (
    <div >
      <div className="fixed top-[95vh] right-[0.5vw] max-2xl:top-[93vh] bg-stone-800/90 backdrop-blur-sm text-stone-100 px-4 py-2 rounded-lg z-50 border border-stone-700">
        <div className="text-sm max-sm:text-[10px] font-medium">{formatTimeLeft()}</div>
      </div>

      <div>
          <div className="fixed w-full z-[9999] text-sm sm:text-md">
            <nav className="relative bg-[#111010] z-[9999] flex p-2 sm:p-[10px] flex-col sm:flex-row justify-between sm:justify-around items-center space-y-2 sm:space-y-0 sm:space-x-[20px]">
              <a className="text-stone-100 text-lg sm:text-base font-medium">
                Simulador<span className="font-bold">Ágil</span>
              </a>
              <div className="flex space-x-4 sm:space-x-[20px]">
                <a className="text-stone-100 cursor-pointer hover:text-blue-400 transition-colors" onClick={() => {setActiveContact(true)}}>Contact</a>
                <a
                  className="text-stone-100 cursor-pointer hover:text-blue-400 transition-colors"
                  href="https://github.com/DaniDMoura/SimuladorAgil"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source
                </a>
                <a
                  onClick={() => setActiveSettings(true)}
                  className="text-stone-100 cursor-pointer hover:text-blue-400 transition-colors"
                >
                  Settings
                </a>
              </div>
            </nav>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center h-[100vh]">
          {mutation.isPending && <LoadingSpinner />}
          {activeContact && (
              <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[9999]">
                <div className="bg-stone-800 w-[90vw] max-w-md h-auto rounded-xl p-6 relative">
                  <button
                    className="absolute top-4 right-4 p-2 w-8 h-8 hover:bg-stone-700 transition-colors duration-200 rounded-lg flex items-center justify-center text-stone-300 hover:text-white"
                    onClick={() => setActiveContact(false)}
                  >
                    <X size={16} />
                  </button>

                  <h2 className="text-xl flex font-medium text-stone-100 mb-6 mt-2 items-center gap-1" >
                    <div className="w-8 h-8 flex justify-center items-center bg-stone-900 rounded-full "><Mail size={18}/></div>
                    Contact Me
                  </h2>

                  <div className="h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent mb-6"></div>

                  <div className="grid grid-cols-3 gap-3">
                    <a
                      href="https://www.linkedin.com/in/danilosantos-moura/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="p-3 w-[100%] rounded-lg cursor-pointer bg-stone-700 hover:bg-blue-600 hover:text-white transition-colors duration-200 text-stone-300">
                        <Linkedin size={20} />
                      </button>
                    </a>

                    <a
                      href="https://www.instagram.com/danilosmoura_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      >
                      <button className="p-3 w-[100%] cursor-pointer rounded-lg bg-stone-700 hover:bg-pink-600 hover:text-white transition-colors duration-200 text-stone-300">
                        <Instagram size={20} />
                      </button>
                    </a>

                    <a
                      href="https://github.com/DaniDMoura"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="p-3 w-[100%] rounded-lg cursor-pointer bg-stone-700 hover:bg-gray-800 hover:text-white transition-colors duration-200 text-stone-300">
                        <Github size={20} />
                      </button>
                    </a>
                  </div>
                    <a
                      href="https://github.com/DaniDMoura/SimuladorAgil"
                      target="_blank"
                      rel="noopener noreferrer" >
                      <button
                            className="mb-1 mt-5 w-full border border-yellow-100 text-yellow-100 font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-100 hover:text-stone-800 transition-colors"
                          >
                            <Star className="w-5 h-5" />
                            <span className="text-lg font-family-primary">
                              Estrelar repositório
                            </span>
                      </button>
                    </a>
                </div>
              </div>
            )}
          {activeSettings && (
            <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[9999]">
              <div className="bg-stone-800 animate-appear2 w-[90vw] max-w-md h-auto rounded-xl p-6 relative opacity-0">
                <button
                  className="absolute top-4 right-4 p-2 w-8 h-8 hover:bg-stone-700 transition-colors duration-200 rounded-lg flex items-center justify-center text-stone-300 hover:text-white"
                  onClick={() => setActiveSettings(false)}
                >
                  <X size={16} />
                </button>

                <h2 className="text-xl font-medium text-stone-100 mb-6 mt-2">
                  Disciplinas
                </h2>

                <div className="h-px bg-stone-700 mb-6"></div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`p-4 transition-all duration-200 rounded-lg flex items-center justify-center !font-family-primary border-2 ${
                      linguagens
                        ? "bg-stone-900 border-blue-400 text-blue-400"
                        : "bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-600 hover:text-stone-300"
                    }`}
                    onClick={() => setLinguagens(!linguagens)}
                  >
                    Linguagens
                  </button>

                  <button
                    className={`p-4 transition-all duration-200 rounded-lg flex items-center justify-center !font-family-primary border-2 ${
                      cienciasHumanas
                        ? "bg-stone-900 border-blue-400 text-blue-400"
                        : "bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-600 hover:text-stone-300"
                    }`}
                    onClick={() => setCienciasHumanas(!cienciasHumanas)}
                  >
                    Ciências Humanas
                  </button>

                  <button
                    className={`p-4 transition-all duration-200 rounded-lg flex items-center justify-center !font-family-primary border-2 ${
                      cienciasNatureza
                        ? "bg-stone-900 border-blue-400 text-blue-400"
                        : "bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-600 hover:text-stone-300"
                    }`}
                    onClick={() => setCienciasNatureza(!cienciasNatureza)}
                  >
                    Ciências da Natureza
                  </button>

                  <button
                    className={`p-4 transition-all duration-200 rounded-lg flex items-center justify-center !font-family-primary border-2 ${
                      matematica
                        ? "bg-stone-900 border-blue-400 text-blue-400"
                        : "bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-600 hover:text-stone-300"
                    }`}
                    onClick={() => setMatematica(!matematica)}
                  >
                    Matemática
                  </button>
                </div>

                <div className="h-px bg-stone-700 mb-4 mt-6"></div>

                <h2 className="text-xl font-medium text-stone-100 mb-6 mt-6">
                  Ano da Prova
                </h2>

                <div className="h-px bg-stone-700 mb-4"></div>

                <div className="flex flex-col space-y-2">
                  <div>
                    <p className="mb-2 text-stone-100">Ano Inicial: {minYear}</p>
                    <input
                      className="w-full bg-blue-400"
                      type="range"
                      min={2010}
                      max={2023}
                      value={minYear}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        setMinYear(newValue);
                        if (newValue > maxYear) {
                          setMaxYear(newValue);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-stone-100">Ano Final: {maxYear}</p>
                    <input
                      className="w-full bg-blue-400"
                      type="range"
                      min={2010}
                      max={2023}
                      value={maxYear}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        setMaxYear(newValue);
                        if (newValue < minYear) {
                          setMinYear(newValue);
                        }
                      }}
                    />
                  </div>
                </div>


              </div>
            </div>
          )}

          <div className="text-[95px] max-2xl:w-[50vw] opacity-0 max-md:text-[60px] mb-[35px] text-center m-[10px] max-2xl:mt-[10vh] w-[40vw] max-md:w-[100vw] font-light font-family-granaina animate-appear">
            {frasePrincipal}
          </div>

          <div className="flex max-md:flex-col max-md:space-y-2 space-x-2.5">
            <input
              placeholder="Entre a quantidade de questões"
              pattern="[0-9]*"
              value={numero}
              onChange={handleUpdate}
              className="w-[35vw] max-md:w-[70vw] h-14 bg-stone-800 p-3 text-stone-100 rounded-lg border border-stone-800 focus:border-blue-400 outline-none"
            />
            <button
              type="button"
              onClick={handleClick}
              disabled={mutation.isPending}
              className="w-[100px] max-md:w-[70vw] h-14 bg-blue-400 text-stone-800 p-3 rounded-lg cursor-pointer hover:bg-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>

          <div className="text-[14px] mt-[35px] mb-[5vh] text-center text-stone-400">
            Crie seu próprio simulado ENEM, <br />
            entre em <span className="text-blue-400 cursor-pointer" onClick={() => setActiveSettings(true)}>"Settings"</span> para ajustar os filtros
          </div>

          {mutation.data && (
            <div className="flex fixed bg-black/85 w-[100vw] h-[100vh] z-[9999] justify-center items-center">
              <div
                className="opacity-0 animate-appear2 bg-stone-900 rounded-xl p-8 max-w-[30vw] max-md:max-w-[70vw] w-full mb-[10vh]"
              >
                <div className="text-center mb-8">
                  <div className="relative mb-4">
                    <button
                      className="absolute -top-7 -right-7 p-2 w-8 h-8 hover:bg-stone-700 transition-colors duration-200 rounded-lg flex items-center justify-center text-stone-300 hover:text-white"
                      onClick={() => mutation.reset()}
                    >
                      <X size={16} />
                    </button>
                    <CheckCircle className="w-12 h-12 text-blue-400 mx-auto drop-shadow-lg" />
                    <div className="absolute inset-0 w-12 h-12 animate-pulse bg-blue-400/20 rounded-full blur-md mx-auto"></div>
                  </div>
                  <h2 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                    Simulado Pronto!
                  </h2>
                  <p className="text-stone-400 text-base">
                    Seu arquivo está{" "}
                    <span className="text-blue-400">pronto para download</span>
                  </p>
                </div>

                <div className="relative mb-5">
                  <div className="h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent"></div>
                </div>

                  <a
                      href="https://github.com/DaniDMoura/SimuladorAgil"
                      target="_blank"
                      rel="noopener noreferrer" >
                      <button
                            className="mb-3 w-full border border-yellow-100 text-yellow-100 font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-100 hover:text-stone-800 transition-colors"
                          >
                            <Star className="w-5 h-5" />
                            <span className="text-lg font-family-primary">
                              Estrelar repositório
                            </span>
                      </button>
                  </a>
                <PDFDownloadLink document={pdfDocument} fileName="simulado.pdf">
                  {({ loading }) => (
                    <button
                      disabled={loading}
                      className="w-full bg-blue-400 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-300 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span className="text-lg font-family-primary">
                        {loading ? "Gerando PDF..." : "Baixar PDF"}
                      </span>
                    </button>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          )}
        </div>

        {mutation.isError && (
          <div className="bg-stone-100 border-l-4 opacity-0 animate-appearDialog border-red-500 shadow-lg rounded-lg p-6 w-80 fixed z-50 top-200 left-5 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
              <div>
                <h3 className="text-stone-800 font-medium">Erro</h3>
                <p className="text-stone-600 text-sm mt-1">
                  Não foi possível carregar o simulado
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default App;