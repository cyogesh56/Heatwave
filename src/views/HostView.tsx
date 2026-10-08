import { useSyncTimer } from '../hooks/useSyncTimer';
import React, { useEffect, useState } from 'react';
class ErrorBoundary extends React.Component<any, any> { constructor(props: any) { super(props); this.state = { hasError: false, error: null }; } static getDerivedStateFromError(error: any) { return { hasError: true, error }; } render() { if (this.state.hasError) { return <div className="p-12 text-red-500 font-meta bg-white z-[9999] relative">CRASH: {this.state.error?.message}</div>; } return this.props.children; } }
import { useGame } from '../context/GameContext';
import { PlayingCard } from '../components/ui/PlayingCard';
import { PowerDock } from '../components/ui/PowerDock';
import { IconZap, IconFlame, IconScale, IconEye } from '../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalHeader } from '../components/ui/UniversalHeader';
import { GamePopup } from '../components/ui/GamePopup';
import { TimerBadge } from '../components/ui/TimerBadge';
import { soundEngine } from '../lib/audio/SoundEngine';
import { ControllerView } from './ControllerView';



const HostAlertOverlay = ({ uiAlert }: { uiAlert?: string }) => (
  <AnimatePresence>
    {uiAlert && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed top-8 pt-[env(safe-area-inset-top)] left-1/2 -translate-x-1/2 z-[9999] pointer-events-none w-11/12 max-w-lg"
      >
        <div className="bg-surface-card text-ink-primary border-4 border-accent-dare rounded-2xl px-6 py-4 shadow-2xl text-center backdrop-blur-xl">
          <span className="text-sm lg:text-base font-display font-black uppercase tracking-widest leading-snug">
            {uiAlert}
          </span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const HostViewInner: React.FC = () => {

  const { hostServer, hostGameState, setHostGameState, gameEngine, clientNode } = useGame();
  
  const [votes, setVotes] = useState<Record<string, string>>({});
  
  const [uiAlert, setUiAlert] = useState('');
  const [confirmEndGame, setConfirmEndGame] = useState(false);
  const [isOverrideSheetOpen, setIsOverrideSheetOpen] = useState(false);
  const [isDeflectSheetOpen, setIsDeflectSheetOpen] = useState(false);
  const [deflectTarget, setDeflectTarget] = useState<string | null>(null);
  const [showMobileResults, setShowMobileResults] = useState(false);
  
  const isHostless = sessionStorage.getItem('hostlessMode') === 'true';
  const [showPlayerControls, setShowPlayerControls] = useState(false);

  const timeLeft = useSyncTimer(hostGameState?.timers?.endsAt);
  
  const handlePower = (power: string) => {
    clientNode?.send({ type: 'power', power });
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
  };

  
  React.useEffect(() => {
    // Attempt to init audio context early
    const initAudio = () => soundEngine.init();
    window.addEventListener('click', initAudio, { once: true });
    
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && hostServer) {
         console.log("Host window visible, forcing reconnect...");
         hostServer.reconnect();
         setTimeout(() => {
            if (hostGameStateRef.current) {
               hostServer.broadcast(hostGameStateRef.current);
            }
         }, 500);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    
    return () => {
      window.removeEventListener('click', initAudio);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [hostServer]);
  const hostGameStateRef = React.useRef(hostGameState);
  React.useEffect(() => { hostGameStateRef.current = hostGameState; }, [hostGameState]);

  useEffect(() => {
    if (!gameEngine || !hostGameState) return;

    if (!hostGameState.currentCard) {
      handleNextCard();
    }
  }, [gameEngine]); // Only run when gameEngine initializes

  useEffect(() => {
    const handleAction = (e: any) => {
      const { playerId, action } = e.detail;
      if (action.type === 'vote') {
        setVotes(prev => ({ ...prev, [playerId]: action.choice }));
            } else if (action.type === 'power') {
         if (hostGameState?.uiState === 'interstitial') return;
         const inv = hostGameState?.players[playerId]?.inventory;
         const powerKey = action.power.startsWith('override') ? 'override' : action.power;
         if (!inv || inv[powerKey as keyof typeof inv] <= 0) return;
         setHostGameState((prev) => {
           if (!prev) return prev;
           const s = prev.stats || {};
           if (!s[playerId]) s[playerId] = { powersUsed: 0, truthsAnswered: 0, daresCompleted: 0, targetedCount: 0 };
           s[playerId].powersUsed++;
           return { ...prev, stats: s };
         });
         const pName = hostGameState?.players[playerId]?.name || 'Someone';
         if (action.power === 'killswitch') {
            const newPlayers = JSON.parse(JSON.stringify(hostGameState!.players));
            newPlayers[playerId].inventory.killswitch = Math.max(0, newPlayers[playerId].inventory.killswitch - 1);
            
            setHostGameState(prev => {
               if (!prev) return prev;
               const n = { 
                  ...prev, 
                  players: newPlayers, 
                  uiState: 'interstitial' as const, 
                  interstitial: { title: `${pName} used KILL!`.toUpperCase(), subtitle: 'Finding a random question now!' }
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
            
            const newPlayers = JSON.parse(JSON.stringify(hostGameState!.players));
            newPlayers[playerId].inventory.override = Math.max(0, newPlayers[playerId].inventory.override - 1);

            setHostGameState(prev => {
               if (!prev) return prev;
               const n = { 
                  ...prev, 
                  players: newPlayers, 
                  uiState: 'interstitial' as const, 
                  interstitial: { title: `${pName} used OVERRIDE!`.toUpperCase(), subtitle: `Changing the category to ${phaseName}. ${phaseSubs[targetPhase - 1]}` }
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
            const newPlayers = JSON.parse(JSON.stringify(hostGameState!.players));
            newPlayers[playerId].inventory.deflect = Math.max(0, newPlayers[playerId].inventory.deflect - 1);

            let currentCard = { ...hostGameState!.currentCard! };
            const deflectingName = hostGameState?.players[playerId]?.name;
            
            if (currentCard.parsedPrompt.includes(deflectingName)) {
                // Swap the deflecting player and the target player in the prompt
                const tempToken = '___TEMP_DEFLECT_TOKEN___';
                currentCard.parsedPrompt = currentCard.parsedPrompt
                  .replace(new RegExp(deflectingName, 'gi'), tempToken)
                  .replace(new RegExp(targetName, 'gi'), deflectingName)
                  .replace(new RegExp(tempToken, 'gi'), targetName);
                
                // Also update targetedPlayers array if they exist
                if (currentCard.targetedPlayers) {
                  currentCard.targetedPlayers = currentCard.targetedPlayers.map(p => 
                    p === deflectingName ? targetName : (p === targetName ? deflectingName : p)
                  );
                }
            } else {
                // If the deflecting player wasn't even in the prompt, just prepend the target's name
                currentCard.parsedPrompt = `${targetName}: ${currentCard.parsedPrompt}`;
                if (currentCard.targetedPlayers) {
                  currentCard.targetedPlayers = [targetName, ...currentCard.targetedPlayers];
                } else {
                  currentCard.targetedPlayers = [targetName];
                }
            }

            setHostGameState(prev => {
               if (!prev) return prev;
               const n = { 
                  ...prev, 
                  players: newPlayers, 
                  currentCard,
                  uiState: 'interstitial' as const, 
                  interstitial: { title: `${pName} used DEFLECT!`.toUpperCase(), subtitle: `${targetName} answers the question now!` }
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
         }
      } else if (action.type === 'fail_truth') {
         const pName = hostGameState?.players[playerId]?.name || 'Someone';
         setUiAlert(`😅 ${pName} failed! Drawing a TRUTH...`);
         
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
               uiState: 'voting' as const
             };
             setHostGameState(nextState);
             hostServer?.broadcast(nextState);
           }
         }, 2500);
      }
    };
    window.addEventListener('player-action', handleAction);
    const handlePresence = (e: any) => {
       const connectedIds = e.detail.connectedIds as string[];
       setHostGameState(prev => {
          if (!prev) return prev;
          let changed = false;
          const newPlayers = { ...prev.players };
          for (const id of Object.keys(newPlayers)) {
             if (id === 'host') continue;
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
  }, [hostGameState, gameEngine]); // Dependencies needed to read latest state


  const startReveal = () => {
    if (hostGameState?.revealCountdown) return;
    setHostGameState(prev => {
      if (!prev) return prev;
      const n = { ...prev, revealCountdown: 5, timers: { ...prev.timers, active: false, remainingSeconds: 0 } };
      hostServer?.broadcast(n);
      return n;
    });
  };

  useEffect(() => {
    const activeCount = Object.values(hostGameState?.players || {}).filter((p: any) => p.isConnected !== false).length;
    let requiredVotes = activeCount;
    
    const cardType = hostGameState?.currentCard?.card.type;
    
    if (hostGameState?.currentCard?.assignedResponderName) {
        // The assigned responder guesses out loud, everyone else votes.
        requiredVotes = Math.max(1, activeCount - 1);
    } else if (cardType === 'dare' || cardType === 'truth') {
        // Physical activities / open discussions only require 1 person (the target) to click "Done"
        requiredVotes = 1;
    }

    if (hostGameState?.uiState === 'voting' && Object.keys(votes).length > 0 && Object.keys(votes).length >= requiredVotes) {
       startReveal();
    }
  }, [votes, hostGameState?.players]);

  useEffect(() => {
    if (timeLeft <= 0 && hostGameState?.timers?.active && !hostGameState?.revealCountdown) {
       startReveal();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (hostGameState?.revealCountdown && hostGameState.revealCountdown > 0) {
       const t = setTimeout(() => {
          if (hostGameState.revealCountdown === 1) {
             handleNextCard();
          } else {
             setHostGameState(prev => {
                if (!prev) return prev;
                const n = { ...prev, revealCountdown: (prev.revealCountdown || 5) - 1 };
                hostServer?.broadcast(n);
                return n;
             });
          }
       }, 1000);
       return () => clearTimeout(t);
    }
  }, [hostGameState?.revealCountdown]);

  useEffect(() => {
    if (!hostGameState) return;
    const activeCount = Object.values(hostGameState.players || {}).filter((p: any) => p.isConnected !== false).length;
    
    if (hostGameState.readyPlayers && hostGameState.readyPlayers.length >= Math.ceil(activeCount / 2)) {
       startReveal();
    }

    if (hostGameState.juryState?.active) {
       const juryVotes = Object.values(hostGameState.juryState.votes);
       const requiredVotes = Math.max(1, activeCount - 1);
       if (juryVotes.length >= requiredVotes) {
          const yesVotes = juryVotes.filter(v => v === 'yes').length;
          if (yesVotes >= Math.ceil(requiredVotes / 2)) {
             startReveal();
          } else {
             window.dispatchEvent(new CustomEvent('player-action', { detail: { playerId: hostGameState.juryState.targetId, action: { type: 'fail_truth' } } }));
          }
       }
    }
  }, [hostGameState?.readyPlayers, hostGameState?.juryState?.votes]);


  const handleNextCard = (forceInterstitial = false, skipInterstitial = false) => {
    setShowMobileResults(false);
    if (!gameEngine || !hostGameStateRef.current) return;
    const players = Object.values(hostGameStateRef.current!.players).map(p => p.name);
    const drawn = gameEngine.drawNextCard(players.length > 0 ? players : ['Player 1', 'Player 2']);
    
    // Loot drop logic
    const newPlayers = JSON.parse(JSON.stringify(hostGameStateRef.current!.players));
    const playerIds = Object.keys(newPlayers);
    let alertMsg = '';
    let targetPlayerId = '';
    
    if (!drawn) {
       setHostGameState(prev => {
          if (!prev) return null;
          const next = { ...prev, uiState: 'ended' as const };
          hostServer?.broadcast(next);
          return next;
       });
       return;
    }

    if (playerIds.length > 0 && Math.random() < 0.4) {
       const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
       const powers = ['deflect', 'killswitch', 'override'];
       const randomPower = powers[Math.floor(Math.random() * powers.length)];
       newPlayers[randomId].inventory[randomPower] += 1;
       alertMsg = `📦 ${newPlayers[randomId].name} discovered a ${randomPower.toUpperCase()}!`;
       newPlayers[randomId].uiAlert = `📦 You discovered a ${randomPower.toUpperCase()}!`;
       targetPlayerId = randomId;
    }

    if (drawn) {
      setVotes({});
      
      // Inject options for Kahoot/Consensus if missing, or Vibe Poll
      if (drawn.card.type === 'vibe_poll') {
         drawn.card.options = Object.values(newPlayers).map((p: any) => p.name);
      } else if (!drawn.card.options && (drawn.card.type === 'kahoot' || drawn.card.type === 'wrong_answers' || drawn.card.type === 'consensus' || drawn.card.type === 'fill_blank')) {
         // Treat questions without options as open-ended room discussions!
         drawn.card.type = 'truth';
      }

      // Interstitial Logic
      let showInterstitial = false;
      let interColor = "bg-accent-dare";
      let interIconName = 'IconFlame';
      let interTitle = '';
      let interSub = '';
      const prevType = hostGameStateRef.current.currentCard?.card?.type;
      const prevPhase = hostGameStateRef.current.currentCard?.card?.phase;
      
      if (!skipInterstitial && (!prevType || prevType !== drawn.card.type || prevPhase !== drawn.card.phase || forceInterstitial)) {
          showInterstitial = true;
          if (prevPhase && prevPhase !== drawn.card.phase) {
             const phaseNames = ['The Spark', 'The Deepen', 'The Ignite', 'The Melt'];
             interTitle = `PHASE ${drawn.card.phase}: ${phaseNames[drawn.card.phase - 1] || 'HEAT'}`.toUpperCase();
             interSub = 'The heat rises. The vibe shifts.';
             interColor = "bg-accent-dare";
             interIconName = "IconFlame";
          } else {
             switch (drawn.card.type) {
                case 'truth':
                   interTitle = 'Room Discussion'; interSub = 'Answer out loud. No voting.';
                   interColor = 'bg-accent-truth'; interIconName = 'IconEye'; break;
                case 'fill_blank':
                   interTitle = 'Room Discussion'; interSub = 'Answer out loud. No voting.';
                   interColor = 'bg-accent-truth'; interIconName = 'IconEye'; break;
                case 'dare':
                   interTitle = 'Physical Challenge'; interSub = 'Time to act. Complete the dare.';
                   interColor = 'bg-accent-dare'; interIconName = 'IconFlame'; break;
                case 'consensus':
                case 'vibe_poll':
                   interTitle = 'Consensus Check'; interSub = 'Look at your phone. Vote to agree.';
                   interColor = 'bg-accent-consensus-stroke'; interIconName = 'IconScale'; break;
                case 'wrong_answers':
                case 'kahoot':
                   interTitle = 'Trivia & Chaos'; interSub = 'Pick the funniest or correct option on your phone.';
                   interColor = 'bg-accent-wrong-stroke'; interIconName = 'IconZap'; break;
             }
          }
      }

      // Timer Logic
      const delayMs = showInterstitial ? 3000 : 0;
      const isVoting = ['kahoot', 'wrong_answers', 'consensus', 'vibe_poll', 'fill_blank'].includes(drawn.card.type);
      const isDare = drawn.card.type === 'dare';
      
      let futureTimer = null;
      if (isVoting) {
         futureTimer = Date.now() + delayMs + 5000 + (30 * 1000); 
      } else if (isDare && drawn.card.prompt.includes('60')) {
         futureTimer = Date.now() + delayMs + 5000 + (60 * 1000);
      }

      const nextState = {
        ...hostGameStateRef.current,
        phase: drawn.card.phase,
        players: newPlayers,
        currentCard: drawn,
        uiState: showInterstitial ? 'interstitial' as const : 'voting' as const,
        interstitial: showInterstitial ? { title: interTitle, subtitle: interSub, color: interColor, icon: interIconName } : undefined,
        readyPlayers: [],
        juryState: undefined,
        revealCountdown: undefined,
        timers: {
          active: !!futureTimer,
          endsAt: futureTimer,
          remainingSeconds: 0
        },
        uiAlert: alertMsg || undefined
      };
      
      setHostGameState(nextState);
      hostServer?.broadcast(nextState);
      
      if (showInterstitial) {
         setTimeout(() => {
            setHostGameState(prev => {
               if (!prev) return prev;
               const resumedState = { ...prev, uiState: 'voting' as const };
               hostServer?.broadcast(resumedState);
               return resumedState;
            });
         }, 3000);
      }
      
      if (alertMsg) {
        setUiAlert(alertMsg);
        setTimeout(() => {
          setUiAlert('');
          if (targetPlayerId) {
             setHostGameState(prev => {
                if (!prev) return prev;
                const p = { ...prev.players };
                if (p[targetPlayerId]) {
                   p[targetPlayerId] = { ...p[targetPlayerId], uiAlert: undefined };
                }
                const n = { ...prev, players: p, uiAlert: undefined };
                hostServer?.broadcast(n);
                return n;
             });
          }
        }, 4000 + delayMs);
      }
    } else {
      // Deck is empty, trigger game over
      setHostGameState(prev => {
        if (!prev) return null;
        const next = { ...prev, uiState: 'ended' as const };
        hostServer?.broadcast(next);
        return next;
      });
    }
  };




  if (!hostGameState || !hostGameState.currentCard) {
    return <div className="min-h-[100dvh] bg-canvas text-ink-primary flex items-center justify-center font-display text-2xl md:text-3xl lg:text-4xl">Loading Deck...</div>;
  }

  const [isLeaving, setIsLeaving] = useState(false);
  const connectedPlayers = Object.values(hostGameState.players).filter((p: any) => p.isConnected !== false);
  const disconnectedPlayers = Object.values(hostGameState.players).filter((p: any) => p.isConnected === false);
  
  if (connectedPlayers.length < 2 && disconnectedPlayers.length > 0) {
     return (
        <div className={`min-h-[100dvh] w-full flex flex-col items-center justify-center ${hostGameState.interstitial?.color || 'bg-accent-dare'} text-canvas p-12 text-center`}
      >
        <HostAlertOverlay uiAlert={uiAlert} />
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-widest mb-6">Game Paused</h1>
           <p className="text-3xl font-body opacity-90 mb-12">
              {disconnectedPlayers.map((p: any) => p.name).join(', ')} disconnected.<br/>Waiting for them to reconnect...
           </p>
           <button onClick={() => { setIsLeaving(true); window.location.href = '/'; }} className="px-12 py-6 bg-canvas text-accent-dare font-display font-black text-2xl uppercase tracking-widest rounded-2xl shadow-solid active:translate-y-[4px] active:shadow-none hover:-translate-y-1 transition-all">
             {isLeaving ? 'RESTARTING...' : 'Restart Game'}
           </button>
        </div>
     );
  }



  if (hostGameState.uiState === 'ended') {
    return (
      <div className="min-h-[100dvh] bg-canvas text-ink-primary flex flex-col items-center justify-center p-12 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-black text-accent-dare mb-6 uppercase tracking-widest">Game Over</h1>
        <p className="text-xl md:text-2xl font-body text-ink-primary/70 mb-12">The decks have run dry. The heat has subsided.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
          {Object.entries(hostGameState.players || {}).map(([id, p]: any) => (
             <div key={id} className="bg-surface-card p-6 rounded-3xl border-4 border-ink-primary/10 shadow-solid flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full border-4 border-ink-primary bg-accent-consensus-fill mb-4"></div>
                <h3 className="font-display font-black text-2xl uppercase tracking-widest">{p.name}</h3>
                <div className="mt-4 flex gap-4 opacity-70">
                  <div className="flex flex-col items-center">
                    <span className="font-meta font-bold text-2xl">{hostGameState.stats?.[id]?.powersUsed || 0}</span>
                    <span className="font-meta text-xs uppercase tracking-widest">Powers</span>
                  </div>
                </div>
             </div>
          ))}
        </div>

        <button 
          onClick={() => window.location.href = '/'} 
          className="px-12 py-6 bg-ink-primary text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-[2rem] shadow-solid hover:-translate-y-2 transition-all active:translate-y-[4px] active:shadow-none"
        >
          Return to Lobby
        </button>
      </div>
    );
  }

  if (hostGameState.uiState === 'interstitial' && hostGameState.interstitial) {
     return (
        <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className={`min-h-[100dvh] w-full flex flex-col items-center justify-center ${hostGameState.interstitial?.color || 'bg-accent-dare'} text-canvas p-12 text-center`}
        
      >
        
           
           {hostGameState.interstitial?.icon === 'IconZap' && <IconZap className="w-24 h-24 mb-6 opacity-80" />}
           {hostGameState.interstitial?.icon === 'IconFlame' && <IconFlame className="w-24 h-24 mb-6 opacity-80" />}
           {hostGameState.interstitial?.icon === 'IconScale' && <IconScale className="w-24 h-24 mb-6 opacity-80" />}
           {hostGameState.interstitial?.icon === 'IconEye' && <IconEye className="w-24 h-24 mb-6 opacity-80" />}
           <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-black uppercase tracking-widest mb-6">{hostGameState.interstitial?.title}</h1>

           <p className="text-xl md:text-3xl lg:text-5xl font-body opacity-90">{hostGameState.interstitial?.subtitle}</p>
        
      </motion.div>
     );
  }



  const { card, parsedPrompt } = hostGameState.currentCard;
  

  const renderRevealArea = () => {
    if (!['kahoot', 'wrong_answers', 'consensus', 'vibe_poll', 'fill_blank'].includes(card.type)) {
      return (
        <div className="flex flex-col gap-8 w-full max-w-md items-center mt-0">

          {hostGameState?.revealCountdown ? (
     <div className="w-full py-6 bg-accent-truth text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-3xl shadow-solid text-center animate-pulse">
       ADVANCING IN {hostGameState.revealCountdown}...
     </div>
  ) : (
     <button onClick={() => handleNextCard(false)} className="w-full py-4 bg-transparent border-4 border-ink-primary/20 text-ink-primary/40 font-display font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-ink-primary/5 transition-all">
       Force Advance
     </button>
  )}
          {parsedPrompt.toLowerCase().includes('answer a truth') && (
             <button onClick={() => window.dispatchEvent(new CustomEvent('player-action', { detail: { playerId: 'host', action: { type: 'fail_truth' } } }))} className="w-full py-4 bg-transparent border-4 border-accent-truth text-accent-truth font-display font-black text-xl uppercase tracking-widest rounded-2xl hover:bg-accent-truth/10 transition-all">
               Answer a Truth Instead
             </button>
          )}
        </div>
      );
    }

    const options = card.options || ['Option A', 'Option B', 'Option C', 'Option D'];
    const totalVotes = Object.keys(votes).length;

    return (
      <div className="w-full max-w-4xl mt-0 bg-surface-card backdrop-blur-xl rounded-3xl p-5 sm:p-8 border-2 border-ink-primary/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-ink-primary/10 pb-4 sm:pb-6 mb-4 sm:mb-6 gap-2 sm:gap-4">
          <h3 className="text-sm sm:text-xl font-meta uppercase tracking-widest text-ink-primary/90 text-center sm:text-left">
            {card.type === 'vibe_poll' ? 'Vibe Poll' : 
             card.type === 'kahoot' || card.type === 'wrong_answers' || card.type === 'fill_blank' ? 'Trivia & Chaos' : 
             'Consensus'} ({totalVotes} votes)
          </h3>
          {hostGameState?.timers?.active && (
            <div className="scale-150 transform origin-left md:origin-center">
              <TimerBadge timeLeft={timeLeft} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:gap-6">
          {options.map((opt: string, i: number) => {
            const voteCount = Object.values(votes).filter(v => v === opt).length;
            const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
            
            const voters = Object.entries(votes)
              .filter(([id, v]) => v === opt)
              .map(([id]) => hostGameState.players[id]?.name)
              .filter(Boolean)
              .join(', ');
            return (
              <div key={i} className="flex items-center gap-2 sm:gap-4">
                <div className="w-24 sm:w-32 md:w-48 text-right font-bold text-xs sm:text-base opacity-90 truncate leading-tight" title={opt}>{opt}</div>
                <div className="flex-1 h-8 bg-canvas rounded-full shadow-inner overflow-hidden border border-ink-primary/5 relative">
                  <div 
                    className="h-full bg-accent-consensus transition-all duration-1000 ease-out relative"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 0 && <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>}
                    {voters && (
                      <div className="absolute inset-0 flex items-center px-4 overflow-hidden">
                        <span className="font-meta text-xs uppercase tracking-widest text-ink-dark font-bold truncate z-10">{voters}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-16 font-meta text-xl text-accent-consensus">{percentage}%</div>
              </div>
            );
          })}
        </div>
        <button onClick={() => handleNextCard(false)} className="mt-6 sm:mt-8 w-full py-4 sm:py-6 bg-accent-dare text-canvas font-display font-black text-xl sm:text-2xl uppercase tracking-widest rounded-2xl shadow-solid active:translate-y-[4px] active:shadow-none hover:-translate-y-1 transition-all">
          Draw Next Card
        </button>
      </div>
    );
  };

  return (
  <ErrorBoundary>
    <div className="min-h-[100dvh] w-full flex flex-col transition-colors duration-500 bg-canvas text-ink-primary font-sans overflow-x-hidden">
      <GamePopup 
        isOpen={confirmEndGame} 
        title="End Game?" 
        message="Are you sure you want to end the game for everyone?" 
        type="confirm" 
        onConfirm={() => { setConfirmEndGame(false); if (hostServer) { setHostGameState(prev => { if (!prev) return null; const next = { ...prev, uiState: 'ended' as const }; hostServer.broadcast(next); return next; }); } }}
        onCancel={() => setConfirmEndGame(false)}
        accent="dare" 
      />
      
      <audio src="/arpmedia-bedroom-night-sensual-massage-569465.mp3" autoPlay loop muted={false} />
      <UniversalHeader
        leftNode={
          <div className="text-xl sm:text-2xl lg:text-4xl font-black tracking-widest bg-ink-primary/5 px-4 lg:px-5 py-1.5 lg:py-2 rounded-2xl border border-ink-primary/20 shadow-inner">
            #{hostServer?.roomCode || 'GAME'}
          </div>
        }
        rightNode={
          <button 
            onClick={() => setConfirmEndGame(true)}
            className="font-meta font-bold text-sm tracking-widest uppercase text-accent-dare hover:bg-accent-dare/10 px-4 py-2 rounded-2xl shadow-solid-sm active:translate-y-[2px] active:shadow-none transition-all transition-colors"
          >
            End Game
          </button>
        }
      />

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 pb-32 lg:p-12 gap-4 sm:gap-8 lg:gap-16 relative z-0 w-full max-w-[1600px] mx-auto overflow-visible">
        {/* Left Side: Card */}
        <div className={`relative w-full lg:w-1/2 items-center justify-center shrink-0 ${showMobileResults ? "hidden lg:flex" : "flex"}`}>
          <div className="w-full max-w-md lg:max-w-xl aspect-[4/3] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={card.id}
              initial={{ y: 200, opacity: 0, scale: 0.8, rotate: 3 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{ y: -200, opacity: 0, scale: 0.8, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className="absolute inset-0"
            >
              <PlayingCard 
                prompt={parsedPrompt}
                type={card.type === 'kahoot' ? 'wrong' : card.type}
                index={card.phase}
              />
            </motion.div>
          </AnimatePresence>

        </div>
        </div>
        {/* Right Side: Reveal Area */}
        <div className={`w-full lg:w-1/2 items-center justify-center shrink-0 p-6 sm:p-8 min-h-[300px] ${showMobileResults ? 'flex' : 'hidden lg:flex'}`}>
          {renderRevealArea()}
        </div>
      
        {/* Mobile Toggle Button */}
        <div className="lg:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
           <button onClick={() => setShowMobileResults(!showMobileResults)} className="px-8 py-4 bg-ink-primary text-canvas rounded-full font-meta font-bold uppercase tracking-widest shadow-2xl whitespace-nowrap active:scale-95 transition-transform">
             {showMobileResults ? 'View Question' : 'View Live Votes'}
           </button>
        </div>
      </main>

{/* uiAlert removed */}

      <HostAlertOverlay uiAlert={uiAlert} />
      {/* Bottom Bar: Online Players OR Power Dock */}
      {clientNode ? (
        <div className="fixed bottom-0 left-0 w-full z-[100]">
          <PowerDock 
            onDeflect={() => setIsDeflectSheetOpen(true)}
            onKillswitch={() => handlePower('killswitch')}
            onOverride={() => setIsOverrideSheetOpen(true)}
            inventory={hostGameState?.players?.[clientNode?.['playerId'] || '']?.inventory || { deflect: 0, killswitch: 0, override: 0 }}
          />
        </div>
      ) : (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-surface-card/90 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-ink-primary/10 shadow-xl z-50">
          {Object.entries(hostGameState.players).map(([id, p]: any) => (
             <div key={id} className="flex items-center gap-2">
               <div className={`w-3 h-3 rounded-full shadow-solid-sm ${p.isConnected !== false ? 'bg-[#10B981]' : 'bg-accent-dare'}`} />
               <span className="font-meta text-sm font-bold uppercase tracking-widest text-ink-primary/70">{p.name}</span>
             </div>
          ))}
        </div>
      )}

      {/* Deflect Sheet */}
      <div className={`fixed bottom-0 left-0 w-full bg-surface-card rounded-t-[2rem] border-t-4 border-ink-primary shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-[9999] p-8 flex flex-col gap-6 ${isDeflectSheetOpen ? 'translate-y-0' : 'translate-y-[120%]'}`}>
        <div className="w-16 h-1.5 bg-ink-primary/20 rounded-full mx-auto" />
        <h3 className="text-center font-display font-black uppercase tracking-widest text-2xl text-ink-primary">Deflect to...</h3>
        <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
          {Object.entries(hostGameState?.players || {}).filter(([id]) => id !== clientNode?.['playerId']).map(([id, p]: any) => (
             <button 
               key={id}
               onClick={() => setDeflectTarget(id)} 
               className={`py-4 px-6 rounded-2xl border-4 ${deflectTarget === id ? 'border-accent-dare bg-accent-dare/10 text-accent-dare' : 'border-ink-primary/20 bg-canvas text-ink-primary'} font-display font-bold uppercase tracking-widest text-left shadow-sm transition-all`}
             >
               {p.name}
             </button>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
           <button onClick={() => { setIsDeflectSheetOpen(false); setDeflectTarget(null); }} className="flex-1 py-4 border-4 border-ink-primary/20 rounded-2xl font-display font-bold uppercase tracking-widest text-ink-primary/50 hover:bg-ink-primary/5">Cancel</button>
           <button 
             disabled={!deflectTarget}
             onClick={() => { clientNode?.send({ type: 'power', power: 'deflect', targetId: deflectTarget }); setIsDeflectSheetOpen(false); setDeflectTarget(null); }} 
             className="flex-1 py-4 rounded-2xl border-4 border-accent-dare bg-accent-dare text-canvas font-display font-black uppercase tracking-widest disabled:opacity-50"
           >
             Deflect
           </button>
        </div>
      </div>

      {/* Override Sheet */}
      <div className={`fixed bottom-0 left-0 w-full bg-surface-card rounded-t-[2rem] border-t-4 border-ink-primary shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-[9999] p-8 flex flex-col gap-6 ${isOverrideSheetOpen ? 'translate-y-0' : 'translate-y-[120%]'}`}>
        <div className="w-16 h-1.5 bg-ink-primary/20 rounded-full mx-auto" />
        <h3 className="text-center font-display font-black uppercase tracking-widest text-2xl text-ink-primary">Force Override</h3>
        <p className="text-center font-body text-ink-primary/60 -mt-4">Where are we going?</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => { handlePower('override_1'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-2xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-[2px] active:shadow-none">Spark</button>
          <button onClick={() => { handlePower('override_2'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-2xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-[2px] active:shadow-none">Deepen</button>
          <button onClick={() => { handlePower('override_3'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-2xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-[2px] active:shadow-none">Ignite</button>
          <button onClick={() => { handlePower('override_4'); setIsOverrideSheetOpen(false); }} className="py-4 rounded-2xl border-4 border-ink-primary bg-canvas text-ink-primary font-display font-bold uppercase tracking-widest shadow-solid-sm active:translate-y-[2px] active:shadow-none">Melt</button>
        </div>
        <button onClick={() => setIsOverrideSheetOpen(false)} className="mt-2 py-4 border-4 border-ink-primary/20 rounded-2xl font-display font-bold uppercase tracking-widest text-ink-primary/50 hover:bg-ink-primary/5">Cancel</button>
      </div>

      {isHostless && showPlayerControls && (
        <div className="fixed inset-0 z-[100000] bg-canvas overflow-y-auto">
          <ControllerView />
          <button onClick={() => setShowPlayerControls(false)} className="absolute top-6 left-6 z-[100001] bg-ink-primary text-canvas px-4 py-2 rounded-full font-meta text-sm font-bold shadow-xl border-2 border-canvas">Back to TV</button>
        </div>
      )}

      {isHostless && !showPlayerControls && (
        <button onClick={() => setShowPlayerControls(true)} className="fixed bottom-40 left-1/2 -translate-x-1/2 z-[90] px-8 py-4 bg-accent-dare text-canvas rounded-full font-meta font-bold uppercase tracking-widest shadow-2xl border-2 border-canvas shadow-solid-sm active:translate-y-[2px] whitespace-nowrap">
          Open Player Controls
        </button>
      )}
    </div>
  </ErrorBoundary>
  );
};



export const HostView: React.FC = () => {
  return (
    <ErrorBoundary>
      <HostViewInner />
    </ErrorBoundary>
  );
};
