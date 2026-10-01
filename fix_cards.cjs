const fs = require('fs');
let cards = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));

const replacements = {
  "card_nf_142": "I would sell my soul for a lifetime supply of ______.",
  "card_nf_143": "My biggest irrational fear is ______.",
  "card_nf_144": "If I were a ghost, I would haunt people by ______.",
  "card_nf_146": "My autobiography would be titled: 'The Art of ______.'",
  "card_nf_147": "I can't be trusted in a store that sells ______.",
  "card_nf_148": "The most useless skill I possess is ______.",
  "card_nf_150": "If I were a cryptid, I would be known as ______.",
  "card_nf_151": "My ideal Friday night involves absolutely zero ______.",
  "card_nf_152": "The quickest way to my heart is ______.",
  "card_nf_153": "I judge people silently if they ______.",
  "card_nf_155": "My spirit animal is a very confused ______.",
  "card_nf_156": "The one thing I refuse to share is ______.",
  "card_nf_157": "If I had a warning label, it would say: 'Beware of ______.'",
  "card_nf_159": "My signature dance move is called 'The ______.'",
  "card_nf_161": "I would be a terrible superhero because my weakness is ______.",
  "card_nf_162": "The weirdest thing in my search history is ______.",
  "card_nf_163": "My fallback career plan is professional ______.",
  "card_nf_165": "If my pet could talk, they would probably say ______.",
  "card_nf_167": "I instantly lose respect for someone when they ______.",
  "card_nf_169": "I am oddly superstitious about ______.",
  "card_nf_171": "My hidden talent is identifying ______.",
  "card_nf_172": "The one thing I always forget to pack is ______.",
  "card_nf_173": "My dream vacation involves absolutely no ______.",
  "card_nf_175": "I am currently addicted to ______.",
  
  "card_nf_176": "What is the most embarrassing thing you've ever Googled?",
  "card_nf_177": "What is your weirdest recurring dream?",
  "card_nf_178": "What is the dumbest thing you believed as a child?",
  "card_nf_179": "What is a food combination you love but everyone else hates?",
  "card_nf_180": "What is the most irrational fear you have?",
  "card_nf_181": "What is a conspiracy theory you kind of believe?",
  "card_nf_182": "What is the most awkward encounter you've had with a stranger?",
  "card_nf_183": "What is your most toxic trait when playing board games?",
  "card_nf_184": "What is the weirdest habit you have when you're alone?",
  "card_nf_185": "What is the pettiest reason you stopped talking to someone?",
  "card_nf_186": "What is the most useless piece of trivia you know?",
  "card_nf_187": "What is the worst fashion choice you've ever made?",
  "card_nf_188": "What is a movie you secretly love but pretend to hate?",
  "card_nf_189": "What is the longest rabbit hole you've gone down on the internet?",
  "card_nf_190": "What is a popular trend you completely missed out on?",
  "card_nf_191": "What is the most awkward thing you've said to a teacher or boss?",
  "card_nf_192": "What is a household chore you absolutely refuse to do?",
  "card_nf_193": "What is the most embarrassing phase you went through?",
  "card_nf_194": "Speak in a terrible British accent until it's your turn again.",
  "card_nf_195": "Show everyone the last photo you took on your phone.",
  "card_nf_196": "Do your best impression of another player for 30 seconds.",
  "card_nf_197": "Text a random emoji to the 5th person in your contacts.",
  "card_nf_198": "Attempt to juggle three items of your choice.",
  "card_nf_199": "Sing everything you want to say for the next 2 minutes.",
  "card_nf_200": "Balance a spoon on your nose for 10 seconds."
};

