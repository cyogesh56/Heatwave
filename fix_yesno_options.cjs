const fs = require('fs');

const path = 'public/cards.json';
const cards = JSON.parse(fs.readFileSync(path, 'utf-8'));

const fixes = {
  'card_nf_053': ["1 bite", "1 minute", "5 minutes", "Save some for later"],
  'card_nf_055': ["1 is too many", "3", "5+", "When there's no room for my phone"],
  'card_nf_069': ["1 is enough", "3 max", "5-10 every morning", "My whole screen is alarms"],
  'card_nf_073': ["Diagonally (The only way)", "Horizontally", "Into 4 squares", "I don't cut it"],
  'card_nf_076': ["Reclining your seat", "Taking off your shoes", "Clapping when it lands", "Hogging both armrests"],
  'card_nf_081': ["Ghosting", "Being rude to staff", "Talking about an ex", "Chewing with mouth open"],
  'card_nf_094': ["The Irish Goodbye (0 mins)", "5 minutes", "15 minutes", "The 1-hour doorway chat"],
  'card_nf_097': ["Folding laundry", "Washing dishes", "Vacuuming", "Cleaning the bathroom"]
};

for (const card of cards) {
  if (fixes[card.id]) {
    card.options = fixes[card.id];
  }
}

fs.writeFileSync(path, JSON.stringify(cards, null, 2));
