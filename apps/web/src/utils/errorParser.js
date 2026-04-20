/**
 * Parses API error responses according to RFC 7807 Problem Details.
 * Handles validation errors (invalid-params) and generic fallbacks.
 */
export const parseApiError = (error) => {
  const defaultError = {
    title: "Erro inesperado",
    status: 500,
    detail: "Ocorreu um problema ao processar sua solicitação. Tente novamente mais tarde.",
    validationErrors: []
  };

  if (!error || !error.response) {
    return {
      ...defaultError,
      detail: error?.message || defaultError.detail
    };
  }

  const { data, status } = error.response;

  return {
    title: data.title || (status === 500 ? "Erro no servidor" : "Falha na requisição"),
    status: data.status || status,
    detail: data.detail || null,
    validationErrors: Array.isArray(data["invalid-params"]) 
      ? data["invalid-params"].map(param => ({
          name: param.name || "campo",
          reason: param.reason || "inválido"
        }))
      : []
  };
};
