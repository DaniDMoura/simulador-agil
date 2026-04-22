import React from "react";
import { CheckCircle, Star, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Modal from "./Modal";
import Spinner from "./Spinner";

const DownloadModal = ({ onClose, pdfDocument }) => {
  const footer = (
    <div className="flex flex-col gap-3">
      <a
        href="https://github.com/DaniDMoura/SimuladorAgil"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
        <button className="w-full border cursor-pointer border-primary/50 text-primary font-medium py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-primary hover:text-bg transition-all duration-300 active:scale-[0.98]">
          <Star className="w-5 h-5" />
          <span className="font-semibold">Estrelar repositório</span>
        </button>
      </a>

      <PDFDownloadLink document={pdfDocument} fileName="simulado.pdf">
        {({ loading }) => (
          <button
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xl hover:bg-primary-hover disabled:opacity-70 transition-all duration-300 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Spinner className="w-6 h-6 spinner-white" />
                <span>Gerando PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                <span>Baixar Simulado</span>
              </>
            )}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );

  return (
    <Modal title="Simulado Pronto!" onClose={onClose} footer={footer}>
      <div className="flex flex-col items-center text-center py-6">
        <div className="relative mb-6">
          <div className="absolute inset-0 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <CheckCircle className="w-20 h-20 text-primary relative z-10" />
        </div>
        
        <p className="text-neutral-300 text-lg font-medium leading-tight mb-2">
          Seu arquivo foi gerado com sucesso!
        </p>
        <p className="text-neutral-500 text-sm">
          Clique no botão abaixo para salvar o PDF em seu dispositivo.
        </p>
      </div>
    </Modal>
  );
};

export default DownloadModal;
