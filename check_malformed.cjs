const fs = require('fs');
let cards = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));

for (const card of cards) {
  if (card.type === 'wrong_answers' || card.type === 'consensus' || card.type === 'kahoot') {
    if (!card.options || !Array.isArray(card.options) || card.options.length !== 4) {
      console.log(`MALFORMED CARD ${card.id}: Needs 4 options!`);
    }
  }
}
console.log('Done checking for malformed cards.');
