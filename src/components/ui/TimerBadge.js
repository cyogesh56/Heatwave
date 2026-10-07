import { jsx as _jsx } from "react/jsx-runtime";
export const TimerBadge = ({ timeLeft, totalTime = 60 }) => {
    const isWarning = timeLeft <= totalTime * 0.25;
    const isCritical = timeLeft <= totalTime * 0.1;
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };
    return (_jsx("div", { className: `
      inline-flex items-center px-3 py-1.5 rounded-lg border-2 font-meta text-lg tracking-wider
      ${isCritical ? 'bg-accent-wrong/10 border-accent-wrong text-accent-wrong animate-pulse' :
            isWarning ? 'bg-accent-dare/10 border-accent-dare text-accent-dare' :
                'bg-ink-primary border-ink-primary text-canvas'}
    `, children: _jsx("span", { className: "tabular-nums font-bold", children: formatTime(Math.max(0, timeLeft)) }) }));
};
