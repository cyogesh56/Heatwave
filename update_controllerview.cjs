const fs = require('fs');
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

// The massive action zone replacement
const actionZone = `
      {/* ACTION ZONE */}
      <section className="flex-1 w-full max-w-xl mx-auto flex flex-col items-center justify-center p-6 gap-6 relative z-0">
        {clientState?.revealCountdown ? (
           <div className="w-full py-12 text-center text-4xl font-display font-black bg-accent-truth text-canvas shadow-solid animate-pulse uppercase tracking-widest rounded-3xl">
             ADVANCING IN {clientState.revealCountdown}...
           </div>
        ) : clientState?.timers?.active && timeLeft <= 0 && !selectedChoice ? (
           <div className="w-full py-12 text-center text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
             TIME UP
           </div>
        ) : questionType === 'wrong' || questionType === 'wrong_answers' || questionType === 'consensus' || questionType === 'vibe_poll' || questionType === 'kahoot' ? (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex items-center gap-4">
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
              <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Cast Your Vote</span>
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
            </div>
            {selectedChoice ? (
              <div className="w-full py-12 text-center text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
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
              (() => {
                 const targets = clientState?.currentCard?.targetedPlayers || [];
                 const isTarget = targets.includes(clientNode?.['playerName']);
                 
                 if (clientState.juryState?.active) {
                    if (isTarget) {
                       return (
                         <div className="w-full py-12 text-center text-3xl font-display font-bold text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
                           WAITING FOR JURY...
                         </div>
                       );
                    } else {
                       const myJuryVote = clientState.juryState.votes[clientNode!['playerId']];
                       if (myJuryVote) {
                          return (
                            <div className="w-full py-12 text-center text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
                              VOTED {myJuryVote.toUpperCase()}
                            </div>
                          );
                       }
                       return (
                         <>
                           <div className="w-full flex items-center gap-4">
                             <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                             <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Did they do it?</span>
                             <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                           </div>
                           <div className="flex gap-4 w-full">
                             <button onClick={() => clientNode?.send({ type: 'jury_vote', vote: 'yes' })} className="flex-1 py-8 rounded-2xl bg-accent-wrong text-canvas font-display font-black text-3xl shadow-solid active:translate-y-1 active:shadow-none">YES</button>
                             <button onClick={() => clientNode?.send({ type: 'jury_vote', vote: 'no' })} className="flex-1 py-8 rounded-2xl bg-accent-dare text-canvas font-display font-black text-3xl shadow-solid active:translate-y-1 active:shadow-none">NO</button>
                           </div>
                         </>
                       );
                    }
                 } else {
                    if (isTarget) {
                       return (
                         <button 
                           onClick={() => clientNode?.send({ type: 'did_it' })}
                           className="w-full py-8 rounded-2xl bg-accent-dare border-4 border-ink-primary text-canvas font-display font-black text-3xl uppercase tracking-widest shadow-solid active:translate-y-1 active:shadow-none transition-all"
                         >
                           I DID IT
                         </button>
                       );
                    } else {
                       return (
                         <div className="w-full py-12 text-center text-3xl font-display font-bold text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
                           WAITING FOR {targets.join(' & ')}...
                         </div>
                       );
                    }
                 }
              })()
            ) : (
              (() => {
                 const isReady = clientState.readyPlayers?.includes(clientNode!['playerId']);
                 if (isReady) {
                    return (
                      <div className="w-full py-12 text-center text-3xl font-display font-bold text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
                        WAITING FOR OTHERS...
                      </div>
                    );
                 }
                 return (
                   <>
                     <div className="w-full flex items-center gap-4">
                       <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                       <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Activity completed?</span>
                       <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                     </div>
                     <button 
                       onClick={() => clientNode?.send({ type: 'ready' })}
                       className="w-full py-8 rounded-2xl bg-ink-primary border-4 border-ink-primary text-canvas font-display font-black text-2xl uppercase tracking-widest shadow-solid active:translate-y-1 active:shadow-none transition-all"
                     >
                       READY TO MOVE ON
                     </button>
                   </>
                 );
              })()
            )}
            
            {/* ANSWER A TRUTH INJECTION */}
            {parsedPrompt.toLowerCase().includes('answer a truth') && !selectedChoice && !clientState.revealCountdown && (
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
`;

cv = cv.replace(/\{\/\* ACTION ZONE \*\/\}[^]+?(?=\{\/\* POWER DOCK \*\/\})/g, actionZone);

fs.writeFileSync('src/views/ControllerView.tsx', cv);
console.log('ControllerView updated');
