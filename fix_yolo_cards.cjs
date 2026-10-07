const fs = require('fs');

const path = 'public/cards.json';
let cards = JSON.parse(fs.readFileSync(path, 'utf-8'));

for (let i = 0; i < cards.length; i++) {
  if (cards[i].id === 'card_nf_039') {
    cards[i].prompt = "What is the only valid reason to suddenly leave a group chat?";
  } else if (cards[i].id === 'card_nf_042') {
    cards[i].prompt = "What is your secret weekend side hustle?";
  } else if (cards[i].id === 'card_nf_047') {
    cards[i].options = [
      "You Obviously Love Ostriches",
      "Yelling Over Loud Owls",
      "Your Only Liability: Overdrafts",
      "Youths Organising Lame Outings"
    ];
  }
}

fs.writeFileSync(path, JSON.stringify(cards, null, 2));
