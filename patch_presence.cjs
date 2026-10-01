const fs = require('fs');
let clientNode = fs.readFileSync('src/lib/peer/ClientNode.ts', 'utf8');
let hostServer = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf8');
let hostView = fs.readFileSync('src/views/HostView.tsx', 'utf8');

clientNode = clientNode.replace(
  "this.channel = supabase.channel(`room-${roomCode}`);",
  "this.channel = supabase.channel(`room-${roomCode}`, { config: { presence: { key: this.playerId } } });"
);
clientNode = clientNode.replace(
  "if (status === 'SUBSCRIBED') {\n            console.log('Connected to host via Supabase!');\n            this.send({ type: 'join', name: playerName });\n            resolve();",
  "if (status === 'SUBSCRIBED') {\n            console.log('Connected to host via Supabase!');\n            this.channel!.track({ playerId: this.playerId, name: playerName }).then(() => {\n              this.send({ type: 'join', name: playerName });\n              resolve();\n            });"
);

hostServer = hostServer.replace(
  "this.channel = supabase.channel(`room-${this.roomCode}`);",
  "this.channel = supabase.channel(`room-${this.roomCode}`, { config: { presence: { key: 'host' } } });"
);
hostServer = hostServer.replace(
  ".on('broadcast', { event: 'client-action' }",
  ".on('presence', { event: 'sync' }, () => {\n          const state = this.channel!.presenceState();\n          const connectedIds = new Set<string>();\n          for (const key of Object.keys(state)) {\n            if (key !== 'host') {\n              state[key].forEach((p: any) => {\n                if (p.playerId) connectedIds.add(p.playerId);\n              });\n            }\n          }\n          window.dispatchEvent(new CustomEvent('presence-sync', { detail: { connectedIds: Array.from(connectedIds) } }));\n        })\n        .on('broadcast', { event: 'client-action' }"
);

const presenceHandler = `
    const handlePresence = (e: any) => {
       const connectedIds = e.detail.connectedIds as string[];
       setHostGameState(prev => {
          if (!prev) return prev;
          let changed = false;
          const newPlayers = { ...prev.players };
          for (const id of Object.keys(newPlayers)) {
             const isConnected = connectedIds.includes(id);
             if (newPlayers[id].isConnected !== isConnected) {
                newPlayers[id] = { ...newPlayers[id], isConnected };
                changed = true;
             }
          }
          if (changed) {
             const n = { ...prev, players: newPlayers };
             hostServer?.broadcast(n);
             return n;
          }
          return prev;
       });
    };
    window.addEventListener('presence-sync', handlePresence);
    return () => {
      window.removeEventListener('player-action', handleAction);
      window.removeEventListener('presence-sync', handlePresence);
    };
`;

hostView = hostView.replace(
  "return () => window.removeEventListener('player-action', handleAction);",
  presenceHandler.trim()
);

fs.writeFileSync('src/lib/peer/ClientNode.ts', clientNode);
fs.writeFileSync('src/lib/peer/HostServer.ts', hostServer);
fs.writeFileSync('src/views/HostView.tsx', hostView);
console.log('Presence patched');
