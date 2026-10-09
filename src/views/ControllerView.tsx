import { useSyncTimer } from '../hooks/useSyncTimer';
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ChoiceGrid } from '../components/ui/ChoiceGrid';
import { PowerDock } from '../components/ui/PowerDock';
import { UniversalHeader } from '../components/ui/UniversalHeader';
import { IconZap, IconFlame, IconScale, IconEye } from '../components/icons';
import { PlayingCard } from '../components/ui/PlayingCard';
import { GamePopup } from '../components/ui/GamePopup';
import { motion, AnimatePresence } from 'framer-motion';




const AlertOverlay = ({ state, node }: { state: any, node: any }) => {
  const globalAlert = state?.uiAlert;
  const personalAlert = state?.players?.[node?.playerId]?.uiAlert;

  React.useEffect(() => {
    if (personalAlert || globalAlert) {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, [personalAlert, globalAlert]);
  
  if (!state || !node) return null;
  
  return (
    <div className="fixed top-32 left-0 right-0 z-[9999] flex items-start justify-center px-6 pointer-events-none">
       <AnimatePresence>
         {(globalAlert || personalAlert) && (
           <motion.div 
             initial={{ scale: 0.8, opacity: 0, y: -20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.8, opacity: 0, y: -20 }}
             transition={{ type: 'spring', stiffness: 400, damping: 15 }}
             className="w-full max-w-sm bg-surface-card text-ink-primary border-4 border-accent-dare rounded-2xl p-4 shadow-2xl text-center backdrop-blur-xl"
           >
              <h3 className="text-sm font-display font-black uppercase tracking-widest leading-snug">
                 {personalAlert || globalAlert}
              </h3>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

export interface ControllerViewProps {
  hideHeader?: boolean;
  hidePowerDock?: boolean;
  extraTopNode?: React.ReactNode;
}

export const ControllerView: React.FC<ControllerViewProps> = ({ hideHeader, hidePowerDock, extraTopNode }) => {
  const { clientState, clientNode, initClient } = useGame();
  const [isOverrideSheetOpen, setIsOverrideSheetOpen] = useState(false);
  const [isDeflectSheetOpen, setIsDeflectSheetOpen] = useState(false);
  const [deflectTarget, setDeflectTarget] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const timeLeft = useSyncTimer(clientState?.timers?.endsAt);

  React.useEffect(() => {
    if (clientState?.theme) {
      if (clientState.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [clientState?.theme]);

  
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const savedRoom = localStorage.getItem('handsy_room');
        const savedName = localStorage.getItem('handsy_name');
        if (savedRoom && savedName) {
           console.log('App became visible. Forcing reconnect...');
           if (clientNode) {
             clientNode.destroy();
           }
           initClient(savedRoom, savedName).catch(console.error);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial mount check
    if (!clientState && !clientNode) {
      const savedRoom = localStorage.getItem('handsy_room');
      const savedName = localStorage.getItem('handsy_name');
      if (savedRoom && savedName) {
        initClient(savedRoom, savedName).catch(() => {
           localStorage.removeItem('handsy_room');
           window.location.href = '/';
        });
      } else {
        window.location.href = '/';
      }
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clientState, clientNode, initClient]);


  // Dead Room Detector: If connected to channel but host never sends state
  React.useEffect(() => {
    let timeout: number;
    if (clientNode && !clientState) {
      timeout = window.setTimeout(() => {
        setPopupMessage("Session expired or host disconnected.");
      }, 7000); // 7 seconds grace period
    }
    return () => clearTimeout(timeout);
  }, [clientNode, clientState]);

  React.useEffect(() => {
    setSelectedChoice(null);
  }, [clientState?.currentCard?.card?.id]);

  React.useEffect(() => {
    if (clientState?.uiState === 'interstitial') {
      if (navigator.vibrate) navigator.vibrate(100);
    }
  }, [clientState?.uiState]);


  if (clientState?.uiState === 'ended') {
    return (
      <div className="min-h-[100dvh] bg-canvas text-ink-primary flex flex-col items-center justify-center p-6 md:p-12 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-black text-accent-dare mb-6 uppercase tracking-widest">Game Over</h1>
        <p className="text-lg sm:text-xl md:text-2xl font-body text-ink-primary/70 mb-12">The decks have run dry. The heat has subsided.</p>

        <button 
          onClick={() => window.location.href = '/'} 
          className="px-6 py-4 md:px-12 md:py-6 bg-ink-primary text-canvas font-display font-black text-xl md:text-2xl uppercase tracking-widest rounded-[2rem] shadow-solid hover:-translate-y-2 transition-all active:translate-y-[4px] active:shadow-none"
        >
          Return to Lobby
        </button>
      </div>
    );
  }

  if (clientState?.uiState === 'disconnected') {
    return (
      <div className="min-h-[100dvh] bg-canvas text-ink-primary flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-accent-dare mb-4 uppercase">Host Disconnected</h1>
        <p className="font-body text-ink-primary/70">The host closed the game or lost connection. Refresh to join a new room.</p>
      </div>
    );
  }
  if (!clientState || !clientState.currentCard) {
    const isReconnecting = !clientNode;
    return (
      <div className="min-h-[100dvh] bg-canvas text-ink-primary flex flex-col items-center justify-center p-6 md:p-8 text-center relative overflow-hidden">
        <GamePopup isOpen={!!popupMessage} title="Disconnected" message={popupMessage} confirmText="Return to Lobby" onConfirm={() => { localStorage.removeItem('handsy_room'); localStorage.removeItem('handsy_name'); window.location.href = '/'; }} accent="dare" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-5"></div>
        <div className="w-16 h-16 bg-surface-card rounded-2xl shadow-solid flex items-center justify-center border-4 border-ink-primary animate-bounce mb-8">
          <IconZap className="w-8 h-8 text-accent-truth" />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black uppercase tracking-widest">{isReconnecting ? "Reconnecting..." : "You're In."}</h1>
        <p className="font-meta text-ink-primary/50 mt-4 text-sm md:text-base uppercase tracking-widest font-bold">{isReconnecting ? "Jacking back into the session..." : "Look at the big screen. Wait for the Host to start."}</p>
      </div>
    );
  }

  


  const connectedPlayers = Object.values(clientState.players || {}).filter((p: any) => p.isConnected !== false);
  const disconnectedPlayers = Object.values(clientState.players || {}).filter((p: any) => p.isConnected === false);
  
  if (connectedPlayers.length < 2 && disconnectedPlayers.length > 0) {
     return (
        <div className={`min-h-[100dvh] w-full flex flex-col items-center justify-center ${clientState.interstitial?.color || 'bg-accent-dare'} text-canvas p-6 md:p-8 text-center`}>
           <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black uppercase tracking-widest mb-4">Game Paused</h1>
           <p className="text-lg sm:text-xl font-body opacity-90 mb-12">
              {disconnectedPlayers.map((p: any) => p.name).join(', ')} disconnected.<br/>Waiting for them to reconnect...
           </p>
           <button onClick={() => { setIsLeaving(true); window.location.href = '/'; }} className="px-6 py-4 md:px-8 bg-canvas text-accent-dare font-display font-black text-lg md:text-xl uppercase tracking-widest rounded-2xl shadow-solid active:translate-y-[4px] active:shadow-none transition-all">
             {isLeaving ? 'LEAVING...' : 'Leave Game'}
           </button>
        </div>
     );
  }


  if (clientState.uiState === 'interstitial' && clientState.interstitial) {
     return (
        <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 1.05 }}
         transition={{ type: 'spring', stiffness: 200, damping: 20 }}
         className={`min-h-[100dvh] w-full flex flex-col items-center justify-center ${clientState.interstitial.color || 'bg-accent-dare'} text-canvas p-6 md:p-8 text-center`}
       >
           <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black uppercase tracking-widest mb-4">{clientState.interstitial.title}</h1>
           <p className="text-lg sm:text-xl font-body opacity-90">{clientState.interstitial.subtitle}</p>
        </motion.div>
     );
  }

  if (!clientState.currentCard) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-canvas text-ink-primary p-8 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black uppercase tracking-widest mb-4 animate-pulse">Waiting for Host...</h1>
        <p className="font-body opacity-70">Look at the TV screen.</p>
      </div>
    );
  }
  
  const { card, parsedPrompt } = clientState.currentCard;
  

  const questionType = card.type === 'kahoot' ? 'wrong' : card.type;

  const handleVote = (choice: string) => {
    setSelectedChoice(choice);
    clientNode?.send({ type: 'vote', choice });
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handlePower = (power: string) => {
    clientNode?.send({ type: 'power', power });
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
  };

  const myOfficialName = clientState?.players?.[clientNode?.playerId || '']?.name || clientNode?.playerName || 'Player';

  return (
    <div className="relative w-full h-[100dvh] bg-canvas flex flex-col overflow-hidden text-ink-primary font-sans">
      <GamePopup isOpen={!!popupMessage} title="Disconnected" message={popupMessage} confirmText="Return to Lobby" onConfirm={() => { localStorage.removeItem('handsy_room'); localStorage.removeItem('handsy_name'); window.location.href = '/'; }} accent="dare" />
      <AlertOverlay state={clientState} node={clientNode} />
      
      {/* HEADER */}
      {!hideHeader && (
        <UniversalHeader
          leftNode={
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-ink-primary bg-accent-consensus-fill shadow-solid-sm" />
              <span className="font-display font-bold text-lg uppercase tracking-widest">{myOfficialName}</span>
            </div>
          }
        />
      )}
      
      {!hideHeader && disconnectedPlayers.length > 0 && (
        <div className="w-full bg-accent-dare text-canvas font-meta font-bold text-xs uppercase tracking-widest py-2 px-4 text-center animate-pulse">
           {disconnectedPlayers.map((p: any) => p.name).join(', ')} disconnected
        </div>
      )}
      
      {extraTopNode}

      
      

      {/* CONTEXT AREA */}
      <section className="shrink-0 pt-4 pb-2 px-6 flex flex-col items-center justify-center relative z-0 h-[35vh] sm:h-[40vh] max-h-[400px] w-full max-w-xl mx-auto">
        <PlayingCard prompt={parsedPrompt} type={card.type} index={clientState?.phase || 1} />
      </section>

      {/* ACTION ZONE (Massive target, clear hierarchy) */}
      <section className="flex-1 w-full max-w-xl mx-auto flex flex-col items-center justify-center p-6 gap-6 relative z-0">
        {clientState?.timers?.active && timeLeft > 0 && (
          <div className="absolute top-0 right-6 font-meta font-bold text-2xl text-ink-primary/50 animate-pulse">
             00:{timeLeft.toString().padStart(2, '0')}
          </div>
        )}
        
        {/* TIME UP STATE */}
        {clientState?.timers?.active && timeLeft <= 0 && !selectedChoice ? (
           <div className="w-full py-12 text-center text-2xl md:text-3xl lg:text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
             TIME UP
           </div>
        ) : questionType === 'wrong' || questionType === 'wrong_answers' || questionType === 'consensus' || questionType === 'vibe_poll' || questionType === 'kahoot' || questionType === 'fill_blank' ? (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex items-center gap-4">
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
              <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">
                {clientState.currentCard.assignedResponderName ? (clientState.currentCard.assignedResponderName === myOfficialName ? 'Guess Out Loud!' : 'Cast Your Vote') : 'Cast Your Vote'}
              </span>
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
            </div>
            {clientState.currentCard.assignedResponderName && clientState.currentCard.assignedResponderName === myOfficialName ? (
              <div className="w-full py-12 text-center text-2xl md:text-3xl lg:text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
                GUESS OUT LOUD
              </div>
            ) : selectedChoice ? (
              <div className="w-full py-12 text-center text-2xl md:text-3xl lg:text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
                VOTED
              </div>
            ) : (
              <ChoiceGrid 
                choices={card.options || ['A', 'B', 'C', 'D']} 
                selectedChoice={selectedChoice}
                onSelect={handleVote}
                accent={questionType === 'consensus' ? 'consensus' : 'wrong'}
              />
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            {questionType === 'dare' ? (
              <>
                <div className="w-full flex items-center gap-4">
                  <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                  <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Activity completed?</span>
                  <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                </div>
                <button 
                  onClick={() => handleVote('done')}
                  disabled={selectedChoice !== null}
                  className="w-full py-4 rounded-2xl bg-accent-dare border-4 border-ink-primary text-canvas font-display font-bold text-sm md:text-base uppercase tracking-widest shadow-solid active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
                >
                  {clientState?.revealCountdown ? `ADVANCING IN ${clientState.revealCountdown}...` : selectedChoice ? 'WAITING...' : 'DONE'}
                </button>
              </>
            ) : (
              <>
                <div className="w-full flex items-center gap-4 opacity-50">
                  <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                  <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Activity completed?</span>
                  <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                </div>
                <button 
                  onClick={() => handleVote('done')}
                  disabled={selectedChoice !== null}
                  className="w-full py-4 rounded-2xl bg-accent-dare border-4 border-ink-primary text-canvas font-display font-bold text-sm md:text-base uppercase tracking-widest shadow-solid active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
                >
                  {clientState?.revealCountdown ? `ADVANCING IN ${clientState.revealCountdown}...` : selectedChoice ? 'WAITING...' : 'DONE'}
                </button>
              </>
            )}
            
            {/* ANSWER A TRUTH INJECTION */}
            {parsedPrompt.toLowerCase().includes('answer a truth') && !selectedChoice && (
              <button 
                onClick={() => {
                  setSelectedChoice('fail'); clientNode?.send({ type: 'fail_truth' });
                }}
                className="mt-2 w-full py-6 rounded-2xl border-4 border-accent-truth text-accent-truth bg-canvas font-display font-black text-2xl uppercase tracking-widest active:bg-accent-truth/10 transition-all"
              >
                ANSWER A TRUTH
              </button>
            )}
          </div>
        )}
      </section>

      {/* POWER DOCK */}
      {!hidePowerDock && (
        <section className="shrink-0 relative z-50">
          <PowerDock 
            onDeflect={() => setIsDeflectSheetOpen(true)}
            onKillswitch={() => handlePower('killswitch')}
            onOverride={() => setIsOverrideSheetOpen(true)}
            inventory={clientState?.players?.[clientNode?.['playerId'] || '']?.inventory || { deflect: 0, killswitch: 0, override: 0 }}
          />
        </section>
      )}

      
      {/* DEFLECT SHEET */}
      <div className={`absolute bottom-0 left-0 w-full bg-surface-card rounded-t-[2rem] border-t-4 border-ink-primary shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 p-8 flex flex-col gap-6 ${isDeflectSheetOpen ? 'translate-y-0' : 'translate-y-[120%]'}`}>
        <div className="w-16 h-1.5 bg-ink-primary/20 rounded-full mx-auto" />
        <h3 className="text-center font-display font-black uppercase tracking-widest text-2xl text-ink-primary">Deflect to...</h3>
        <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
          {Object.entries(clientState?.players || {}).filter(([id]) => id !== clientNode?.['playerId']).map(([id, p]: any) => (
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
             Deflect!
           </button>
        </div>
      </div>

      {/* OVERRIDE SHEET */}
      <div className={`absolute bottom-0 left-0 w-full bg-surface-card rounded-t-[2rem] border-t-4 border-ink-primary shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 p-8 flex flex-col gap-6 ${isOverrideSheetOpen ? 'translate-y-0' : 'translate-y-[120%]'}`}>
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
        </div>
  );
};

