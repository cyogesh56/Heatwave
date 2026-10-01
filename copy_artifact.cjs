const fs = require('fs');

const md = fs.readFileSync('scratch/options_review.md', 'utf-8');
const script = `
const fs = require('fs');
fs.writeFileSync('/Users/cyogesh56/.gemini/antigravity/brain/28dac787-1c06-4bf3-b4f8-6d6a8d8ba23b/OPTIONS_REVIEW.md', process.env.MD);
`;
fs.writeFileSync('scratch/do_copy.cjs', script);
