const fs = require('fs');

const data = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));

let count = 0;
for (const card of data) {
  if (card.id && card.id.includes('card_base_')) {
    card.id = card.id.replace('card_base_', 'card_couples_');
    count++;
  }
}

fs.writeFileSync('public/cards.json', JSON.stringify(data, null, 2));
console.log('Renamed', count, 'card IDs in cards.json');
