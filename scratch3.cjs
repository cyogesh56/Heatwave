const fs = require('fs');
const cards = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));

const badCards = cards.filter(c => {
  if (c.prompt.match(/\b(we|our|ours)\b/i)) {
    if (!c.prompt.includes('[Player A]') && !c.prompt.includes('[Player B]')) {
      return true;
    }
  }
  return false;
});

badCards.forEach(c => {
  console.log(c.id + ' : ' + c.prompt);
});
