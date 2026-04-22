import React from "react";

const Navbar = ({ onContactClick, onSettingsClick }) => {
  return (
    <div className="fixed w-full z-[9999] text-sm sm:text-md">
      <nav className="relative bg-bg z-[9999] flex p-2 sm:p-[10px] flex-col sm:flex-row justify-between sm:justify-around items-center space-y-2 sm:space-y-0 sm:space-x-[20px]">
        <a className="text-text text-lg sm:text-base font-medium" href="/">
                Simulador<span className="font-bold">Ágil</span>
        </a>
        <div className="flex space-x-4 sm:space-x-[20px]">
          <button
            className="text-text hover:text-primary-light transition-colors"
            onClick={onContactClick}
          >
            Contact
          </button>
          <a
            className="text-text hover:text-primary-light transition-colors"
            href="https://github.com/DaniDMoura/SimuladorAgil"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
          <button
            onClick={onSettingsClick}
            className="text-text hover:text-primary-light transition-colors"
          >
            Settings
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
