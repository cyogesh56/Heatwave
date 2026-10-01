import React from 'react';
import { IconZap, IconFlame, IconScale, IconEye } from '../icons';

interface PlayingCardProps {
  prompt: string;
  type: 'wrong' | 'consensus' | 'truth' | 'dare' | 'kahoot' | 'wrong_answers' | 'fill_blank' | 'vibe_poll';
  index: number;
}

const TYPE_CONFIG = {
  wrong: { border: 'border-accent-wrong-stroke', text: 'text-accent-wrong-stroke', Icon: IconZap },
  wrong_answers: { border: 'border-accent-wrong-stroke', text: 'text-accent-wrong-stroke', Icon: IconZap },
  kahoot: { border: 'border-accent-wrong-stroke', text: 'text-accent-wrong-stroke', Icon: IconZap },
  consensus: { border: 'border-accent-consensus-stroke', text: 'text-accent-consensus-stroke', Icon: IconScale },
  truth: { border: 'border-accent-truth', text: 'text-accent-truth', Icon: IconEye },
  dare: { border: 'border-accent-dare', text: 'text-accent-dare', Icon: IconFlame },
};

export function PlayingCard({ prompt, type, index }: PlayingCardProps) {
  const normalizedType = type === 'kahoot' || type === 'wrong_answers' || type === 'fill_blank' ? 'wrong' : type === 'vibe_poll' ? 'consensus' : type;
  const config = TYPE_CONFIG[normalizedType] || TYPE_CONFIG.truth;
  const { border, text, Icon } = config;

  return (
    <div className="w-full h-full bg-surface-card rounded-3xl shadow-solid p-2.5 relative flex flex-col transition-colors duration-500">
      <div className={`relative w-full h-full border-[4px] ${border} rounded-none flex flex-col items-center justify-center p-4 transition-colors duration-500`}>
        
        {/* Top Left Emblem */}
        <div className={`absolute -top-3.5 -left-3.5 w-7 h-7 rounded-full bg-surface-card border-2 ${border} flex items-center justify-center transition-colors duration-500 z-10`}>
          {Icon && <Icon className={`w-4 h-4 ${text}`} />}
        </div>
        
        {/* Phase Pill */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-ink-primary/5 rounded-full font-meta text-xs uppercase tracking-wider text-ink-primary/70">
          Phase {index}
        </div>
        
        {/* Prompt */}
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-ink-primary max-w-[90%] tracking-tight">
          {prompt}
        </h2>

        {/* Bottom Right Emblem */}
        <div className={`absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-surface-card border-2 ${border} flex items-center justify-center transition-colors duration-500 z-10`}>
          {Icon && <Icon className={`w-4 h-4 ${text}`} />}
        </div>
      </div>
    </div>
  );
}
