import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string | Date;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = null;

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else if (onComplete) {
        onComplete();
      }

      setTimeLeft(timeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        LIVE NOW
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-lg bg-slate-50/80 border border-slate-100 p-1 px-2">
        <Timer className="h-3 w-3 text-blue-500" />
        <div className="flex items-center gap-1 font-mono text-[11px]">
          {timeLeft.days > 0 && (
            <div className="flex items-center">
              <span className="font-bold text-slate-700">{timeLeft.days}</span>
              <span className="ml-0.5 text-[9px] text-slate-400 uppercase">d</span>
              <span className="mx-1 text-slate-300">:</span>
            </div>
          )}
          <div className="flex items-center">
            <span className="font-bold text-slate-700">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="ml-0.5 text-[9px] text-slate-400 uppercase">h</span>
            <span className="mx-1 text-slate-300">:</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-slate-700">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="ml-0.5 text-[9px] text-slate-400 uppercase">m</span>
            <span className="mx-1 text-slate-300">:</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-blue-600">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="ml-0.5 text-[9px] text-blue-400 uppercase">s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
