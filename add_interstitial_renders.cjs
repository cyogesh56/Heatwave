const fs = require('fs');

const hostInject = `
  if (hostGameState.uiState === 'interstitial' && hostGameState.interstitial) {
     return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-12 text-center transition-all animate-pulse">
           <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-widest mb-6">{hostGameState.interstitial.title}</h1>
           <p className="text-3xl md:text-5xl font-body opacity-90">{hostGameState.interstitial.subtitle}</p>
        </div>
     );
  }
`;

let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');
hv = hv.replace(/  const \{ card, parsedPrompt \} = hostGameState\.currentCard;/, hostInject + '\n  const { card, parsedPrompt } = hostGameState.currentCard;');
fs.writeFileSync('src/views/HostView.tsx', hv);

const clientInject = `
  if (clientState.uiState === 'interstitial' && clientState.interstitial) {
     return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-8 text-center transition-all animate-pulse">
           <h1 className="text-4xl font-display font-black uppercase tracking-widest mb-4">{clientState.interstitial.title}</h1>
           <p className="text-xl font-body opacity-90">{clientState.interstitial.subtitle}</p>
        </div>
     );
  }
`;

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');
cv = cv.replace(/  const \{ card, parsedPrompt \} = clientState\.currentCard;/, clientInject + '\n  const { card, parsedPrompt } = clientState.currentCard;');
fs.writeFileSync('src/views/ControllerView.tsx', cv);

console.log('Interstitials added');
