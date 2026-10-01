const fs = require('fs');

function replaceInFile(filepath, replacements) {
    let content = fs.readFileSync(filepath, 'utf8');
    for (const [regex, replacement] of replacements) {
        content = content.replace(regex, replacement);
    }
    fs.writeFileSync(filepath, content);
}

// 1. Landing.tsx
replaceInFile('src/views/Landing.tsx', [
    [/text-black/g, 'text-ink-primary'],
    [/bg-black\/5/g, 'bg-ink-primary/5'],
    [/border-black\/5/g, 'border-ink-primary/5'],
    [/border-black\/10/g, 'border-ink-primary/10'],
    [/bg-white\/50/g, 'bg-surface-card/50'],
    [/bg-white/g, 'bg-surface-card'],
]);

// 2. LobbyView.tsx
replaceInFile('src/views/LobbyView.tsx', [
    [/text-black/g, 'text-ink-primary'],
    [/bg-black\/5/g, 'bg-ink-primary/5'],
    [/bg-black\/10/g, 'bg-ink-primary/10'],
    [/border-black\/5/g, 'border-ink-primary/5'],
    [/border-black\/10/g, 'border-ink-primary/10'],
    [/bg-white\/50/g, 'bg-surface-card/50'],
    [/bg-white/g, 'bg-surface-card'],
    [/text-white bg-black/g, 'text-ink-primary bg-canvas'],
]);

// 3. ControllerView.tsx
replaceInFile('src/views/ControllerView.tsx', [
    [/text-black/g, 'text-ink-primary'],
    [/border-white\/20/g, 'border-ink-primary/20'],
    [/text-white\/70/g, 'text-ink-primary/70'],
    [/bg-white\/5/g, 'bg-surface-card/50'], // for docked area
]);

// 4. HostView.tsx
replaceInFile('src/views/HostView.tsx', [
    [/text-white/g, 'text-ink-primary'], // mostly header text
    [/border-white\/10/g, 'border-ink-primary/10'],
    [/border-white\/20/g, 'border-ink-primary/20'],
    [/border-white\/30/g, 'border-ink-primary/30'],
    [/border-white\/5/g, 'border-ink-primary/5'],
    [/bg-black\/20/g, 'bg-ink-primary/5'],
    [/bg-black\/30/g, 'bg-ink-primary/5'],
    [/bg-black\/40/g, 'bg-ink-primary/10'],
    [/bg-white\/10/g, 'bg-ink-primary/5'],
    [/bg-white\/15/g, 'bg-ink-primary/10'],
    [/bg-white\/20/g, 'bg-ink-primary/15'],
    [/hover:bg-white/g, 'hover:bg-ink-primary hover:text-canvas'],
    [/text-white\/90/g, 'text-ink-primary/90'],
    [/bg-black text-white/g, 'bg-canvas text-ink-primary'],
    // Ensure the Alert box text stays white if background is dark, or just use ink
    // The alert box is bg-black/60, changed to bg-ink-primary/80
    [/bg-black\/60/g, 'bg-ink-primary/90'],
    [/bg-black\/50/g, 'bg-ink-primary/90'],
    [/text-ink-primary flex items-center/g, 'text-canvas flex items-center'], // For alert box text which we just over-replaced
]);

console.log("Color fixes applied.");
