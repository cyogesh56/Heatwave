const fs = require('fs');

const path = 'public/cards.json';
const cards = JSON.parse(fs.readFileSync(path, 'utf-8'));

const fixes = {
  'card_nf_058': ["Playing videos out loud", "Clipping your nails", "Eating smelly food", "Taking up two seats"],
  'card_nf_063': ["Adding someone without asking", "Sending 10 rapid-fire texts", "Leaving a 3-minute voice note", "Reading and never replying"],
  'card_nf_075': ["1-5 is plenty", "10-20 (Jungle mode)", "If you can't walk, it's too many", "There is no limit"],
  'card_nf_086': ["Immediately in the car", "Within 10 minutes", "Up to 30 minutes", "They are good cold too"],
  'card_nf_090': ["Wearing white", "Proposing to someone else", "Getting blackout drunk", "Complaining about the food"],
  'card_nf_098': ["Talking only about yourself", "Being rude to the waiter", "Checking your phone constantly", "Mentioning your ex 5 times"]
};

for (const card of cards) {
  if (fixes[card.id]) {
    card.options = fixes[card.id];
  }
}

fs.writeFileSync(path, JSON.stringify(cards, null, 2));
