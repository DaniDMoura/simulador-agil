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
        <button className="w-full border cursor-pointer border-yellow-500/50 text-yellow-500 font-medium py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-yellow-500 hover:text-stone-900 transition-all duration-300 active:scale-[0.98]">
          <Star className="w-5 h-5" />
          <span className="font-semibold">Estrelar repositório</span>
        </button>
      </a>

      <PDFDownloadLink document={pdfDocument} fileName="simulado.pdf">
        {({ loading }) => (
          <button
            disabled={loading}
            className="w-full bg-blue-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xl hover:bg-blue-400 disabled:opacity-70 transition-all duration-300 active:scale-[0.98]"
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
          <div className="absolute inset-0 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <CheckCircle className="w-20 h-20 text-blue-500 relative z-10" />
        </div>
        
        <p className="text-stone-300 text-lg font-medium leading-tight mb-2">
          Seu arquivo foi gerado com sucesso!
        </p>
        <p className="text-stone-500 text-sm">
          Clique no botão abaixo para salvar o PDF em seu dispositivo.
        </p>
      </div>
    </Modal>
  );
};

export default DownloadModal;
