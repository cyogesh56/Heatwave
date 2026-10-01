# Game Design Specification: "Heatwave" (Intimacy Connect)

## 1. Core Concept & Architecture
* **Genre:** Multiplayer intimacy/connection game for 2-4 players (accommodates couples, polycules, friends, and dates).
* **Format:** Hybrid Screen. A main screen (TV/Tablet) acts as the Host/Board. Player phones act as private controllers.
* **Tech Stack:** Offline-first, stateless web app (HTML/JS/CSS). No backend, no database, no AI at runtime.
* **Data Storage:** A single, local `cards.json` file (~600 cards).
* **Memory:** Uses `localStorage` to log played Card IDs to prevent repeats across sessions.

## 2. The Game Loop & Mechanics
Players join via a 4-digit room code generated on the Host screen. 
1. **The Draw:** The Host screen displays whose turn it is and the prompt.
2. **The Action:** Players answer Kahoot-style, converse, or perform physical dares depending on the phase.
3. **The Phone UI:** Phones display only what is necessary: A/B/C/D voting buttons during trivia, or a single "Next" button.
4. **Power Buttons (Sticky on Phone UI):**
   * **Deflect:** Skip your assigned card and pass it to the next player.
   * **Killswitch:** Cancel the current card entirely for everyone; Host screen shatters it and draws a new one.
   * **Override:** Force a Vibe Shift (jump up or down a phase).

## 3. The Pacing System (Phases)
The game auto-escalates, changing background colors and timer mechanics as it gets heavier.
* **Phase 1: Spark (Yellow):** Funny, Kahoot-style trivia. *Mechanic: 30-second countdown timer.*
* **Phase 2: Deepen (Blue):** Emotional "WNRS" style vulnerability. *Mechanic: Untimed. Advances only when all press "Ready".*
* **Phase 3: Ignite (Orange):** Hot, sensual touch and foreplay. *Mechanic: Duration timer (counts down the length of the physical dare).*
* **Phase 4: Melt (Red):** Kinky, high-heat sandbox. *Mechanic: Untimed exploration.*

## 4. Expansion Decks & JSON Tagging
The `cards.json` file uses a tagging system so cards can be shared across 5 distinct decks.
* **Decks:** `base`, `just_friends`, `first_date`, `polyamory`, `after_dark`.
* **The "Mad Libs" Variable:** Prompts should use bracketed variables to multiply options (e.g., "Kiss [Player B] on the [neck/jaw/shoulder]").

## 5. JSON Schema
Subagents must use this strict schema when generating the 600 cards:

{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string", "description": "e.g., card_001" },
      "phase": { "type": "integer", "description": "1, 2, 3, or 4" },
      "type": { "type": "string", "enum": ["truth", "dare", "kahoot"] },
      "prompt": { "type": "string", "description": "The question or dare. Use [Player A] and [Player B] variables." },
      "decks": {
        "type": "array",
        "items": { "type": "string", "enum": ["base", "just_friends", "first_date", "polyamory", "after_dark"] }
      }
    },
    "required": ["id", "phase", "type", "prompt", "decks"]
  }
}

## 6. Technical Implementation Addendum (Agent Instructions)

### 6.1 Networking (No-Backend Multiplayer)
Since we are strictly avoiding backend databases and user data storage, implement the multiplayer connection using **PeerJS (WebRTC)**.
* The Host screen generates a unique Peer ID (the "Room Code").
* Player phones connect directly to the Host's Peer ID browser-to-browser.
* If PeerJS is not viable, fallback to a lightweight, ephemeral `Socket.io` local Node server that holds data *only* in RAM and wipes it when the process stops.

### 6.2 State Authority
* **The Host Screen is the Single Source of Truth:** The Host browser runs the RNG logic, holds the `cards.json` array, checks `localStorage` for exclusions, and keeps track of the active phase, timers, and player scores/sparks.
* **The Phones are "Dumb" Controllers:** Phones do not store game logic. They only send tap events (e.g., `{"action": "vote", "value": "A"}` or `{"action": "power", "type": "deflect"}`) to the Host, and listen for UI updates from the Host (e.g., `{"ui_state": "show_next_button"}`).

### 6.3 URL Routing
Create distinct views based on URL parameters or paths to keep the code clean:
* `/` -> Landing page (Create Game or Join Game).
* `/host` -> The TV/Tablet view (displays room code, card prompts, timers).
* `/play` -> The Phone UI (displays voting buttons, sticky power buttons).

### 6.4 The "Mad Libs" String Parser
Write a specific JavaScript utility function to parse the `prompt` strings dynamically on the Host screen before broadcasting to phones:
* Replace `[Player A]` and `[Player B]` with the actual names of the joined players (using a round-robin or random selection, ensuring A and B are not the same person).
* If a string contains `[item1/item2/item3]`, write a regex parser that randomly selects one of the items separated by the `/` to generate the final prompt.