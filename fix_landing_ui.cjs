const fs = require('fs');
let code = fs.readFileSync('src/views/Landing.tsx', 'utf-8');

const target = `<div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
          <div 
            onClick={() => { sessionStorage.setItem('hostlessMode', 'false'); handleHost(); }}
            className="flex-1 bg-surface-card border-4 border-accent-truth rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center cursor-pointer hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-accent-truth transition-transform group"  tabIndex={0} 
          >
            <div className="w-16 h-16 bg-accent-truth/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-accent-truth" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-black mb-2 sm:mb-4">TV Host</h3>
            <p className="font-body text-sm sm:text-base text-ink-primary/60 font-medium px-2">Cast this to the big screen. The TV is the source of truth.</p>
          </div>
          
          <div 
            onClick={() => { sessionStorage.setItem('hostlessMode', 'true'); handleHost(); }}
            className="flex-1 bg-surface-card border-4 border-accent-dare rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center cursor-pointer hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-accent-dare transition-transform group"  tabIndex={0} 
          >
            <div className="w-16 h-16 bg-accent-dare/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <IconFlame className="w-8 h-8 text-accent-dare" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-black mb-2 sm:mb-4">On The Go</h3>
            <p className="font-body text-sm sm:text-base text-ink-primary/60 font-medium px-2">Host and play simultaneously from this phone.</p>
          </div>

          <div 
            onClick={() => setStep('join')}
            className="flex-1 bg-surface-card border-4 border-accent-consensus rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center cursor-pointer hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-accent-consensus transition-transform group"  tabIndex={0} 
          >
            <div className="w-16 h-16 bg-accent-consensus/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <IconZap className="w-8 h-8 text-accent-consensus" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-black mb-2 sm:mb-4">Join Game</h3>
            <p className="font-body text-sm sm:text-base text-ink-primary/60 font-medium px-2">Use your phone as a dumb controller to vote and sabotage.</p>
          </div>
        </div>`;

const replacement = `<div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
           
           {/* HOST SECTION */}
           <div className="flex-1 flex flex-col gap-4">
              <h3 className="font-meta uppercase tracking-widest text-ink-primary/50 font-bold text-sm mb-2 text-center md:text-left">Create a Room</h3>
              <div 
                onClick={() => { sessionStorage.setItem('hostlessMode', 'false'); handleHost(); }}
                className="bg-surface-card border-4 border-accent-truth rounded-3xl p-6 flex items-center text-left cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent-truth transition-all group shadow-solid-sm"  tabIndex={0} 
              >
                <div className="w-14 h-14 bg-accent-truth/10 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                  <svg className="w-7 h-7 text-accent-truth" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
                </div>
                <div>
                  <h3 className="text-xl font-display font-black mb-1">TV Host</h3>
                  <p className="font-body text-sm text-ink-primary/60 font-medium leading-snug">Cast to a big screen. TV is the source of truth.</p>
                </div>
              </div>
              
              <div 
                onClick={() => { sessionStorage.setItem('hostlessMode', 'true'); handleHost(); }}
                className="bg-surface-card border-4 border-accent-dare rounded-3xl p-6 flex items-center text-left cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent-dare transition-all group shadow-solid-sm"  tabIndex={0} 
              >
                <div className="w-14 h-14 bg-accent-dare/10 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                  <IconFlame className="w-7 h-7 text-accent-dare" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black mb-1">On The Go</h3>
                  <p className="font-body text-sm text-ink-primary/60 font-medium leading-snug">Host and play directly from this phone.</p>
                </div>
              </div>
           </div>

           {/* JOIN SECTION */}
           <div className="flex-1 flex flex-col gap-4">
              <h3 className="font-meta uppercase tracking-widest text-ink-primary/50 font-bold text-sm mb-2 text-center md:text-left">Join a Room</h3>
              <div 
                onClick={() => setStep('join')}
                className="flex-1 bg-surface-card border-4 border-accent-consensus rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent-consensus transition-all group shadow-solid-sm min-h-[160px]"  tabIndex={0} 
              >
                <div className="w-16 h-16 bg-accent-consensus/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <IconZap className="w-8 h-8 text-accent-consensus" />
                </div>
                <h3 className="text-2xl font-display font-black mb-2">Join Game</h3>
                <p className="font-body text-sm text-ink-primary/60 font-medium px-4">Use your phone as a controller to vote and sabotage.</p>
              </div>
           </div>

        </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/views/Landing.tsx', code);
