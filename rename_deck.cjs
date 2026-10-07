const fs = require('fs');

const data = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));

let count = 0;
for (const card of data) {
  if (card.decks) {
    for (let i = 0; i < card.decks.length; i++) {
      if (card.decks[i] === 'base') {
        card.decks[i] = 'couples';
        count++;
      }
    }
  }
}

fs.writeFileSync('public/cards.json', JSON.stringify(data, null, 2));
console.log('Renamed', count, 'deck tags in cards.json');
