const fs = require('fs');

// 1. Fix GameContext.tsx initClient
let gameCtx = fs.readFileSync('src/context/GameContext.tsx', 'utf-8');
const initClientRegex = /const initClient = async \(roomCode: string, playerName: string\) => \{[\s\S]*?await client\.connectToHost\(roomCode, playerName\);/;

const initClientReplacement = `const initClient = async (roomCode: string, playerName: string) => {
    if (sessionStorage.getItem('hostlessMode') !== 'true') setIsHost(false);
    const client = new ClientNode(
      (data) => setClientState(data),
      () => {
        console.log('Disconnected');
        setClientState(null);
      }
    );
    
    if (hostServer) {
      // Local Host bypass: Add directly to host state to skip network latency
      setHostGameState(prev => {
        if (!prev) return prev;
        const nextState = {
          ...prev,
          players: {
            ...prev.players,
            ['host']: { name: playerName, isReady: false, inventory: { deflect: 0, killswitch: 0, override: 0 }, isConnected: true }
          }
        };
        setTimeout(() => hostServer.broadcast(nextState), 50);
        return nextState;
      });
      // Override connectToHost to resolve instantly since we injected state
      client.connectToHost = async () => {
        client['playerId'] = 'host';
        client['playerName'] = playerName;
        client['channel'] = supabase.channel(\`room-\${roomCode}\`);
      };
    }
    
    await client.connectToHost(roomCode, playerName);`;

gameCtx = gameCtx.replace(initClientRegex, initClientReplacement);
fs.writeFileSync('src/context/GameContext.tsx', gameCtx);

// 2. Fix try/catch in LobbyView.tsx
let lobbyView = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');
lobbyView = lobbyView.replace(
  "await initClient(hostServer?.roomCode || '', hostPlayerName);\n                        setIsJoining(false);",
  "try { await initClient(hostServer?.roomCode || '', hostPlayerName); } catch(e) { console.error(e); }\n                        setIsJoining(false);"
);
fs.writeFileSync('src/views/LobbyView.tsx', lobbyView);
