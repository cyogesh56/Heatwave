<div align="center">
  <br />
  <img src="public/favicon.svg" alt="Handsy Logo" width="120" />
  <h1>🔥 Handsy</h1>
  <p><strong>A chaotic, real-time multiplayer party game designed for friends, dates, and polycules.</strong></p>
  
  <a href="https://handsy.site">
    <img src="https://img.shields.io/badge/Play_Now-Handsy.site-%236818D6?style=for-the-badge&logo=play" alt="Play Now on handsy.site" />
  </a>
  
  <br /><br />
</div>

## 🎮 What is Handsy?

**Handsy** is a high-energy, synchronized party game built for the modern web. Players join a shared room via a 6-letter room code on their mobile devices, while a central "Host" screen (like an iPad, laptop, or TV) orchestrates the game.

The game forces players out of their comfort zones through escalating phases:
- **Phase 1:** Trivia & Chaos (Kahoot-style rapid-fire voting, wrong answers only)
- **Phase 2:** Deepen (Revealing Truths and psychological prompts)
- **Phase 3:** Ignite (Physical dares and escalating tension)
- **Phase 4:** Melt (After-dark, high-stakes challenges)

## 🕹️ How to Play

1. **Host a Room:** One person navigates to [handsy.site](https://handsy.site) on a large screen (iPad/TV/Laptop) and clicks **Host Game**.
2. **Select Decks:** The Host selects which expansion decks to include (e.g., *The Base Journey*, *First Date*, *Just Friends*).
3. **Join In:** Other players scan the QR code on the Host screen or navigate to [handsy.site](https://handsy.site), enter the 6-letter room code, and type their name.
4. **Play:** The Host screen displays the prompts, timers, and game state. Players use their phones as private controllers to cast votes, trigger powers (like Deflect or Killswitch), and complete dares!

## 🛠️ Architecture & Tech Stack

Handsy uses a master/minion decentralized architecture via **WebRTC** and **Supabase Realtime**. The Host acts as the Single Source of Truth (state machine), and clients are dumb terminals that receive state broadcasts and send actions.

- **Frontend Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (with custom design token architecture)
- **Animations:** Framer Motion
- **Networking:** Supabase Realtime Channels (low-latency WebSockets)
- **Routing:** React Router v7
- **Deployment:** GitHub Pages (via automated GitHub Actions)

## 🚀 Build Your Own

Want to fork Handsy and create your own custom decks or mechanics? You are welcome to clone the repository!

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Git](https://git-scm.com/)
- A free [Supabase](https://supabase.com/) account (for WebSocket infrastructure)

### Setup Instructions

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/your-username/Heatwave.git
   cd Heatwave
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure Environment Variables:**
   Create a \`.env\` file in the root directory and add your Supabase credentials:
   \`\`\`env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   \`\`\`

4. **Run the local development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will typically be available at \`https://localhost:5173\`.
   *(Note: The dev server uses a local basicSSL certificate because WebRTC features require a secure context).*

5. **Build for Production:**
   \`\`\`bash
   npm run build
   \`\`\`

## 🃏 Customizing Decks

All cards are driven by JSON payloads. You can easily add, remove, or modify cards by editing \`public/cards.json\`.

**Card Schema:**
\`\`\`json
{
  "id": "card_custom_001",
  "phase": 1,
  "type": "kahoot",
  "prompt": "What is [Player A]'s secret talent? [Player B] answers.",
  "decks": ["base"],
  "options": ["Juggling", "Singing", "Coding", "Sleeping"]
}
\`\`\`
*Tip: The engine automatically replaces \`[Player A]\`, \`[Player B]\`, etc., with actual active player names dynamically! If a prompt specifies "\`[Player B] answers.\`", the controller UI will dynamically lock voting to only that specific player.*

---
<div align="center">
  <p>Built with ❤️ and 🔥</p>
</div>
