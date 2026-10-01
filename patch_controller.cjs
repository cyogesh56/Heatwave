const fs = require('fs');
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

// Add deflect sheet state
cv = cv.replace(
  "  const [isOverrideSheetOpen, setIsOverrideSheetOpen] = useState(false);",
  "  const [isOverrideSheetOpen, setIsOverrideSheetOpen] = useState(false);\n  const [isDeflectSheetOpen, setIsDeflectSheetOpen] = useState(false);\n  const [deflectTarget, setDeflectTarget] = useState<string | null>(null);"
);

// Update handlePower mapping in PowerDock props
cv = cv.replace(
  "onDeflect={() => handlePower('deflect')}",
  "onDeflect={() => setIsDeflectSheetOpen(true)}"
);

// Add Deflect Sheet UI
const deflectSheet = `
      {/* DEFLECT SHEET */}
      <div className={\`absolute bottom-0 left-0 w-full bg-surface-card rounded-t-[2rem] border-t-4 border-ink-primary shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 p-8 flex flex-col gap-6 \${isDeflectSheetOpen ? 'translate-y-0' : 'translate-y-[120%]'}\`}>
        <div className="w-16 h-1.5 bg-ink-primary/20 rounded-full mx-auto" />
        <h3 className="text-center font-display font-black uppercase tracking-widest text-2xl text-ink-primary">Deflect to...</h3>
        <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
          {Object.entries(clientState?.players || {}).filter(([id]) => id !== clientNode?.['playerId']).map(([id, p]: any) => (
             <button 
               key={id}
               onClick={() => setDeflectTarget(id)} 
               className={\`py-4 px-6 rounded-xl border-4 \${deflectTarget === id ? 'border-accent-dare bg-accent-dare/10 text-accent-dare' : 'border-ink-primary/20 bg-canvas text-ink-primary'} font-display font-bold uppercase tracking-widest text-left shadow-sm transition-all\`}
             >
               {p.name}
             </button>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
           <button onClick={() => { setIsDeflectSheetOpen(false); setDeflectTarget(null); }} className="flex-1 py-4 border-4 border-ink-primary/20 rounded-xl font-display font-bold uppercase tracking-widest text-ink-primary/50 hover:bg-ink-primary/5">Cancel</button>
           <button 
             disabled={!deflectTarget}
             onClick={() => { clientNode?.send({ type: 'power', power: 'deflect', targetId: deflectTarget }); setIsDeflectSheetOpen(false); setDeflectTarget(null); }} 
             className="flex-1 py-4 rounded-xl border-4 border-accent-dare bg-accent-dare text-canvas font-display font-black uppercase tracking-widest disabled:opacity-50"
           >
             Deflect!
           </button>
        </div>
      </div>
`;

cv = cv.replace(
  /\{\/\* OVERRIDE SHEET \*\/\}/,
  deflectSheet + "\n      {/* OVERRIDE SHEET */}"
);

fs.writeFileSync('src/views/ControllerView.tsx', cv);
console.log('ControllerView patched');
