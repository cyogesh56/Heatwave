const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');
const lines = code.split('\n');

// Find rightNode={
const rightNodeIdx = lines.findIndex(l => l.includes('rightNode={'));
if (rightNodeIdx !== -1) {
  // Find button opening
  const btnOpenIdx = lines.findIndex((l, i) => i > rightNodeIdx && l.includes('<button'));
  // Find End Game closing
  const btnCloseIdx = lines.findIndex((l, i) => i > btnOpenIdx && l.includes('</button>'));
  
  lines.splice(btnOpenIdx, btnCloseIdx - btnOpenIdx + 1, 
`          <button 
            onClick={() => setConfirmEndGame(true)}
            className="font-meta font-bold text-sm tracking-widest uppercase text-accent-dare hover:bg-accent-dare/10 px-4 py-2 rounded-xl transition-colors"
          >
            End Game
          </button>`);
}

fs.writeFileSync('src/views/HostView.tsx', lines.join('\n'));
