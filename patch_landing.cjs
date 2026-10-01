const fs = require('fs');
let content = fs.readFileSync('src/views/Landing.tsx', 'utf8');

// Add showHelp state
content = content.replace(
  "const [isJoining, setIsJoining] = useState(false);",
  "const [isJoining, setIsJoining] = useState(false);\n  const [showHelp, setShowHelp] = useState(false);"
);

// Add the tertiary button to the hero screen
const heroButtonInjection = `
          <button 
            onClick={() => setStep('setup')}
            className="mt-6 sm:mt-8 w-full max-w-[280px] sm:max-w-sm py-4 sm:py-5 bg-accent-truth text-canvas font-display font-bold text-lg sm:text-2xl uppercase tracking-widest rounded-full shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            Enter the Fire
          </button>
          
          <button 
            onClick={() => setShowHelp(true)}
            className="mt-2 font-meta text-sm font-bold uppercase tracking-widest text-ink-primary/50 hover:text-ink-primary transition-colors underline decoration-2 underline-offset-4"
          >
            How to Play?
          </button>
`;
content = content.replace(
  /<button\s+onClick=\{\(\) => setStep\('setup'\)\}[\s\S]*?<\/button>/,
  heroButtonInjection.trim()
);

// Add the How To Play sheet at the end of the hero screen
const helpSheet = `
        {/* HOW TO PLAY SHEET */}
        <div className={\`absolute bottom-0 left-0 w-full max-h-[85vh] overflow-y-auto bg-surface-card rounded-t-[2rem] border-t-4 border-ink-primary shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 p-6 sm:p-10 flex flex-col gap-8 \${showHelp ? 'translate-y-0' : 'translate-y-[120%]'}\`}>
          <div className="w-16 h-1.5 bg-ink-primary/20 rounded-full mx-auto shrink-0 -mt-2" />
          
          <div className="flex justify-between items-center">
             <h3 className="font-display font-black uppercase tracking-widest text-3xl text-ink-primary">How to Play</h3>
             <button onClick={() => setShowHelp(false)} className="w-10 h-10 bg-ink-primary/5 rounded-full flex items-center justify-center font-display font-black text-xl text-ink-primary/50 hover:bg-ink-primary/10 transition-colors">✕</button>
          </div>
          
          <div className="flex flex-col gap-8 text-left pb-12">
             <div className="flex flex-col gap-2">
                <h4 className="font-display font-bold text-xl uppercase tracking-widest text-accent-truth">1. The Setup</h4>
                <p className="font-body text-ink-primary/80 leading-relaxed font-medium">Handsy is a couch-party game. One person hosts the room on a big screen (TV, Laptop, or Tablet). Everyone else joins on their phones to use as controllers. The TV is the center of attention.</p>
             </div>
             
             <div className="flex flex-col gap-2">
                <h4 className="font-display font-bold text-xl uppercase tracking-widest text-accent-consensus">2. Power Drops</h4>
                <p className="font-body text-ink-primary/80 leading-relaxed font-medium">Every time a new card is drawn, there is a random chance for a hidden Power to drop. Keep an eye out for loot popups on your phone!</p>
             </div>
             
             <div className="flex flex-col gap-4">
                <h4 className="font-display font-bold text-xl uppercase tracking-widest text-accent-dare">3. Using Powers</h4>
                
                <div className="bg-canvas border-2 border-ink-primary/10 rounded-2xl p-5 flex flex-col gap-1">
                   <h5 className="font-display font-black text-lg text-ink-primary">🔄 DEFLECT</h5>
                   <p className="font-body text-ink-primary/70 text-sm font-medium">Pass the heat to someone else! Replaces the target of a dare or physical challenge with another player of your choice.</p>
                </div>
                
                <div className="bg-canvas border-2 border-ink-primary/10 rounded-2xl p-5 flex flex-col gap-1">
                   <h5 className="font-display font-black text-lg text-ink-primary">🛑 KILLSWITCH</h5>
                   <p className="font-body text-ink-primary/70 text-sm font-medium">Not feeling the vibe? Nuke the current card immediately and force the game to draw a random replacement.</p>
                </div>
                
                <div className="bg-canvas border-2 border-ink-primary/10 rounded-2xl p-5 flex flex-col gap-1">
                   <h5 className="font-display font-black text-lg text-ink-primary">🔥 OVERRIDE</h5>
                   <p className="font-body text-ink-primary/70 text-sm font-medium">Take control of the room. Force the game into a completely new Phase (Spark, Deepen, Ignite, or Melt) instantly.</p>
                </div>
             </div>
          </div>
        </div>
`;

content = content.replace(
  /<\/div>\n    \);\n  }\n\n  if \(step === 'setup'\) \{/,
  helpSheet + "\n      </div>\n    );\n  }\n\n  if (step === 'setup') {"
);

fs.writeFileSync('src/views/Landing.tsx', content);
console.log('Landing.tsx patched');
