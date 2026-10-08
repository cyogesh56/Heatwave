import React from 'react';

export interface TimerBadgeProps {
  timeLeft: number; // in seconds
  totalTime?: number;
}

export const TimerBadge: React.FC<TimerBadgeProps> = ({ timeLeft, totalTime = 60 }) => {
  const isWarning = timeLeft <= totalTime * 0.25;
  const isCritical = timeLeft <= totalTime * 0.1;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`
      inline-flex items-center px-4 py-2 rounded-xl border-4 font-meta text-2xl md:text-3xl tracking-wider
      ${isCritical ? 'bg-accent-wrong/10 border-accent-wrong text-accent-wrong animate-pulse' : 
        isWarning ? 'bg-accent-dare/10 border-accent-dare text-accent-dare' : 
        'bg-ink-primary border-ink-primary text-canvas'}
    `}>
      <span className="tabular-nums font-bold">{formatTime(Math.max(0, timeLeft))}</span>
    </div>
  );
};
