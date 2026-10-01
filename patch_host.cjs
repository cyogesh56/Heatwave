const fs = require('fs');
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// Update signature
hv = hv.replace(
  "const handleNextCard = (forceInterstitial = false) => {",
  "const handleNextCard = (forceInterstitial = false, skipInterstitial = false) => {"
);

// Update interstitial logic inside handleNextCard
const newInterstitialLogic = `
      const prevType = hostGameState.currentCard?.card?.type;
      const prevPhase = hostGameState.currentCard?.card?.phase;
      
      if (!skipInterstitial && (!prevType || prevType !== drawn.card.type || prevPhase !== drawn.card.phase || forceInterstitial)) {
          showInterstitial = true;
          if (prevPhase && prevPhase !== drawn.card.phase) {
             const phaseNames = ['The Spark', 'The Deepen', 'The Ignite', 'The Melt'];
             interTitle = \`PHASE \${drawn.card.phase}: \${phaseNames[drawn.card.phase - 1] || 'HEAT'}\`.toUpperCase();
             interSub = 'The heat rises. The vibe shifts.';
          } else {
             switch (drawn.card.type) {
                case 'truth':
                case 'fill_blank':
                   interTitle = 'Room Discussion';
                   interSub = 'Answer out loud. No voting.';
                   break;
                case 'dare':
                   interTitle = 'Physical Challenge';
                   interSub = 'Time to act. Complete the dare.';
                   break;
                case 'consensus':
                case 'vibe_poll':
                   interTitle = 'Consensus Check';
                   interSub = 'Look at your phone. Vote to agree.';
                   break;
                case 'wrong_answers':
                case 'kahoot':
                   interTitle = 'Trivia & Chaos';
                   interSub = 'Pick the funniest or correct option on your phone.';
                   break;
             }
          }
      }
`;
hv = hv.replace(
  /const prevType = hostGameState\.currentCard\?\.card\?\.type;\s*if \(!prevType \|\| prevType !== drawn\.card\.type \|\| forceInterstitial\) \{[\s\S]*?\}\s*\}/,
  newInterstitialLogic.trim()
);

// Update power action handlers
const powerHandlerLogic = `      } else if (action.type === 'power') {
         const pName = hostGameState?.players[playerId]?.name || 'Someone';
         if (action.power === 'killswitch') {
            const newPlayers = JSON.parse(JSON.stringify(hostGameState.players));
            newPlayers[playerId].inventory.killswitch = Math.max(0, newPlayers[playerId].inventory.killswitch - 1);
            
            setHostGameState(prev => {
               if (!prev) return prev;
               const n = { 
                  ...prev, 
                  players: newPlayers, 
                  uiState: 'interstitial' as const, 
                  interstitial: { title: \`\${pName} used KILL!\`.toUpperCase(), subtitle: 'Finding a random question now!' }
               };
               hostServer?.broadcast(n);
               return n;
            });
            setTimeout(() => { handleNextCard(); }, 3000);
         } else if (action.power.startsWith('override_')) {
            const targetPhase = parseInt(action.power.split('_')[1]);
            const phaseNames = ['The Spark', 'The Deepen', 'The Ignite', 'The Melt'];
            const phaseName = phaseNames[targetPhase - 1] || 'Unknown';
            const phaseSubs = [
               'Low stakes banter.',
               'Vulnerability.',
               'Sensual touch.',
               'High heat.'
            ];
            
            const newPlayers = JSON.parse(JSON.stringify(hostGameState.players));
            newPlayers[playerId].inventory.override = Math.max(0, newPlayers[playerId].inventory.override - 1);

            setHostGameState(prev => {
               if (!prev) return prev;
               const n = { 
                  ...prev, 
                  players: newPlayers, 
                  uiState: 'interstitial' as const, 
                  interstitial: { title: \`\${pName} used OVERRIDE!\`.toUpperCase(), subtitle: \`Changing the category to \${phaseName}. \${phaseSubs[targetPhase - 1]}\` }
               };
               hostServer?.broadcast(n);
               return n;
            });

            setTimeout(() => { 
               if (gameEngine) gameEngine.currentPhase = targetPhase;
               handleNextCard(false, true); // skip the normal interstitial since we just showed the override one
            }, 3000);
         } else if (action.power === 'deflect') {
            const targetName = hostGameState?.players[action.targetId]?.name || 'Someone';
            const newPlayers = JSON.parse(JSON.stringify(hostGameState.players));
            newPlayers[playerId].inventory.deflect = Math.max(0, newPlayers[playerId].inventory.deflect - 1);

            let currentCard = { ...hostGameState!.currentCard! };
            if (currentCard.targetedPlayers && currentCard.targetedPlayers.length > 0) {
                const oldTarget = currentCard.targetedPlayers[0];
                currentCard.parsedPrompt = currentCard.parsedPrompt.replace(new RegExp(oldTarget, 'gi'), targetName);
                currentCard.targetedPlayers = [targetName];
            } else {
                // If there was no target (e.g. room discussion), just prepend the target's name
                currentCard.parsedPrompt = \`\${targetName}: \${currentCard.parsedPrompt}\`;
                currentCard.targetedPlayers = [targetName];
            }

            setHostGameState(prev => {
               if (!prev) return prev;
               const n = { 
                  ...prev, 
                  players: newPlayers, 
                  currentCard,
                  uiState: 'interstitial' as const, 
                  interstitial: { title: \`\${pName} used DEFLECT!\`.toUpperCase(), subtitle: \`\${targetName} answers the question now!\` }
               };
               hostServer?.broadcast(n);
               return n;
            });

            setTimeout(() => { 
               setHostGameState(prev => {
                  if (!prev) return prev;
                  const n = { ...prev, uiState: 'voting' as const };
                  hostServer?.broadcast(n);
                  return n;
               });
            }, 3000);
         }`;

hv = hv.replace(
  /\} else if \(action\.type === 'power'\) \{[\s\S]*?\} else if \(action\.type === 'fail_truth'\) \{/,
  powerHandlerLogic + "\n      } else if (action.type === 'fail_truth') {"
);

fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('HostView patched');
