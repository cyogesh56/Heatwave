import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useGame } from '../context/GameContext';
import { Card } from '../lib/engine/stateMachine';
import { IconZap } from '../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalHeader } from '../components/ui/UniversalHeader';
import { GamePopup } from '../components/ui/GamePopup';

const DECKS = [
  { id: 'base', name: 'The Base Journey', desc: 'The classic experience. Deep questions, absurd dares, and high-tension consensus.' },
  { id: 'new_friends', name: 'New Friends', desc: 'Icebreakers and low-stakes petty debates. Perfect for acquaintances.' },
  { id: 'first_date', name: 'First Date', desc: 'Innocent touch barriers and getting to know each other. No heavy baggage.' },
  { id: 'polyamory', name: 'The Polycule', desc: 'Group dynamics, compersion, and multi-person physical dares.' },
  { id: 'after_dark', name: 'After Dark', desc: 'High heat, power dynamics, and uninhibited fantasies. Adults only.' }
];

export default function LobbyView() {
  const navigate = useNavigate();
  const { hostServer, hostGameState, setHostGameState, startGame, isHost } = useGame();
  const [selectedDecks, setSelectedDecks] = useState<string[]>(['base']);
  const [step, setStep] = useState<'connect' | 'decks' | 'rules'>('connect');
  const [popupMessage, setPopupMessage] = useState('');
  const [chaosMode, setChaosMode] = useState(false);
  const [chillMode, setChillMode] = useState(false);

  if (!isHost || !hostServer) {
    return <div className="p-8 text-ink-primary bg-canvas min-h-[100dvh]">Not a host. <button onClick={() => step === 'rules' ? setStep('decks') : (step === 'decks' ? setStep('connect') : navigate('/'))}>Go back</button></div>;
  }

  const roomCode = hostServer.roomCode;
  const joinUrl = `https://handsy.party/play?room=${roomCode}`;
  const connectedPlayers = Object.values(hostGameState?.players || {});

  const toggleDeck = (id: string) => {
    setSelectedDecks(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleStart = async () => {
    const res = await fetch('/cards.json');
    const allCards: Card[] = await res.json();
    
    // Filter the cards mathematically to only those belonging to the selected decks
    const filteredCards = allCards.filter(card => 
      card.decks && card.decks.some(d => selectedDecks.includes(d))
    );

    if (filteredCards.length === 0) {
      setPopupMessage("No cards found for the selected decks! Please select different decks.");
      return;
    }
    
    startGame(filteredCards);
    navigate('/host');
  };

  return (
    <div className="min-h-[100dvh] bg-canvas transition-colors duration-700 flex flex-col text-ink-primary relative overflow-hidden">
      <GamePopup isOpen={!!popupMessage} title="Empty Deck" message={popupMessage} onConfirm={() => setPopupMessage('')} accent="wrong" />
      
      <audio src="/saavane-sensual-music-390794.mp3" autoPlay loop muted={false} />
      <UniversalHeader 
        leftNode={<button onClick={() => step === 'rules' ? setStep('decks') : step === 'decks' ? setStep('connect') : navigate('/')} className="font-meta uppercase tracking-widest text-ink-primary/60 hover:text-ink-primary">← Back</button>}
        rightNode={<div className="font-meta uppercase tracking-widest text-xs sm:text-sm font-bold text-ink-primary/40 shrink-0">Step {step === 'connect' ? '1' : step === 'decks' ? '2' : '3'} of 3</div>}
      />
      <div className="flex-1 w-full flex flex-col p-6 lg:p-8 overflow-y-auto">
        <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-widest text-center mb-8">Handsy Setup</h1>

      <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col h-full">
        
        {step === 'connect' && (
          <div className="flex-1 flex flex-col items-center gap-8 w-full justify-center">
            <div className="bg-surface-card w-full max-w-sm p-6 sm:p-8 rounded-[2rem] shadow-solid border-4 border-ink-primary/10 flex flex-col items-center relative">
              <h2 className="font-meta font-bold uppercase tracking-widest text-ink-primary/50 mb-4 text-xs sm:text-sm">Scan to Join</h2>
              <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-inner border border-ink-primary/5 mb-6">
                <QRCodeSVG value={joinUrl} size={160} />
              </div>
              <div className="text-5xl sm:text-6xl font-mono tracking-[0.2em] font-black">{roomCode}</div>
              <p className="font-body text-ink-primary/50 mt-2 font-medium">handsy.party</p>
            </div>

            <div className="w-full max-w-sm flex-1 flex flex-col justify-end">
              <button 
                onClick={() => setStep('decks')}
                disabled={connectedPlayers.length < 2}
                className="w-full py-5 bg-accent-consensus text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:scale-95"
              >
                {connectedPlayers.length < 2 ? 'Waiting for players...' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {step === 'decks' && (
          <div className="flex-1 w-full flex flex-col">
            
            
            <h2 className="font-meta font-bold uppercase tracking-widest text-ink-primary/50 mb-4 text-sm">Mix Your Vibe (Select Multiple)</h2>
            
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto p-2 -mx-2 pb-6">
              {DECKS.map(deck => {
                const isSelected = selectedDecks.includes(deck.id);
                return (
                  <div 
                    key={deck.id}
                    onClick={() => toggleDeck(deck.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 shadow-solid-sm hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-accent-consensus ${isSelected ? "bg-accent-consensus-fill border-ink-primary text-ink-dark" : "bg-surface-card border-ink-primary/20 text-ink-primary"}`} role="checkbox" aria-checked={isSelected} tabIndex={0}
                  >
                    <div className={`w-6 h-6 shrink-0 rounded border-2 mt-1 flex items-center justify-center ${isSelected ? 'border-ink-primary bg-ink-primary text-white' : 'border-ink-primary/30'}`}>
                      {isSelected && <IconZap className="w-4 h-4 text-accent-consensus-fill" />}
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg sm:text-xl">{deck.name}</h3>
                      <p className={`font-body text-xs sm:text-sm mt-1 ${isSelected ? 'text-ink-dark/80' : 'text-ink-primary/60'}`}>{deck.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-full shrink-0 pt-4">
              <button 
                onClick={() => setStep('rules')}
                disabled={selectedDecks.length === 0}
                className="w-full py-5 bg-accent-truth text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:scale-95"
              >
                Configure Rules
              </button>
            </div>
          </div>
        )}
        
        
        {step === 'rules' && (
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 max-w-2xl mx-auto w-full pt-4 pb-2">
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-widest mb-2">House Rules</h2>
            <p className="font-body text-ink-primary/70 mb-6 sm:mb-8 font-medium">Customize the chaos, or just play vanilla.</p>
            
            <div className="flex flex-col gap-4 mb-8">
               <div onClick={() => setChaosMode(!chaosMode)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm ${chaosMode ? 'bg-accent-dare-fill border-ink-primary text-ink-dark' : 'bg-surface-card border-ink-primary/20 text-ink-primary'}`}>
                 <div className="flex flex-col">
                   <span className="font-display font-black uppercase tracking-widest text-lg">Chaos Mode</span>
                   <span className="font-body text-sm opacity-80">3x more likely to drop Powers.</span>
                 </div>
                 <div className={`w-12 h-6 rounded-full border-2 ${chaosMode ? 'bg-ink-primary border-ink-primary' : 'bg-transparent border-ink-primary/30'} flex items-center p-1 transition-all`}>
                   <div className={`w-4 h-4 rounded-full bg-surface-card transition-all ${chaosMode ? 'translate-x-6' : 'translate-x-0 bg-ink-primary/30'}`}/>
                 </div>
               </div>
               
               <div onClick={() => setChillMode(!chillMode)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm ${chillMode ? 'bg-accent-consensus-fill border-ink-primary text-ink-dark' : 'bg-surface-card border-ink-primary/20 text-ink-primary'}`}>
                 <div className="flex flex-col">
                   <span className="font-display font-black uppercase tracking-widest text-lg">Chill Mode</span>
                   <span className="font-body text-sm opacity-80">Disables all countdown timers.</span>
                 </div>
                 <div className={`w-12 h-6 rounded-full border-2 ${chillMode ? 'bg-ink-primary border-ink-primary' : 'bg-transparent border-ink-primary/30'} flex items-center p-1 transition-all`}>
                   <div className={`w-4 h-4 rounded-full bg-surface-card transition-all ${chillMode ? 'translate-x-6' : 'translate-x-0 bg-ink-primary/30'}`}/>
                 </div>
               </div>
            </div>
            
            <div className="mt-auto">
              <button 
                onClick={() => {
                  setHostGameState((prev: any) => prev ? { ...prev, settings: { chaosMode, chillMode } } : prev);
                  handleStart();
                }}
                className="w-full py-5 bg-ink-primary text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95"
              >
                {chaosMode || chillMode ? 'Launch Custom Game' : 'Play Default Rules'}
              </button>
            </div>
          </div>
        )}
        
        {/* Persistent Connected Players Dock */}
        <div className="w-full mt-6 bg-ink-primary/5 p-5 sm:p-6 rounded-3xl border border-ink-primary/5 shrink-0">
          <h3 className="font-meta text-xs uppercase tracking-widest font-bold mb-3 text-ink-primary/50">Lobby ({connectedPlayers.length}/4)</h3>
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {connectedPlayers.length === 0 ? (
              <div className="text-ink-primary/40 font-bold italic font-body text-sm sm:text-base">Waiting for players...</div>
            ) : (
              <AnimatePresence>
                {connectedPlayers.map((p, i) => (
                  <motion.div 
                    key={p.name} // using name as key instead of index for stable animations
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-surface-card rounded-full shadow-solid-sm border-2 border-ink-primary/20 font-bold font-body text-sm sm:text-base"
                  >
                    {p.name}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}
