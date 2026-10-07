const fs = require('fs');

let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

// 1. Add PowerDock import
if (!code.includes('PowerDock')) {
  code = code.replace(
    "import { PlayingCard } from '../components/ui/PlayingCard';",
    "import { PlayingCard } from '../components/ui/PlayingCard';\nimport { PowerDock } from '../components/ui/PowerDock';"
  );
}

// 2. Add clientNode to useGame
code = code.replace(
  'const { hostServer, hostGameState, setHostGameState, gameEngine } = useGame();',
  'const { hostServer, hostGameState, setHostGameState, gameEngine, clientNode } = useGame();'
);

// 3. Add states
const stateVariables = `
  const [uiAlert, setUiAlert] = useState('');
  const [confirmEndGame, setConfirmEndGame] = useState(false);
  const [isOverrideSheetOpen, setIsOverrideSheetOpen] = useState(false);
  const [isDeflectSheetOpen, setIsDeflectSheetOpen] = useState(false);
  const [deflectTarget, setDeflectTarget] = useState<string | null>(null);
`;
code = code.replace(
  "const [uiAlert, setUiAlert] = useState('');\n  const [confirmEndGame, setConfirmEndGame] = useState(false);",
  stateVariables
);

// 4. Add handlePower
const handlePowerStr = `
  const timeLeft = useSyncTimer(hostGameState?.timers?.endsAt);
  
  const handlePower = (power: string) => {
    clientNode?.send({ type: 'power', power });
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
  };
`;
code = code.replace('const timeLeft = useSyncTimer(hostGameState?.timers?.endsAt);', handlePowerStr);

// 5. Replace bottom bar
const oldBottomBar = `
      {/* Bottom Bar: Online Players */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-surface-card/90 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-ink-primary/10 shadow-xl z-50">
        {Object.entries(hostGameState.players).map(([id, p]: any) => (
           <div key={id} className="flex items-center gap-2">
             <div className={` + "`w-3 h-3 rounded-full shadow-solid-sm ${p.isConnected !== false ? 'bg-[#10B981]' : 'bg-accent-dare'}`" + `} />
             <span className="font-meta text-sm font-bold uppercase tracking-widest text-ink-primary/70">{p.name}</span>
           </div>
        ))}
      </div>
`;

const newBottomBar = `
      {/* Bottom Bar: Online Players OR Power Dock */}
      {clientNode ? (
        <div className="fixed bottom-0 left-0 w-full z-[100]">
          <PowerDock 
            onDeflect={() => setIsDeflectSheetOpen(true)}
            onKillswitch={() => handlePower('killswitch')}
            onOverride={() => setIsOverrideSheetOpen(true)}
            inventory={hostGameState?.players?.[clientNode?.['playerId'] || '']?.inventory || { deflect: 0, killswitch: 0, override: 0 }}
          />
        </div>
      ) : (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-surface-card/90 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-ink-primary/10 shadow-xl z-50">
          {Object.entries(hostGameState.players).map(([id, p]: any) => (
             <div key={id} className="flex items-center gap-2">
               <div className={\`w-3 h-3 rounded-full shadow-solid-sm \${p.isConnected !== false ? 'bg-[#10B981]' : 'bg-accent-dare'}\`} />
               <span className="font-meta text-sm font-bold uppercase tracking-widest text-ink-primary/70">{p.name}</span>
             </div>
          ))}
        </div>
      )}

      {/* Deflect Sheet */}
      <div className={\`fixed bottom-0 left-0 w-full bg-surface-card rounded-t-[2rem] border-t-4 border-ink-primary shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-[9999] p-8 flex flex-col gap-6 \${isDeflectSheetOpen ? 'translate-y-0' : 'translate-y-[120%]'}\`}>
        <div className="w-16 h-1.5 bg-ink-primary/20 rounded-full mx-auto" />
        <h3 className="text-center font-display font-black uppercase tracking-widest text-2xl text-ink-primary">Deflect to...</h3>
        <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
          {Object.entries(hostGameState?.players || {}).filter(([id]) => id !== clientNode?.['playerId']).map(([id, p]: any) => (
             <button 
               key={id}
               onClick={() => setDeflectTarget(id)} 
               className={\`py-4 px-6 rounded-2xl border-4 \${deflectTarget === id ? 'border-accent-dare bg-accent-dare/10 text-accent-dare' : 'border-ink-primary/20 bg-canvas text-ink-primary'} font-display font-bold uppercase tracking-widest text-left shadow-sm transition-all\`}
             >
               {p.name}
             </button>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
           <button onClick={() => { setIsDeflectSheetOpen(false); setDeflectTarget(null); }} className="flex-1 py-4 border-4 border-ink-primary/20 rounded-2xl font-display font-bold uppercase tracking-widest text-ink-primary/50 hover:bg-ink-primary/5">Cancel</button>
           <button 
             disabled={!deflectTarget}
             onClick={() => { clientNode?.send({ type: 'power', power: 'deflect', targetId: deflectTarget }); setIsDeflectSheetOpen(false); setDeflectTarget(null); }} 
             className="flex-1 py-4 rounded-2xl border-4 border-accent-dare bg-accent-dare text-canvas font-display font-black uppercase tracking-widest disabled:opacity-50"
           >
             Deflect
           </button>
        </div>
      </div>

      {/* Override Sheet */}
      <div className={\`fixed bottom-0 left-0 w-full bg-surface-card rounded-t-[2rem] border-t-4 border-ink-primary shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-[9999] p-8 flex flex-col gap-6 \${isOverrideSheetOpen ? 'translate-y-0' : 'translate-y-[120%]'}\`}>
        <div className="w-16 h-1.5 bg-ink-primary/20 rounded-full mx-auto" />
        <h3 className="text-center font-display font-black uppercase tracking-widest text-2xl text-ink-primary">Force Override</h3>
        <p className="text-center font-body text-ink-primary/60 -mt-4">Where are we going?</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => { handlePower('override_1'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-2xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-[2px] active:shadow-none">Spark</button>
          <button onClick={() => { handlePower('override_2'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-2xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-[2px] active:shadow-none">Deepen</button>
          <button onClick={() => { handlePower('override_3'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-2xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-[2px] active:shadow-none">Ignite</button>
          <button onClick={() => { handlePower('override_4'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-2xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-[2px] active:shadow-none">Melt</button>
        </div>
        <button onClick={() => setIsOverrideSheetOpen(false)} className="mt-2 py-4 border-4 border-ink-primary/20 rounded-2xl font-display font-bold uppercase tracking-widest text-ink-primary/50 hover:bg-ink-primary/5">Cancel</button>
      </div>
`;

code = code.replace(oldBottomBar, newBottomBar);

fs.writeFileSync('src/views/HostView.tsx', code);
