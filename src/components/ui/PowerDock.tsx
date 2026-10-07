import React from 'react';
import { IconDeflect, IconKillswitch, IconOverride } from '../icons';

interface PowerDockProps {
  onDeflect: () => void;
  onKillswitch: () => void;
  onOverride: () => void;
  inventory?: {
    deflect: number;
    killswitch: number;
    override: number;
  };
}

export function PowerDock({ onDeflect, onKillswitch, onOverride, inventory = { deflect: 0, killswitch: 0, override: 0 } }: PowerDockProps) {
  const renderBadge = (label: string, count: number) => {
    return (
      <div className="mt-2 font-meta text-xs uppercase tracking-widest font-bold text-ink-primary bg-ink-primary/5 px-2 py-0.5 rounded-sm border border-ink-primary/10">
        {label} [{count}]
      </div>
    );
  };

  const btnShape = "relative w-14 h-14 bg-surface-card border-2 border-ink-primary/20 flex items-center justify-center transition-colors shadow-solid-sm active:translate-y-[2px] active:shadow-none rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm";

  return (
    <div className="sticky bottom-0 left-0 w-full backdrop-blur-md bg-canvas/80 border-t-2 border-ink-primary/10 p-4 pb-safe flex items-center justify-around z-50">
      
      <button 
        onClick={onDeflect}
        disabled={inventory.deflect <= 0}
        className="flex flex-col items-center group disabled:opacity-40 disabled:pointer-events-none transition-all focus:outline-none focus:scale-105"
      >
        <div className={`${btnShape} group-hover:border-accent-truth group-hover:bg-accent-truth/10 text-accent-truth`}>
          <IconDeflect className="w-6 h-6" />
        </div>
        {renderBadge('Deflect', inventory.deflect)}
      </button>

      <button 
        onClick={onKillswitch}
        disabled={inventory.killswitch <= 0}
        className="flex flex-col items-center group disabled:opacity-40 disabled:pointer-events-none transition-all focus:outline-none focus:scale-105"
      >
        <div className={`${btnShape} group-hover:border-accent-wrong-stroke group-hover:bg-accent-wrong-stroke/10 text-accent-wrong-stroke`}>
          <IconKillswitch className="w-7 h-7" />
        </div>
        {renderBadge('Kill', inventory.killswitch)}
      </button>

      <button 
        onClick={onOverride}
        disabled={inventory.override <= 0}
        className="flex flex-col items-center group disabled:opacity-40 disabled:pointer-events-none transition-all focus:outline-none focus:scale-105"
      >
        <div className={`${btnShape} group-hover:border-accent-dare group-hover:bg-accent-dare/10 text-accent-dare`}>
          <IconOverride className="w-6 h-6" />
        </div>
        {renderBadge('Override', inventory.override)}
      </button>

    </div>
  );
}
