import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';

export function ThemeToggle() {
  const { hostServer, setHostGameState } = useGame();
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const theme: 'dark' | 'light' = isNight ? 'dark' : 'light';
    if (isNight) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    if (hostServer) {
      setHostGameState(prev => {
        if (!prev) return prev;
        const next = { ...prev, theme };
        hostServer.broadcast(next);
        return next;
      });
    }
  }, [isNight, hostServer]);

  return (
    <button
      onClick={() => setIsNight(!isNight)}
      className="fixed top-4 right-4 z-50 bg-surface-card border-2 border-ink-primary/20 text-ink-primary font-meta text-xs uppercase tracking-widest px-4 py-2 rounded-full shadow-solid-sm hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-ink-primary active:translate-y-0 transition-transform"
    >
      {isNight ? 'Day Party ☀️' : 'Lounge Night 🌙'}
    </button>
  );
}
