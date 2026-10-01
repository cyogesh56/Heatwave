const fs = require('fs');

const overlayHost = `
  const connectedPlayers = Object.values(hostGameState.players).filter((p: any) => p.isConnected !== false);
  const disconnectedPlayers = Object.values(hostGameState.players).filter((p: any) => p.isConnected === false);
  
  if (connectedPlayers.length < 2 && disconnectedPlayers.length > 0) {
     return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-12 text-center">
           <h1 className="text-6xl font-display font-black uppercase tracking-widest mb-6">Game Paused</h1>
           <p className="text-3xl font-body opacity-90 mb-12">
              {disconnectedPlayers.map((p: any) => p.name).join(', ')} disconnected.<br/>Waiting for them to reconnect...
           </p>
           <button onClick={() => window.location.href = '/'} className="px-12 py-6 bg-canvas text-accent-dare font-display font-black text-2xl uppercase tracking-widest rounded-3xl shadow-solid hover:-translate-y-1 active:translate-y-1 transition-all">
             Restart Game
           </button>
        </div>
     );
  }
`;

let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');
hv = hv.replace(/  const \{ card, parsedPrompt \} = hostGameState\.currentCard;/, overlayHost + '\n  const { card, parsedPrompt } = hostGameState.currentCard;');
fs.writeFileSync('src/views/HostView.tsx', hv);

const overlayClient = `
  const connectedPlayers = Object.values(clientState.players || {}).filter((p: any) => p.isConnected !== false);
  const disconnectedPlayers = Object.values(clientState.players || {}).filter((p: any) => p.isConnected === false);
  
  if (connectedPlayers.length < 2 && disconnectedPlayers.length > 0) {
     return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-8 text-center">
           <h1 className="text-4xl font-display font-black uppercase tracking-widest mb-4">Game Paused</h1>
           <p className="text-xl font-body opacity-90 mb-12">
              {disconnectedPlayers.map((p: any) => p.name).join(', ')} disconnected.<br/>Waiting for them to reconnect...
           </p>
           <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-canvas text-accent-dare font-display font-black text-xl uppercase tracking-widest rounded-3xl shadow-solid active:translate-y-1 transition-all w-full">
             Leave Game
           </button>
        </div>
     );
  }
`;

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');
cv = cv.replace(/  const \{ card, parsedPrompt \} = clientState\.currentCard;/, overlayClient + '\n  const { card, parsedPrompt } = clientState.currentCard;');
fs.writeFileSync('src/views/ControllerView.tsx', cv);

console.log('Overlays added');
