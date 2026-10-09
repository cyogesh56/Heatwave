import re

with open("src/views/HostView.tsx", "r") as f:
    content = f.read()

# We need to replace the <main> block and the old overlays at the bottom.
# First, let's locate the <main> tag.
start_idx = content.find('<main className="flex-1 flex flex-col lg:flex-row')
if start_idx == -1:
    print("Could not find start")
    exit(1)

# The file ends with the `</ErrorBoundary>` and `); }`
# I'll just keep the bottom sheets and replace the whole block.
end_idx = content.find('</ErrorBoundary>')
if end_idx == -1:
    print("Could not find end")
    exit(1)

main_replacement = """<main className="flex-1 flex flex-col items-center justify-center p-6 pb-48 lg:p-12 relative z-0 w-full max-w-[1600px] mx-auto overflow-visible">
        {isHostless && showPlayerControls ? (
          <div className="w-full h-full flex flex-col items-center flex-1 min-h-0 relative -mx-6 px-6">
             <ControllerView 
                hideHeader 
                hidePowerDock 
                extraTopNode={
                  manualTimeTotal > 0 ? (
                    <div className="w-full max-w-md bg-surface-card rounded-3xl p-4 sm:p-6 border-4 border-ink-primary/20 shadow-solid flex flex-col items-center gap-2 sm:gap-4 my-2 sm:my-4 mx-auto shrink-0 z-[80]">
                      <h3 className="font-display font-black text-xs sm:text-sm uppercase tracking-widest text-ink-primary/70">Manual Timer</h3>
                      <div className="text-3xl sm:text-4xl font-meta font-bold text-accent-dare mb-1">
                        {Math.floor(manualTimeLeft / 60)}:{(manualTimeLeft % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="flex gap-2 sm:gap-4 w-full">
                        {manualTimeLeft === 0 ? (
                          <button onClick={() => { setManualTimeLeft(manualTimeTotal); setManualTimerActive(true); }} className="flex-1 py-1.5 sm:py-2 bg-ink-primary text-canvas rounded-xl font-display font-bold text-sm sm:text-base uppercase tracking-widest hover:bg-ink-primary/80">Restart</button>
                        ) : manualTimerActive ? (
                          <button onClick={() => setManualTimerActive(false)} className="flex-1 py-1.5 sm:py-2 border-4 border-ink-primary text-ink-primary rounded-xl font-display font-bold text-sm sm:text-base uppercase tracking-widest hover:bg-ink-primary/5">Pause</button>
                        ) : (
                          <button onClick={() => setManualTimerActive(true)} className="flex-1 py-1.5 sm:py-2 bg-accent-dare text-canvas rounded-xl font-display font-bold text-sm sm:text-base uppercase tracking-widest hover:bg-accent-dare/90">Start</button>
                        )}
                      </div>
                    </div>
                  ) : null
                }
             />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-4 sm:gap-8 lg:gap-16">
            {/* Left Side: Card */}
            <div className={`relative w-full lg:w-1/2 flex items-center justify-center shrink-0`}>
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
            
            {/* Mobile TV Toggle */}
            <div className="lg:hidden flex bg-surface-card border-2 border-ink-primary/20 rounded-full p-1 my-2 w-full max-w-sm shrink-0">
              <button onClick={() => setShowMobileResults(false)} className={`flex-1 py-2 rounded-full font-bold uppercase tracking-widest text-xs transition-colors ${!showMobileResults ? 'bg-ink-primary text-canvas shadow-md' : 'text-ink-primary/50'}`}>Question</button>
              <button onClick={() => setShowMobileResults(true)} className={`flex-1 py-2 rounded-full font-bold uppercase tracking-widest text-xs transition-colors ${showMobileResults ? 'bg-ink-primary text-canvas shadow-md' : 'text-ink-primary/50'}`}>Votes</button>
            </div>

            {/* Right Side: Reveal Area */}
            <div className={`w-full lg:w-1/2 flex items-center justify-center shrink-0 p-2 sm:p-8 min-h-[100px] ${!showMobileResults ? 'hidden lg:flex' : 'flex'}`}>
              {renderRevealArea()}
            </div>
            
            {/* Global Force Advance / Draw Next Card for TV mode Mobile */}
            <div className="lg:hidden w-full max-w-sm mt-2 shrink-0">
               {['kahoot', 'wrong_answers', 'consensus', 'vibe_poll', 'fill_blank'].includes(card.type) ? (
                 <button onClick={() => handleNextCard(false)} className="w-full py-4 bg-accent-dare text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-solid active:translate-y-[4px] active:shadow-none transition-all">
                   Draw Next Card
                 </button>
               ) : (
                 <button onClick={() => handleNextCard(false)} className="w-full py-4 bg-transparent border-4 border-ink-primary/20 text-ink-primary/40 font-display font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-ink-primary/5 transition-all">
                   Force Advance
                 </button>
               )}
            </div>
          </div>
        )}
      </main>

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
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(hostGameState?.players || {}).filter(([id]) => id !== (clientNode?.['playerId'] || '') && id !== 'host').map(([id, p]: any) => (
            <button key={id} onClick={() => setDeflectTarget(id)} className={`py-4 rounded-2xl border-4 ${deflectTarget === id ? 'border-accent-consensus bg-accent-consensus-fill' : 'border-ink-primary/20 bg-canvas'} font-display font-bold uppercase tracking-widest shadow-solid-sm`}>
              {p.name}
            </button>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
           <button onClick={() => setIsDeflectSheetOpen(false)} className="flex-1 py-4 border-4 border-ink-primary/20 rounded-2xl font-display font-bold uppercase tracking-widest text-ink-primary/50">Cancel</button>
           <button onClick={() => { if (deflectTarget) { handlePower(`deflect:${deflectTarget}`); setIsDeflectSheetOpen(false); } }} disabled={!deflectTarget} className="flex-1 py-4 bg-ink-primary text-canvas rounded-2xl font-display font-bold uppercase tracking-widest shadow-solid-sm disabled:opacity-50">Deflect</button>
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
    </div>
  """

new_content = content[:start_idx] + main_replacement + "\n" + content[end_idx:]

with open("src/views/HostView.tsx", "w") as f:
    f.write(new_content)

