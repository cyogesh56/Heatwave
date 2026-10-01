const fs = require('fs');

let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

const oldDeflect = `} else if (action.power === 'deflect') {
            setUiAlert(\`🔄 \${pName} used a DEFLECT! Passing the heat...\`);
            setTimeout(() => { setUiAlert(''); handleNextCard(); }, 2500);
         }`;

const newDeflect = `} else if (action.power === 'deflect') {
            setUiAlert(\`🔄 \${pName} used a DEFLECT! Passing the heat...\`);
            setTimeout(() => { setUiAlert(''); handleNextCard(); }, 2500);
         }
      } else if (action.type === 'fail_truth') {
         const pName = hostGameState?.players[playerId]?.name || 'Someone';
         setUiAlert(\`😅 \${pName} failed! Drawing a TRUTH...\`);
         
         setTimeout(() => {
           setUiAlert('');
           if (!gameEngine || !hostGameState) return;
           const players = Object.values(hostGameState.players).map(p => p.name);
           const drawn = gameEngine.drawNextCard(players, hostGameState.phase, 'truth');
           if (drawn) {
             setVotes({});
             const nextState = {
               ...hostGameState,
               currentCard: drawn,
               uiState: 'voting'
             };
             setHostGameState(nextState);
             hostServer?.broadcast(nextState);
           }
         }, 2500);`;

hv = hv.replace(oldDeflect, newDeflect);

fs.writeFileSync('src/views/HostView.tsx', hv);

console.log('Handled fail truth');
