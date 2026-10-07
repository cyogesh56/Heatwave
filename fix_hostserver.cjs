const fs = require('fs');
let code = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf-8');

code = code.replace(
  "            console.log('Host channel ready:', this.roomCode);",
  "            console.log('Host channel ready:', this.roomCode);\n            this.channel!.track({ isHost: true });"
);

// Add reconnect method
const reconnectMethod = `

  public reconnect() {
    if (!this.roomCode) return;
    this.channel?.unsubscribe();
    this.channel = supabase.channel(\`room-\${this.roomCode}\`, { config: { broadcast: { self: true }, presence: { key: 'host' } } });
    this.channel
        .on('presence', { event: 'sync' }, () => {
          const state = this.channel!.presenceState();
          const connectedIds = new Set<string>();
          for (const key of Object.keys(state)) {
            if (key !== 'host') {
              state[key].forEach((p: any) => {
                if (p.playerId) connectedIds.add(p.playerId);
              });
            }
          }
          window.dispatchEvent(new CustomEvent('presence-sync', { detail: { connectedIds: Array.from(connectedIds) } }));
        })
        .on('broadcast', { event: 'client-action' }, (payload) => {
          this.onPlayerAction(payload.payload.playerId, payload.payload.action);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Host channel reconnected:', this.roomCode);
            this.channel!.track({ isHost: true });
          }
        });
  }

  public broadcast(state: any) {`;

code = code.replace("  public broadcast(state: any) {", reconnectMethod);

fs.writeFileSync('src/lib/peer/HostServer.ts', code);
