const fs = require('fs');
const cards = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));

let types = {};
cards.forEach(c => {
  if (!types[c.type]) types[c.type] = { count: 0, hasOptions: 0, missingOptions: 0 };
  types[c.type].count++;
  if (c.options && Array.isArray(c.options)) {
    types[c.type].hasOptions++;
  } else {
    types[c.type].missingOptions++;
  }
});
console.log(types);
