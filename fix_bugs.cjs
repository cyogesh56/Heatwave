const fs = require('fs');

// Fix ControllerView.tsx
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');
const currentCardRegex = /const \{ card, parsedPrompt \} = clientState\.currentCard;/;
const waitingRender = `if (!clientState.currentCard) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-canvas text-ink-primary p-8 text-center">
        <h1 className="text-4xl font-display font-black uppercase tracking-widest mb-4 animate-pulse">Waiting for Host...</h1>
        <p className="font-body opacity-70">Look at the TV screen.</p>
      </div>
    );
  }
  
  const { card, parsedPrompt } = clientState.currentCard;`;
cv = cv.replace(currentCardRegex, waitingRender);
fs.writeFileSync('src/views/ControllerView.tsx', cv);

// Fix HostView.tsx player dot color
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf-8');
// The line is: <div className={`w-3 h-3 rounded-full shadow-solid-sm ${p.isConnected !== false ? 'bg-accent-wrong' : 'bg-accent-dare'}`} />
hv = hv.replace(
  /className=\{\`w-3 h-3 rounded-full shadow-solid-sm \$\{p\.isConnected !== false \? 'bg-accent-wrong' : 'bg-accent-dare'\}\`\} \/>/g,
  `className={\`w-3 h-3 rounded-full shadow-solid-sm \${p.isConnected !== false ? 'bg-[#10B981]' : 'bg-accent-dare'}\`} />`
);
fs.writeFileSync('src/views/HostView.tsx', hv);

