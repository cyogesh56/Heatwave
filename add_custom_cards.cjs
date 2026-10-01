const fs = require('fs');

const cardsFile = 'public/cards.json';
let cards = JSON.parse(fs.readFileSync(cardsFile, 'utf8'));

const newCards = [
  {
    "id": "card_custom_001",
    "phase": 4,
    "type": "truth",
    "prompt": "[Player A], what is a specific fantasy or kink you've been harboring that remains completely unfulfilled?",
    "decks": ["after_dark", "base"]
  },
  {
    "id": "card_custom_002",
    "phase": 3,
    "type": "truth",
    "prompt": "[Player A], look right at [Player B]. Describe the absolute sexiest, most elevated version of them that you can imagine them becoming.",
    "decks": ["base"]
  },
  {
    "id": "card_custom_003",
    "phase": 3,
    "type": "truth",
    "prompt": "[Player A], confess a specific time you were overwhelmingly turned on, but the universe completely cockblocked you.",
    "decks": ["after_dark"]
  },
  {
    "id": "card_custom_004",
    "phase": 4,
    "type": "dare",
    "prompt": "[Player A], pull out your phone. Find a photo of a person—strictly not your partner—who instantly turns you on, and show the room.",
    "decks": ["after_dark", "polyamory"]
  },
  {
    "id": "card_custom_005",
    "phase": 3,
    "type": "consensus",
    "prompt": "Everyone, check your screens. If you had to lock in one adult genre for the rest of your life, which are you choosing?",
    "options": ["Amateur/Homemade", "Passionate/Romantic", "Vintage/Classic", "POV/Immersive"],
    "decks": ["after_dark"]
  },
  {
    "id": "card_custom_006",
    "phase": 4,
    "type": "dare",
    "prompt": "[Player A], close your eyes, tilt your head back, and let out your most genuine, authentic moan for the room.",
    "decks": ["after_dark"]
  },
  {
    "id": "card_custom_007",
    "phase": 1,
    "type": "wrong_answers",
    "prompt": "Vote on your phones: What is the most unhinged thing you could say to BOTH your dog and your partner in bed?",
    "options": ["Come here, boy.", "Don't bite so hard!", "Do you want a treat?", "Get off the couch!"],
    "decks": ["new_friends", "base"]
  },
  {
    "id": "card_custom_008",
    "phase": 2,
    "type": "truth",
    "prompt": "[Player A], if a scandalous nude photo of you leaked to the internet tomorrow, what exact pose or bizarre activity would you be caught doing?",
    "decks": ["base"]
  },
  {
    "id": "card_custom_009",
    "phase": 4,
    "type": "dare",
    "prompt": "[Player A], you have exactly 30 seconds. Text the person to your left your most intense, unapologetic fantasy. Do not say a single word out loud.",
    "decks": ["after_dark", "polyamory"]
  },
  {
    "id": "card_custom_010",
    "phase": 2,
    "type": "truth",
    "prompt": "[Player A], if you were handed a zero-consequences, one-night hall pass with any celebrity in the world, who are you instantly cashing it in for?",
    "decks": ["base", "just_friends"]
  }
];

// Append to the beginning or end? End is fine.
cards = cards.concat(newCards);

fs.writeFileSync(cardsFile, JSON.stringify(cards, null, 2));
console.log(`Successfully added ${newCards.length} custom cards.`);
