const fs = require('fs');

const cards = JSON.parse(fs.readFileSync('public/cards.json', 'utf-8'));
const optionsMap = JSON.parse(fs.readFileSync('scratch/generated_options.json', 'utf-8'));

let md = '# Generated Options Review\n\n';

let appliedCount = 0;
const updatedCards = cards.map(c => {
  if (optionsMap[c.id]) {
    c.options = optionsMap[c.id];
    appliedCount++;
    md += `### ${c.id} (${c.type})\n`;
    md += `**Prompt:** ${c.prompt}\n`;
    md += `**Options:**\n`;
    c.options.forEach((opt, i) => {
      md += `${i + 1}. ${opt}\n`;
    });
    md += `\n---\n\n`;
  }
  return c;
});

fs.writeFileSync('public/cards.json', JSON.stringify(updatedCards, null, 2));
fs.writeFileSync('scratch/options_review.md', md);
console.log(`Applied ${appliedCount} options.`);
