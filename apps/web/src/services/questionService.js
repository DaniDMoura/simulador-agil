import axios from "axios";

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
    "/api/questions",
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
