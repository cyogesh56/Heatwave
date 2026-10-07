const fs = require('fs');
let cards = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));

const prompts = {};
const duplicatesToFix = [];

for (const card of cards) {
  if (prompts[card.prompt]) {
    duplicatesToFix.push({
      id: card.id,
      prompt: card.prompt,
      options: card.options
    });
  } else {
    prompts[card.prompt] = card.id;
  }
}

console.log(JSON.stringify(duplicatesToFix, null, 2));
