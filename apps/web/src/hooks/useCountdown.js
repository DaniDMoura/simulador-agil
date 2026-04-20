import { useState, useEffect } from "react";

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatTimeLeft = () => {
    if (!timeLeft.days && !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds) {
      return "O ENEM já começou!";
    }

    const parts = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days} dias`);
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours} horas`);
    if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes} minutos`);

    return `Faltam ${parts.join(', ')} para o ENEM 2026`;
  };

  return { timeLeft, formatTimeLeft };
};
