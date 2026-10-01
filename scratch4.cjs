const fs = require('fs');
const cards = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));

const badCards = cards.filter(c => {
  if (c.prompt.match(/\b(you|your|yours|yourself)\b/i)) {
    if (!c.prompt.includes('[Player A]') && !c.prompt.includes('[Player B]')) {
      // Truth and dare cards might be fine with "you" if the game targets a player and asks them directly,
      // but the game engine parses `[Player A]` to target them. Wait, if it says "What is your secret?", who is being asked?
      // In Heatwave, cards are displayed on the host screen. If it says "What is your secret?", the players wouldn't know WHOSE secret it is!
      return true;
    }
  }
  return false;
});

badCards.forEach(c => {
  console.log(c.id + ' : ' + c.prompt);
});
