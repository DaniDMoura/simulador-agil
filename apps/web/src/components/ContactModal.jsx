import React from "react";
import { Linkedin, Instagram, Github, Star } from "lucide-react";
import Modal from "./Modal";

const ContactModal = ({ onClose }) => {
  const footer = (
    <a
      href="https://github.com/DaniDMoura/SimuladorAgil"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <button className="w-full border cursor-pointer border-primary/50 hover:text-white text-primary font-medium py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-primary transition-all duration-300 active:scale-[0.98]">
        <Star className="w-5 h-5" />
        <span className="text-lg">Estrelar repositório</span>
      </button>
    </a>
  );

  return (
    <Modal title="Contact Me" onClose={onClose} footer={footer}>
      <div className="space-y-6 py-2">
        <p className="text-neutral-400 text-sm leading-relaxed">
          Sinta-se à vontade para entrar em contato através das minhas redes sociais ou conferir meus projetos no GitHub.
        </p>
        
        <div className="grid grid-cols-3 gap-4">
          <a
            href="https://www.linkedin.com/in/danilosantos-moura/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-700/30 hover:bg-primary/20 text-neutral-300 hover:text-primary-light border border-transparent hover:border-primary/30 transition-all duration-300 group"
          >
            <Linkedin size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium uppercase tracking-widest">LinkedIn</span>
          </a>

          <a
            href="https://www.instagram.com/danilosmoura_/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-700/30 hover:bg-primary/20 text-neutral-300 hover:text-primary-light border border-transparent hover:border-primary/30 transition-all duration-300 group"
          >
            <Instagram size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium uppercase tracking-widest">Instagram</span>
          </a>

          <a
            href="https://github.com/DaniDMoura"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-700/30 hover:bg-primary/20 text-neutral-300 hover:text-primary-light border border-transparent hover:border-primary/30 transition-all duration-300 group"
          >
            <Github size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium uppercase tracking-widest">GitHub</span>
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default ContactModal;
