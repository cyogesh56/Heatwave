const fs = require('fs');
let code = fs.readFileSync('src/context/GameContext.tsx', 'utf-8');

const target = `client.connectToHost = async () => {
        client['playerId'] = 'host';
        client['playerName'] = playerName;
        client['channel'] = supabase.channel(\`room-\${roomCode}\`);
      };`;

const replacement = `client.connectToHost = async () => {
        client['playerId'] = 'host';
        client['playerName'] = playerName;
        
        // We simulate the exact subscription the ClientNode needs
        client['channel'] = supabase.channel(\`room-\${roomCode}\`);
        client['channel'].on('broadcast', { event: 'host-state' }, (payload: any) => {
          client['onHostData'](payload.payload);
        }).subscribe();
      };`;

code = code.replace(target, replacement);
fs.writeFileSync('src/context/GameContext.tsx', code);
