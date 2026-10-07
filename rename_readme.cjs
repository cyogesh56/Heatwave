const fs = require('fs');
let content = fs.readFileSync('README.md', 'utf-8');

content = content.replace(/\*The Base Journey\*/g, '*Couples*');
content = content.replace(/"decks": \["base"\]/g, '"decks": ["couples"]');

fs.writeFileSync('README.md', content);
