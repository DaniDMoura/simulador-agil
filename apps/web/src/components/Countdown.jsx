import React from "react";
import { useCountdown } from "../hooks/useCountdown";
import { TARGET_DATE } from "../constants/appConstants";

const Countdown = () => {
  const { formatTimeLeft } = useCountdown(TARGET_DATE);

  return (
    <div className="fixed top-[95vh] right-[0.5vw] max-2xl:top-[93vh] bg-stone-800/90 backdrop-blur-sm text-stone-100 px-4 py-2 rounded-lg z-50 border border-stone-700 font-ui">
      <div className="text-sm max-sm:text-[10px] font-medium">
        {formatTimeLeft()}
      </div>
    </div>
  );
};

export default Countdown;
