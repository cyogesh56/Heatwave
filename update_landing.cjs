const fs = require('fs');
let code = fs.readFileSync('src/views/Landing.tsx', 'utf-8');

const oldHost = `          <div 
            onClick={handleHost}
            className="flex-1 bg-surface-card border-4 border-accent-truth rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center cursor-pointer hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-accent-truth transition-transform group"  tabIndex={0} 
          >
            <div className="w-16 h-16 bg-accent-truth/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <IconFlame className="w-8 h-8 text-accent-truth" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-black mb-2 sm:mb-4">Host Room</h3>
            <p className="font-body text-sm sm:text-base text-ink-primary/60 font-medium px-2">Cast this to the big screen. The TV is the source of truth.</p>
          </div>`;

const newHost = `          <div 
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
          </div>`;

code = code.replace(oldHost, newHost);
fs.writeFileSync('src/views/Landing.tsx', code);
