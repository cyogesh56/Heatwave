const fs = require('fs');
const cards = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));
const base = cards.filter(c => c.decks.includes('base'));
console.log('Total base:', base.length);
console.log('Phase 1:', base.filter(c => c.phase === 1).length);
console.log('Phase 2:', base.filter(c => c.phase === 2).length);
console.log('Phase 3:', base.filter(c => c.phase === 3).length);
console.log('Phase 4:', base.filter(c => c.phase === 4).length);
