const fs = require('fs');
const cards = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));

const missing = cards.filter(c => c.type === 'kahoot' || c.type === 'fill_blank');
missing.forEach(c => {
  console.log(`${c.id} (${c.type}): ${c.prompt}`);
});
