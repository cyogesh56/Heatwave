const fs = require('fs');
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

// Request 4: Top header phase indicator
cv = cv.replace(
  '<span className="font-display font-bold text-xl uppercase tracking-widest">{clientNode?\.[\'playerName\'] || \'Player\'}</span>\n        </div>\n      </header>',
  `<span className="font-display font-bold text-xl uppercase tracking-widest">{clientNode?.['playerName'] || 'Player'}</span>
        </div>
        <div className="font-meta font-bold text-sm tracking-widest uppercase text-ink-primary/50">
          Phase {clientState?.phase || 1}
        </div>
      </header>`
);

// Request 1: Dynamic "Active Prompt" header
// Instead of hardcoding 'Active Prompt', we calculate the text dynamically based on targetedPlayers and clientNode.playerName
const activePromptBlock = `
      {/* CONTEXT AREA */}
      <section className="shrink-0 pt-8 pb-4 px-6 flex flex-col items-center justify-center text-center gap-3 relative z-0">
        <span className="font-meta font-bold text-xs uppercase tracking-[0.3em] text-ink-primary/40">
          {(() => {
             if (questionType === 'dare') {
               const targets = clientState?.currentCard?.targetedPlayers || [];
               if (targets.includes(clientNode?.['playerName'])) return 'Your Challenge';
               if (targets.length > 0) return \`\${targets.join(' & ')}'s Challenge\`;
               return 'Physical Challenge';
             }
             if (questionType === 'kahoot' || questionType === 'wrong_answers' || questionType === 'wrong') return 'Trivia & Chaos';
             if (questionType === 'consensus') return 'Consensus Check';
             if (questionType === 'vibe_poll') return 'Vibe Poll';
             return 'Room Discussion';
          })()}
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-ink-primary leading-tight max-w-2xl">
          {parsedPrompt}
        </h2>
      </section>
`;

// Replace the old context area
cv = cv.replace(
  /\{\/\* CONTEXT AREA [^]*?<\/section>/,
  activePromptBlock.trim()
);

// Request 2: Change "Your Challenge" / "Room Discussion" label above the "done" button to "ACTIVITY COMPLETED?"
cv = cv.replace(
  /<span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary\/40">Your Challenge<\/span>/,
  '<span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Activity completed?</span>'
);
cv = cv.replace(
  /<span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary\/40">Room Discussion<\/span>/,
  '<span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Activity completed?</span>'
);

fs.writeFileSync('src/views/ControllerView.tsx', cv);
console.log('ControllerView updated');
