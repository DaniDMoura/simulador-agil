import { useMutation } from "@tanstack/react-query";
import { fetchQuestions } from "../services/questionService";

export const useQuestionMutation = () => {
  return useMutation({
    mutationFn: fetchQuestions,
  });
};
