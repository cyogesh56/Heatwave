const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));
const friends = data.find(c => c.id === 'card_friends_001');
console.log(friends.decks);
