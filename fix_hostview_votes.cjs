const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

const oldEffect = `  useEffect(() => {
    const activeCount = Object.values(hostGameState?.players || {}).filter(p => p.isConnected !== false).length;
    if (hostGameState?.uiState === 'voting' && Object.keys(votes).length > 0 && Object.keys(votes).length >= activeCount) {
       startReveal();
    }
  }, [votes]);`;

const newEffect = `  useEffect(() => {
    const activeCount = Object.values(hostGameState?.players || {}).filter((p: any) => p.isConnected !== false).length;
    let requiredVotes = activeCount;
    
    if (hostGameState?.currentCard?.assignedResponderName) {
      const responder = Object.entries(hostGameState.players || {}).find(([id, p]: [string, any]) => p.name === hostGameState.currentCard.assignedResponderName);
      if (responder && responder[1].isConnected !== false) {
        requiredVotes = 1;
      }
    }

    if (hostGameState?.uiState === 'voting' && Object.keys(votes).length > 0 && Object.keys(votes).length >= requiredVotes) {
       startReveal();
    }
  }, [votes]);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/views/HostView.tsx', code);
