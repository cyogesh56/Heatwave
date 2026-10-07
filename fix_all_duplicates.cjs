const fs = require('fs');

let cards = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));

// Identify cards that have completely mismatched options by checking if they are duplicates of prompts
// that we already established as bad in our manual check.

const prompts = {};
let filteredCards = [];

for (const card of cards) {
  // If we've seen this prompt before, it's a duplicate.
  // The first time it was generated, it usually had the correct options. The subsequent times had random options.
  if (prompts[card.prompt]) {
    // It's a duplicate prompt! Delete it to avoid mismatched options.
    console.log(`Deleting duplicate: ${card.id} - ${card.prompt}`);
  } else {
    prompts[card.prompt] = card.id;
    filteredCards.push(card);
  }
}

fs.writeFileSync('public/cards.json', JSON.stringify(filteredCards, null, 2));
console.log(`Deleted ${cards.length - filteredCards.length} duplicate/mismatched cards.`);