const fixed = {
  "card_nf_142": "[Player A] would sell their soul for a lifetime supply of ______.",
  "card_nf_143": "[Player A]'s biggest irrational fear is ______.",
  "card_nf_144": "If [Player A] were a ghost, they would haunt people by ______.",
  "card_nf_146": "[Player A]'s autobiography would be titled: 'The Art of ______.'",
  "card_nf_147": "[Player A] can't be trusted in a store that sells ______.",
  "card_nf_148": "The most useless skill [Player A] possesses is ______.",
  "card_nf_150": "If [Player A] were a cryptid, they would be known as ______.",
  "card_nf_151": "[Player A]'s ideal Friday night involves absolutely zero ______.",
  "card_nf_152": "The quickest way to [Player A]'s heart is ______.",
  "card_nf_153": "[Player A] judges people silently if they ______.",
  "card_nf_155": "[Player A]'s spirit animal is a very confused ______.",
  "card_nf_156": "The one thing [Player A] refuses to share is ______.",
  "card_nf_157": "If [Player A] had a warning label, it would say: 'Beware of ______.'",
  "card_nf_159": "[Player A]'s signature dance move is called 'The ______.'",
  "card_nf_161": "[Player A] would be a terrible superhero because their weakness is ______.",
  "card_nf_162": "The weirdest thing in [Player A]'s search history is ______.",
  "card_nf_163": "[Player A]'s fallback career plan is professional ______.",
  "card_nf_165": "If [Player A]'s pet could talk, they would probably say ______.",
  "card_nf_167": "[Player A] instantly loses respect for someone when they ______.",
  "card_nf_169": "[Player A] is oddly superstitious about ______.",
  "card_nf_171": "[Player A]'s hidden talent is identifying ______.",
  "card_nf_172": "The one thing [Player A] always forgets to pack is ______.",
  "card_nf_173": "[Player A]'s dream vacation involves absolutely no ______.",
  "card_nf_175": "[Player A] is currently addicted to ______.",
  
  "card_nf_176": "What is the most embarrassing thing [Player A] has ever Googled?",
  "card_nf_177": "What is [Player A]'s weirdest recurring dream?",
  "card_nf_178": "What is the dumbest thing [Player A] believed as a child?",
  "card_nf_179": "What is a food combination [Player A] loves but everyone else hates?",
  "card_nf_180": "What is the most irrational fear [Player A] has?",
  "card_nf_181": "What is a conspiracy theory [Player A] kind of believes?",
  "card_nf_182": "What is the most awkward encounter [Player A] has had with a stranger?",
  "card_nf_183": "What is [Player A]'s most toxic trait when playing board games?",
  "card_nf_184": "What is the weirdest habit [Player A] has when they are alone?",
  "card_nf_185": "What is the pettiest reason [Player A] stopped talking to someone?",
  "card_nf_186": "What is the most useless piece of trivia [Player A] knows?",
  "card_nf_187": "What is the worst fashion choice [Player A] has ever made?",
  "card_nf_188": "What is a movie [Player A] secretly loves but pretends to hate?",
  "card_nf_189": "What is the longest rabbit hole [Player A] has gone down on the internet?",
  "card_nf_190": "What is a popular trend [Player A] completely missed out on?",
  "card_nf_191": "What is the most awkward thing [Player A] has said to a teacher or boss?",
  "card_nf_192": "What is a household chore [Player A] absolutely refuses to do?",
  "card_nf_193": "What is the most embarrassing phase [Player A] went through?",
  "card_nf_194": "[Player A] must speak in a terrible British accent until it's their turn again.",
  "card_nf_195": "[Player A] must show everyone the last photo they took on their phone.",
  "card_nf_196": "[Player A] must do their best impression of another player for 30 seconds.",
  "card_nf_197": "[Player A] must text a random emoji to the 5th person in their contacts.",
  "card_nf_198": "[Player A] must attempt to juggle three items of their choice.",
  "card_nf_199": "[Player A] must sing everything they want to say for the next 2 minutes.",
  "card_nf_200": "[Player A] must balance a spoon on their nose for 10 seconds."
};

let matchCount = 0;
cards = cards.map(c => {
  if (fixed[c.id]) {
    c.prompt = fixed[c.id];
    matchCount++;
  }
  return c;
});

fs.writeFileSync('public/cards.json', JSON.stringify(cards, null, 2));
console.log(`Replaced ${matchCount} cards.`);
