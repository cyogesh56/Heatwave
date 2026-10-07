const fs = require('fs');
let cards = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));

const prompts = {};
let duplicates = 0;

for (const card of cards) {
  if (prompts[card.prompt]) {
    console.log(`Duplicate prompt found: "${card.prompt}"`);
    console.log(` - ID 1: ${prompts[card.prompt]}`);
    console.log(` - ID 2: ${card.id}`);
    duplicates++;
  } else {
    prompts[card.prompt] = card.id;
  }
}

if (duplicates === 0) {
  console.log("No more duplicate prompts found!");
}
