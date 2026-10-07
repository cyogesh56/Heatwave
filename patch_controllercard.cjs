const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

if (!code.includes('import { PlayingCard }')) {
  code = code.replace(
    "import { UniversalHeader } from '../components/ui/UniversalHeader';",
    "import { UniversalHeader } from '../components/ui/UniversalHeader';\nimport { PlayingCard } from '../components/ui/PlayingCard';"
  );
}

const contextAreaOld = `      {/* CONTEXT AREA */}
      <section className="shrink-0 pt-8 pb-4 px-6 flex flex-col items-center justify-center text-center gap-3 relative z-0">
        <span className="font-meta font-bold text-xs uppercase tracking-[0.3em] text-ink-primary/40">
          {(() => {
             if (questionType === 'dare') {
               const targets = clientState?.currentCard?.targetedPlayers || [];
               if (targets.includes(clientNode?.['playerName'])) return 'Your Challenge';
               if (targets.length > 0) return \`\${targets.join(' & ')}'s Challenge\`;
               return 'Physical Challenge';
             }
             if (questionType === 'kahoot' || questionType === 'wrong_answers' || questionType === 'wrong' || questionType === 'fill_blank') return 'Trivia & Chaos';
             if (questionType === 'consensus') return 'Consensus Check';
             if (questionType === 'vibe_poll') return 'Vibe Poll';
             return 'Room Discussion';
          })()}
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-ink-primary leading-tight max-w-2xl">
          {parsedPrompt}
        </h2>
      </section>`;

const contextAreaNew = `      {/* CONTEXT AREA */}
      <section className="shrink-0 pt-4 pb-2 px-6 flex flex-col items-center justify-center relative z-0 h-[35vh] sm:h-[40vh] max-h-[400px] w-full max-w-xl mx-auto">
        <PlayingCard prompt={parsedPrompt} type={card.type} index={clientState?.phase || 1} />
      </section>`;

code = code.replace(contextAreaOld, contextAreaNew);

fs.writeFileSync('src/views/ControllerView.tsx', code);
