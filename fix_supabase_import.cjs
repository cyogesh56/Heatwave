const fs = require('fs');
let code = fs.readFileSync('src/context/GameContext.tsx', 'utf-8');
code = "import { supabase } from '../lib/supabase';\n" + code;
fs.writeFileSync('src/context/GameContext.tsx', code);
