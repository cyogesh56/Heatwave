const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

const replacement = `if (clientState?.uiState === 'ended') {
    return (
      <div className="min-h-[100dvh] bg-canvas text-ink-primary flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-display font-black text-accent-dare mb-4 uppercase">Game Over</h1>
        <p className="font-body text-ink-primary/70 mb-8">The host has ended the game.</p>
        <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-surface-card border-4 border-ink-primary/20 text-ink-primary font-display font-black text-xl uppercase tracking-widest rounded-3xl shadow-solid active:translate-y-1 transition-all">
          Home
        </button>
      </div>
    );
  }

  if (clientState?.uiState === 'disconnected') {`;

code = code.replace("if (clientState?.uiState === 'disconnected') {", replacement);

fs.writeFileSync('src/views/ControllerView.tsx', code);
