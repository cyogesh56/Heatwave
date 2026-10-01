const fs = require('fs');

let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  /const percentage = totalVotes === 0 \? 0 : Math.round\(\(voteCount \/ totalVotes\) \* 100\);/,
  `const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
            
            const voters = Object.entries(votes)
              .filter(([id, v]) => v === opt)
              .map(([id]) => hostGameState.players[id]?.name)
              .filter(Boolean)
              .join(', ');`
);

code = code.replace(
  /\{percentage > 0 && <div className="absolute inset-0 bg-white\/20 w-full h-full animate-pulse"><\/div>\}/,
  `{percentage > 0 && <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>}
                    {voters && (
                      <div className="absolute inset-0 flex items-center px-4 overflow-hidden">
                        <span className="font-meta text-xs uppercase tracking-widest text-ink-dark font-bold truncate z-10">{voters}</span>
                      </div>
                    )}`
);

fs.writeFileSync('src/views/HostView.tsx', code);
