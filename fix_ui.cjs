const fs = require('fs');

// 1. Tailwind Config
let tw = fs.readFileSync('tailwind.config.js', 'utf8');
tw = tw.replace(/'#65A30D'/, "'#4D7C0F'"); // Fix contrast for accent-wrong
if (!tw.includes('glow-active')) {
  tw = tw.replace(/tactile: '.*?',/g, "$&\n        'glow-active': '0 0 8px theme(colors.green.500)',");
}
fs.writeFileSync('tailwind.config.js', tw);

// 2. PowerDock.tsx
let pd = fs.readFileSync('src/components/ui/PowerDock.tsx', 'utf8');
pd = pd.replace(/bg-indigo-100 text-indigo-600/g, 'bg-accent-truth/10 text-accent-truth');
pd = pd.replace(/group-hover:bg-indigo-200/g, 'group-hover:bg-accent-truth/20');
pd = pd.replace(/bg-red-100 text-red-600/g, 'bg-accent-wrong/10 text-accent-wrong');
pd = pd.replace(/group-hover:bg-red-200/g, 'group-hover:bg-accent-wrong/20');
pd = pd.replace(/bg-amber-100 text-amber-600/g, 'bg-accent-dare/10 text-accent-dare');
pd = pd.replace(/group-hover:bg-amber-200/g, 'group-hover:bg-accent-dare/20');
fs.writeFileSync('src/components/ui/PowerDock.tsx', pd);

// 3. ChoiceGrid.tsx
let cg = fs.readFileSync('src/components/ui/ChoiceGrid.tsx', 'utf8');
cg = cg.replace(/bg-blue-50 border-blue-500 text-blue-900/g, 'bg-accent-consensus/10 border-accent-consensus text-accent-consensus');
cg = cg.replace(/bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/g, 'bg-surface-card border-black/10 text-black/70 hover:border-black/20 hover:bg-black/5');
fs.writeFileSync('src/components/ui/ChoiceGrid.tsx', cg);

// 4. TimerBadge.tsx
let tb = fs.readFileSync('src/components/ui/TimerBadge.tsx', 'utf8');
tb = tb.replace(/bg-red-50 border-red-500 text-red-600/g, 'bg-accent-wrong/10 border-accent-wrong text-accent-wrong');
tb = tb.replace(/bg-amber-50 border-amber-500 text-amber-600/g, 'bg-accent-dare/10 border-accent-dare text-accent-dare');
tb = tb.replace(/bg-gray-900 border-gray-900 text-white/g, 'bg-black/80 border-black/80 text-white');
fs.writeFileSync('src/components/ui/TimerBadge.tsx', tb);

// 5. PlayingCard.tsx
let pc = fs.readFileSync('src/components/ui/PlayingCard.tsx', 'utf8');
pc = pc.replace(/bg-gray-100/g, 'bg-black/5');
pc = pc.replace(/text-gray-500/g, 'text-black/60');
fs.writeFileSync('src/components/ui/PlayingCard.tsx', pc);

// 6. ControllerView.tsx
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');
cv = cv.replace(/shadow-\[0_0_8px_#22c55e\]/g, 'shadow-glow-active');
cv = cv.replace(/h-\[35%\]/g, 'shrink-0 min-h-[250px]');
cv = cv.replace(/h-\[42%\] flex items-center justify-center overflow-y-auto shrink-0 w-full p-4/g, 'flex-1 w-full flex items-center justify-center p-4 overflow-y-auto');
fs.writeFileSync('src/views/ControllerView.tsx', cv);

// 7. Landing.tsx
let ld = fs.readFileSync('src/views/Landing.tsx', 'utf8');
ld = ld.replace(/bg-slate-950/g, 'bg-deck-after-dark');
ld = ld.replace(/bg-slate-900 border-2 border-slate-700/g, 'bg-surface-card text-black border-2 border-black/10 shadow-xl');
ld = ld.replace(/text-gray-400/g, 'text-black/50');
ld = ld.replace(/bg-slate-800 text-white border-slate-700 focus:border-accent-truth/g, 'bg-black/5 text-black border-black/20 focus:border-accent-consensus focus:bg-white');
fs.writeFileSync('src/views/Landing.tsx', ld);

console.log("Fixes applied.");
