const players = ["Alice", "Bob"];
const prompt = "Who is more likely to secretly be an undercover agent?";
const options = ['[Player A]', '[Player B]', '[Player C]', '[Player D]'];

const pA = "Bob";
const pB = "Alice";
const pC = undefined;
const pD = undefined;

let parsedOptions = [];
for (const opt of options) {
  if (opt === '[Player C]' && !pC) continue;
  if (opt === '[Player D]' && !pD) continue;
  if (opt === '[Player A]' && !pA) continue; 
  if (opt === '[Player B]' && !pB) continue; 

  let parsedOpt = opt
    .replace(/\[Player A\]/g, pA)
    .replace(/\[Player B\]/g, pB)
    .replace(/\[Player C\]/g, pC)
    .replace(/\[Player D\]/g, pD);
  
  parsedOptions.push(parsedOpt);
}

console.log(parsedOptions);
