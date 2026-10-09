      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-48 lg:p-12 relative z-0 w-full max-w-[1600px] mx-auto overflow-visible">
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
