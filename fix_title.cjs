const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  /<h3 className="text-xl font-meta uppercase tracking-widest text-ink-primary\/90">Consensus \(\{totalVotes\} votes\)<\/h3>/,
  `<h3 className="text-xl font-meta uppercase tracking-widest text-ink-primary/90">
            {card.type === 'vibe_poll' ? 'Vibe Poll' : 
             card.type === 'kahoot' || card.type === 'wrong_answers' ? 'Trivia & Chaos' : 
             'Consensus'} ({totalVotes} votes)
          </h3>`
);

fs.writeFileSync('src/views/HostView.tsx', code);
