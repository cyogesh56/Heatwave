const fs = require('fs');

let cg = fs.readFileSync('src/components/ui/ChoiceGrid.tsx', 'utf-8');
cg = cg.replace(/translate-y-1 shadow-none/g, 'translate-y-[2px] shadow-none');
cg = cg.replace(/active:translate-y-1 active:shadow-none/g, 'active:translate-y-[2px] active:shadow-none');
fs.writeFileSync('src/components/ui/ChoiceGrid.tsx', cg);

let pd = fs.readFileSync('src/components/ui/PowerDock.tsx', 'utf-8');
pd = pd.replace(
  'const btnShape = "relative w-14 h-14 bg-surface-card border-2 border-ink-primary/20 flex items-center justify-center transition-colors shadow-solid-sm rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm";',
  'const btnShape = "relative w-14 h-14 bg-surface-card border-2 border-ink-primary/20 flex items-center justify-center transition-colors shadow-solid-sm active:translate-y-[2px] active:shadow-none rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm";'
);
fs.writeFileSync('src/components/ui/PowerDock.tsx', pd);

let tt = fs.readFileSync('src/components/ui/ThemeToggle.tsx', 'utf-8');
tt = tt.replace(
  'shadow-solid-sm hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-ink-primary active:translate-y-0 transition-transform',
  'shadow-solid-sm hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-ink-primary active:translate-y-[2px] active:shadow-none transition-transform'
);
fs.writeFileSync('src/components/ui/ThemeToggle.tsx', tt);

let gp = fs.readFileSync('src/components/ui/GamePopup.tsx', 'utf-8');
gp = gp.replace(
  'shadow-solid active:translate-y-1',
  'shadow-solid active:translate-y-[4px] active:shadow-none'
);
fs.writeFileSync('src/components/ui/GamePopup.tsx', gp);
