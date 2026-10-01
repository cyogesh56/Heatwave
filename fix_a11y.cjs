const fs = require('fs');

function replaceInFile(filepath, replacements) {
    let content = fs.readFileSync(filepath, 'utf8');
    for (const [regex, replacement] of replacements) {
        content = content.replace(regex, replacement);
    }
    fs.writeFileSync(filepath, content);
}

// 1. ControllerView.tsx
replaceInFile('src/views/ControllerView.tsx', [
    [/text-white font-display/g, 'text-canvas font-display'],
    [/bg-\[\#00CDE5\]/g, 'bg-accent-consensus-fill'],
    [/shadow-\[0_-20px_50px_rgba\(0,0,0,0.5\)\]/g, 'shadow-2xl']
]);

// 2. Landing.tsx
replaceInFile('src/views/Landing.tsx', [
    [/text-white font-display/g, 'text-canvas font-display'],
    [/shadow-\[0_10px_40px_rgba\(79,70,229,0.4\)\]/g, 'shadow-2xl'],
    [/hover:shadow-\[0_15px_50px_rgba\(79,70,229,0.6\)\]/g, 'hover:shadow-3xl'],
    [
        /className="flex-1 bg-surface-card border-\[3\.5px\] border-accent-truth rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center cursor-pointer shadow-tactile hover:-translate-y-2 transition-transform group"/g,
        'className="flex-1 bg-surface-card border-[3.5px] border-accent-truth rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center cursor-pointer shadow-tactile hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-accent-truth transition-transform group" as="button" tabIndex={0} role="button"'
    ],
    [
        /className="flex-1 bg-surface-card border-\[3\.5px\] border-accent-consensus rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center cursor-pointer shadow-tactile hover:-translate-y-2 transition-transform group"/g,
        'className="flex-1 bg-surface-card border-[3.5px] border-accent-consensus rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center cursor-pointer shadow-tactile hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-accent-consensus transition-transform group" as="button" tabIndex={0} role="button"'
    ]
]);

// 3. LobbyView.tsx
replaceInFile('src/views/LobbyView.tsx', [
    [/text-white font-display/g, 'text-canvas font-display'],
    [/text-\[\#1C1024\]\/80/g, 'text-ink-dark/80'],
    [/text-\[\#1C1024\]/g, 'text-ink-dark'],
    [/text-\[\#00CDE5\]/g, 'text-accent-consensus-fill'],
    [/shadow-\[0_8px_30px_rgba\(104,24,214,0.3\)\]/g, 'shadow-2xl'],
    [
        /className={\`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 shadow-solid-sm hover:-translate-y-0.5 \${isSelected \? 'bg-accent-consensus-fill border-ink-primary text-ink-dark' : 'bg-surface-card border-ink-primary\/20 text-ink-primary'}\`}/g,
        'className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 shadow-solid-sm hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-accent-consensus ${isSelected ? "bg-accent-consensus-fill border-ink-primary text-ink-dark" : "bg-surface-card border-ink-primary/20 text-ink-primary"}`} role="checkbox" aria-checked={isSelected} tabIndex={0}'
    ]
]);

// 4. HostView.tsx
replaceInFile('src/views/HostView.tsx', [
    [/shadow-\[0_0_50px_rgba\(234,88,12,0.5\)\]/g, 'shadow-2xl'],
    [/shadow-\[0_0_50px_rgba\(255,255,255,0.1\)\]/g, 'shadow-2xl']
]);

// 5. ChoiceGrid.tsx
replaceInFile('src/components/ui/ChoiceGrid.tsx', [
    [/text-\[\#1C1024\]/g, 'text-ink-dark'],
    [/text-white/g, 'text-canvas'],
    [/hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"/g, 'hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-accent-consensus active:translate-y-1 active:shadow-none"']
]);

// 6. PowerDock.tsx
replaceInFile('src/components/ui/PowerDock.tsx', [
    [/text-\[10px\]/g, 'text-xs'],
    [/className="flex flex-col items-center group disabled:opacity-40 disabled:pointer-events-none transition-all"/g, 'className="flex flex-col items-center group disabled:opacity-40 disabled:pointer-events-none transition-all focus:outline-none focus:scale-105"']
]);

// 7. ThemeToggle.tsx
replaceInFile('src/components/ui/ThemeToggle.tsx', [
    [/hover:-translate-y-0.5 active:translate-y-0 transition-transform"/g, 'hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-ink-primary active:translate-y-0 transition-transform"']
]);

// 8. Tailwind Config
let tailwind = fs.readFileSync('tailwind.config.js', 'utf8');
tailwind = tailwind.replace(
    /'ink-muted': 'var\(--ink-muted\)',/,
    `'ink-muted': 'var(--ink-muted)',\n        'ink-dark': '#1C1024',`
);
fs.writeFileSync('tailwind.config.js', tailwind);

console.log("A11y fixes complete.");
