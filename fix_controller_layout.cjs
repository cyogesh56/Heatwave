const fs = require('fs');

const cvCode = `import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { IconZap } from '../components/icons';
import { ChoiceGrid } from '../components/ui/ChoiceGrid';
import { PowerDock } from '../components/ui/PowerDock';

export const ControllerView: React.FC = () => {
  const { clientState, clientNode } = useGame();
  const [isOverrideSheetOpen, setIsOverrideSheetOpen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  if (!clientState || !clientState.currentCard) {
    return (
      <div className="min-h-screen bg-canvas text-ink-primary flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-5"></div>
        <div className="w-16 h-16 bg-surface-card rounded-2xl shadow-solid flex items-center justify-center border-4 border-ink-primary animate-bounce mb-8">
          <IconZap className="w-8 h-8 text-accent-truth" />
        </div>
        <h1 className="text-4xl font-display font-black uppercase tracking-widest">You're In.</h1>
        <p className="font-meta text-ink-primary/50 mt-4 text-sm uppercase tracking-widest font-bold">Look at the big screen.</p>
      </div>
    );
  }

  const { card, parsedPrompt } = clientState.currentCard;
  const questionType = card.type === 'kahoot' ? 'wrong' : card.type;

  const handleVote = (choice: string) => {
    setSelectedChoice(choice);
    clientNode?.send({ type: 'vote', choice });
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handlePower = (power: string) => {
    clientNode?.send({ type: 'power', power });
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
  };

  return (
    <div className="relative w-full h-screen bg-canvas flex flex-col overflow-hidden text-ink-primary font-sans">
      
      {/* HEADER */}
      <header className="h-[8%] flex items-center justify-between px-6 border-b-4 border-ink-primary/10 shrink-0 bg-surface-card z-10">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-ink-primary bg-[#00CDE5] shadow-solid-sm" />
          <span className="font-display font-bold text-xl uppercase tracking-widest">{clientNode?.['playerName'] || 'Player'}</span>
        </div>
      </header>

      {/* CONTEXT AREA (No more broken card, just clear text) */}
      <section className="shrink-0 pt-8 pb-4 px-6 flex flex-col items-center justify-center text-center gap-3 relative z-0">
        <span className="font-meta font-bold text-xs uppercase tracking-[0.3em] text-ink-primary/40">Active Prompt</span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-ink-primary leading-tight max-w-2xl">
          {parsedPrompt}
        </h2>
      </section>

      {/* ACTION ZONE (Massive target, clear hierarchy) */}
      <section className="flex-1 w-full max-w-xl mx-auto flex flex-col items-center justify-center p-6 gap-6 relative z-0">
        {questionType === 'wrong' || questionType === 'consensus' ? (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex items-center gap-4">
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
              <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Cast Your Vote</span>
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
            </div>
            <ChoiceGrid 
              choices={card.options || ['A', 'B', 'C', 'D']} 
              selectedChoice={selectedChoice}
              onSelect={handleVote}
              accent={questionType}
            />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex items-center gap-4">
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
              <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Your Turn</span>
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
            </div>
            <button 
              onClick={() => handleVote('done')}
              className="w-full py-8 rounded-2xl bg-accent-truth border-4 border-ink-primary text-white font-display font-black text-3xl uppercase tracking-widest shadow-solid active:translate-y-1 active:shadow-none transition-all"
            >
              {selectedChoice ? 'WAITING...' : 'I DID IT'}
            </button>
          </div>
        )}
      </section>

      {/* POWER DOCK */}
      <section className="shrink-0 relative z-50">
        <PowerDock 
          onDeflect={() => handlePower('deflect')}
          onKillswitch={() => handlePower('killswitch')}
          onOverride={() => setIsOverrideSheetOpen(true)}
          inventory={clientState?.players?.[clientNode?.['playerId'] || '']?.inventory || { deflect: 0, killswitch: 0, override: 0 }}
        />
      </section>

      {/* OVERRIDE SHEET */}
      <div className={\`absolute bottom-0 left-0 w-full bg-surface-card rounded-t-[2rem] border-t-4 border-ink-primary shadow-[0_-20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 p-8 flex flex-col gap-6 \${isOverrideSheetOpen ? 'translate-y-0' : 'translate-y-[120%]'}\`}>
        <div className="w-16 h-1.5 bg-ink-primary/20 rounded-full mx-auto" />
        <h3 className="text-center font-display font-black uppercase tracking-widest text-2xl text-ink-primary">Force Override</h3>
        <p className="text-center font-body text-ink-primary/60 -mt-4">Where are we going?</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => { handlePower('override_1'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-0.5 active:shadow-none">Spark</button>
          <button onClick={() => { handlePower('override_2'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-0.5 active:shadow-none">Deepen</button>
          <button onClick={() => { handlePower('override_3'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-0.5 active:shadow-none">Ignite</button>
          <button onClick={() => { handlePower('override_4'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-0.5 active:shadow-none">Melt</button>
        </div>
        <button onClick={() => setIsOverrideSheetOpen(false)} className="mt-2 py-4 border-4 border-ink-primary/20 rounded-xl font-display font-bold uppercase tracking-widest text-ink-primary/50 hover:bg-ink-primary/5">Cancel</button>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/views/ControllerView.tsx', cvCode);
