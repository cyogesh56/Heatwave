import React from 'react';

interface ChoiceGridProps {
  choices: string[];
  selectedChoice: string | null;
  onSelect: (choice: string) => void;
  accent?: 'wrong' | 'consensus' | 'truth' | 'dare';
}

export function ChoiceGrid({ choices, selectedChoice, onSelect, accent = 'consensus' }: ChoiceGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full font-body">
      {choices.map((choice, i) => {
        const isSelected = selectedChoice === choice;
        const baseClass = "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition-all duration-200 shadow-solid-sm font-bold text-lg leading-tight min-h-[80px]";
        
        let activeClass = "translate-y-1 shadow-none ";
        if (accent === 'wrong' || accent === 'consensus') {
           activeClass += `bg-accent-${accent}-fill border-ink-primary text-ink-dark`;
        } else {
           activeClass += `bg-accent-${accent} border-ink-primary text-white`;
        }

        const inactiveClass = "bg-surface-card border-ink-primary/20 text-ink-primary hover:border-ink-primary/50 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-accent-consensus active:translate-y-1 active:shadow-none";

        return (
          <button
            key={i}
            onClick={() => onSelect(choice)}
            className={`${baseClass} ${isSelected ? activeClass : inactiveClass}`}
          >
            {choice}
          </button>
        );
      })}
    </div>
  );
}
