import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const fetchQuestions = async ({
  number,
  cienciasNatureza,
  matematica,
  linguagens,
  cienciasHumanas,
  minYear,
  maxYear
}) => {
  const res = await axios.post(
    `${API_URL}/questions`,
    {
      number,
      minYear,
      maxYear,
      enableCienciasNatureza: cienciasNatureza,
      enableCienciasHumanas: cienciasHumanas,
      enableLinguagens: linguagens,
      enableMatematica: matematica
    }
  );
  return res.data;
};
