import React from "react";
import { AlertCircle } from "lucide-react";
import { parseApiError } from "../utils/errorParser";
import Modal from "./Modal";

const ErrorDialog = ({ error, onClose }) => {
  if (!error) return null;

  const { title, status, validationErrors, detail } = parseApiError(error);

  const footer = (
    <div className="flex justify-end">
      <button
        onClick={onClose}
        className="bg-red-500/10 text-red-500 border cursor-pointer border-red-500/20 px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all shadow-md active:scale-95"
      >
        Entendido
      </button>
    </div>
  );

  const modalTitle = (
    <div className="flex items-center gap-2 text-red-500">
      <AlertCircle size={24} strokeWidth={2.5} />
      <span>{title}</span>
    </div>
  );

  return (
    <Modal title={modalTitle} onClose={onClose} footer={footer}>
      <div className="space-y-4 py-2">
        {detail && (
          <p className="text-stone-300 text-sm leading-relaxed">
            {detail}
          </p>
        )}

        {validationErrors.length > 0 && (
          <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-3">
              Erros de Validação
            </p>
            <ul className="space-y-2">
              {validationErrors.map((err, idx) => (
                <li key={idx} className="text-stone-400 text-sm flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-stone-200">{err.name}</strong>: {err.reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {status && !validationErrors.length && (
          <p className="text-stone-500 text-xs font-mono bg-stone-900/50 p-2 rounded-lg w-fit">
            Status Code: {status}
          </p>
        )}
      </div>
    </Modal>
  );
};

export default ErrorDialog;
