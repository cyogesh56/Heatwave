const fs = require('fs');

// Add disconnect payload in HostServer
let hs = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf8');
const oldInit = `this.channel
        .on('broadcast', { event: 'client-action' }, (payload) => {
          this.onClientData(payload.payload.playerId, payload.payload.action);
        })
        .subscribe((status) => {`;
const newInit = `
      window.addEventListener('beforeunload', () => {
        if (this.channel) {
          this.channel.send({
            type: 'broadcast',
            event: 'host-state',
            payload: { uiState: 'disconnected' }
          });
        }
      });

      this.channel
        .on('broadcast', { event: 'client-action' }, (payload) => {
          this.onClientData(payload.payload.playerId, payload.payload.action);
        })
        .subscribe((status) => {`;
hs = hs.replace(oldInit, newInit);
fs.writeFileSync('src/lib/peer/HostServer.ts', hs);

// Handle in ControllerView
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');
cv = cv.replace(/if \(!clientState\?.currentCard\) \{/, `if (clientState?.uiState === 'disconnected') {
    return <div className="min-h-screen bg-canvas text-ink-primary flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-display font-black text-accent-dare mb-4 uppercase">Host Disconnected</h1>
      <p className="font-body text-ink-primary/70">The host closed the game or lost connection. Refresh to join a new room.</p>
    </div>;
  }
  if (!clientState?.currentCard) {`);
fs.writeFileSync('src/views/ControllerView.tsx', cv);

console.log('Host disconnect fixed');
