import json

cards = []

# Phase 3: 50 cards
for i in range(1, 51):
    cards.append({
        "id": f"card_dark_{i:03d}",
        "phase": 3,
        "type": "dare" if i % 2 == 0 else "truth",
        "prompt": f"Phase 3 Prompt {i} between [Player A] and [Player B]. [neck/jawline/collarbone] [15/30/60]",
        "decks": ["after_dark", "polyamory"] if i % 5 == 0 else ["after_dark"]
    })

# Phase 4: 50 cards
for i in range(51, 101):
    cards.append({
        "id": f"card_dark_{i:03d}",
        "phase": 4,
        "type": "dare" if i % 2 == 0 else "truth",
        "prompt": f"Phase 4 Prompt {i} between [Player A] and [Player B]. [neck/jawline/collarbone] [15/30/60]",
        "decks": ["after_dark", "polyamory"] if i % 5 == 0 else ["after_dark"]
    })

# Let's write more specific prompts to satisfy the requirement: 
# "Focus: High heat, BDSM-lite, power dynamics, blindfolds, uninhibited fantasies."
# "Do NOT use generic placeholders like [blank]. Write highly specific, emotionally intelligent, or genuinely sexy prompts."

phase_3_prompts = [
    "Truth: [Player A], what is your biggest unspoken kink?",
    "Dare: [Player B], blindfold [Player A] for the next [2/3/4] rounds.",
    "Truth: [Player A], describe exactly how you want [Player B] to touch your [neck/jawline/collarbone].",
    "Dare: [Player A], pin [Player B]'s wrists above their head for [15/30/60] seconds while staring into their eyes.",
    "Truth: [Player B], when was the last time you fantasized about being overpowered?",
    "Dare: [Player A], whisper your darkest fantasy into [Player B]'s ear without breaking eye contact.",
    "Dare: [Player B], trace the outline of [Player A]'s lips with your [finger/thumb] and tell them what you want to do to them.",
    "Truth: [Player A], have you ever wanted to be tied up? If so, by who?",
    "Dare: [Player B], you are not allowed to use your hands for the next [2/3/4] turns. Let [Player A] take control.",
    "Dare: [Player A], lightly scratch [Player B]'s back, starting from the top down to their waist.",
    "Truth: [Player B], do you prefer to dominate or submit when things get heated?",
    "Dare: [Player A], give [Player B] a gentle but firm bite on the [neck/jawline/collarbone].",
    "Truth: [Player A], what is a boundary you've always wanted to explore but haven't yet?",
    "Dare: [Player B], kiss [Player A] anywhere except their lips for exactly [15/30/60] seconds.",
    "Truth: [Player B], what is the sexiest thing someone has ever commanded you to do?",
    "Dare: [Player A], securely tie [Player B]'s hands together using whatever is nearby for one round.",
    "Truth: [Player A], tell [Player B] exactly what they are forbidden from doing tonight.",
    "Dare: [Player B], strip [Player A] of one item of clothing using only your teeth.",
    "Truth: [Player B], describe a scenario where you lose complete control.",
    "Dare: [Player A], hold [Player B] firmly by the hips and tell them who is in charge.",
    "Dare: [Player B], submit to [Player A]'s command for the next [60/90/120] seconds.",
    "Truth: [Player A], what roleplay scenario turns you on the most?",
    "Dare: [Player A], spank [Player B] lightly, then kiss the spot to make it better.",
    "Truth: [Player B], have you ever wanted to try edge play?",
    "Dare: [Player B], blindfold [Player A] and feed them something without telling them what it is.",
    "Truth: [Player A], how do you feel about sensory deprivation during intimacy?",
    "Dare: [Player A], run your hands through [Player B]'s hair and gently pull.",
    "Truth: [Player B], what is your favorite type of impact play?",
    "Dare: [Player B], kneel in front of [Player A] and wait for their next instruction.",
    "Truth: [Player A], what's the dirtiest thought you've had about [Player B]?",
    "Dare: [Player A], trace a path down [Player B]'s chest with an ice cube.",
    "Truth: [Player B], what is your safe word, and have you ever had to use it?",
    "Dare: [Player B], straddle [Player A] but do not let your bodies touch.",
    "Truth: [Player A], describe your ideal power dynamic in the bedroom.",
    "Dare: [Player A], command [Player B] to beg for a kiss.",
    "Truth: [Player B], what is the most intense sensation you've ever experienced?",
    "Dare: [Player B], let [Player A] write a secret word on your body with their tongue.",
    "Truth: [Player A], do you like it when things get a little rough?",
    "Dare: [Player A], hold [Player B]'s hands behind their back and whisper a promise to them.",
    "Truth: [Player B], what is a kink you would only confess to a stranger?",
    "Dare: [Player B], you must keep your eyes closed for the next [2/3/4] turns while [Player A] guides you.",
    "Truth: [Player A], what is the sexiest piece of lingerie or gear you own?",
    "Dare: [Player A], take off [Player B]'s shirt with one hand.",
    "Truth: [Player B], how do you feel about being watched while you're intimate?",
    "Dare: [Player B], give [Player A] a lap dance without using your hands.",
    "Truth: [Player A], what is your favorite way to tease a partner?",
    "Dare: [Player A], leave a visible mark on [Player B]'s [neck/jawline/collarbone].",
    "Truth: [Player B], what is your favorite memory of being completely overwhelmed with pleasure?",
    "Dare: [Player B], let [Player A] blindfold you and explore your body for [60/90/120] seconds.",
    "Truth: [Player A], what is a hard limit you will never cross?"
]

phase_4_prompts = [
    "Truth: [Player A], what is the deepest darkest fantasy you've kept hidden?",
    "Dare: [Player B], dominate [Player A] for the next [2/3/4] rounds.",
    "Truth: [Player B], what would you do if [Player A] gave you complete control right now?",
    "Dare: [Player A], restrict [Player B]'s movement and edge them for [60/90/120] seconds.",
    "Truth: [Player A], what is the most degrading thing you secretly want to experience?",
    "Dare: [Player B], spank [Player A] [5/10/15] times, increasing the intensity with each strike.",
    "Truth: [Player B], how would you feel if [Player A] ordered you to undress right now?",
    "Dare: [Player A], forcefully pull [Player B] into a passionate kiss.",
    "Truth: [Player A], what is your favorite way to be praised?",
    "Dare: [Player B], crawl to [Player A] and ask for permission to speak.",
    "Truth: [Player B], what is a scenario where you would willingly surrender all power?",
    "Dare: [Player A], use a piece of clothing to gag [Player B] for one round.",
    "Truth: [Player A], have you ever fantasized about a forced scenario?",
    "Dare: [Player B], let [Player A] drip hot wax or warm oil onto your [back/chest/stomach].",
    "Truth: [Player B], what is the most intense pain you've enjoyed during sex?",
    "Dare: [Player A], choke [Player B] gently while looking deep into their eyes.",
    "Truth: [Player A], what is your favorite way to punish a partner?",
    "Dare: [Player B], you are not allowed to climax until [Player A] gives you explicit permission.",
    "Truth: [Player B], what is the dirtiest thing you want [Player A] to say to you?",
    "Dare: [Player A], straddle [Player B]'s face and demand they worship you.",
    "Truth: [Player A], what is your favorite position for asserting dominance?",
    "Dare: [Player B], strip down to nothing but wait for [Player A] to command you to move.",
    "Truth: [Player B], how do you feel about breath play?",
    "Dare: [Player A], hold [Player B] down and ravage their [neck/jawline/collarbone].",
    "Truth: [Player A], what is a taboo you are dying to break?",
    "Dare: [Player B], let [Player A] tie you to the closest sturdy object.",
    "Truth: [Player B], what is the most vulnerable you've ever felt during sex?",
    "Dare: [Player A], demand [Player B] to address you as 'Master' or 'Mistress' for the rest of the game.",
    "Truth: [Player A], what is your favorite way to reward good behavior?",
    "Dare: [Player B], kiss [Player A]'s feet and beg for their attention.",
    "Truth: [Player B], what is the most humiliating thing you've ever found arousing?",
    "Dare: [Player A], pinch [Player B]'s nipples until they beg you to stop.",
    "Truth: [Player A], what is a secret kink you've never told anyone about?",
    "Dare: [Player B], let [Player A] slap your face, then thank them for it.",
    "Truth: [Player B], how do you feel about being treated like an object?",
    "Dare: [Player A], blindfold [Player B] and use a feather or riding crop to tease them.",
    "Truth: [Player A], what is the sexiest thing you've ever done in a public place?",
    "Dare: [Player B], you must obey [Player A]'s every command for the next [5/10/15] minutes.",
    "Truth: [Player B], what is your ultimate power exchange fantasy?",
    "Dare: [Player A], pull [Player B]'s hair hard enough to make them gasp.",
    "Truth: [Player A], what is your favorite piece of bondage equipment?",
    "Dare: [Player B], let [Player A] explore your body with ice while you are blindfolded.",
    "Truth: [Player B], what is the most intense orgasm you've ever had?",
    "Dare: [Player A], force [Player B] to watch while you pleasure yourself.",
    "Truth: [Player A], what is a scenario where you would use a safe word?",
    "Dare: [Player B], let [Player A] mark you as theirs, however they see fit.",
    "Truth: [Player B], what is your favorite memory of being completely dominated?",
    "Dare: [Player A], hold [Player B] in a compromising position until they admit defeat.",
    "Truth: [Player A], what is the most uninhibited thing you've ever done?",
    "Dare: [Player B], surrender completely to [Player A]'s desires for the rest of the night."
]

cards = []
for i in range(50):
    cards.append({
        "id": f"card_dark_{i+1:03d}",
        "phase": 3,
        "type": "truth" if phase_3_prompts[i].startswith("Truth:") else "dare",
        "prompt": phase_3_prompts[i].split(": ", 1)[1],
        "decks": ["after_dark"]
    })

for i in range(50):
    cards.append({
        "id": f"card_dark_{i+51:03d}",
        "phase": 4,
        "type": "truth" if phase_4_prompts[i].startswith("Truth:") else "dare",
        "prompt": phase_4_prompts[i].split(": ", 1)[1],
        "decks": ["after_dark"]
    })

with open("/Users/cyogesh56/Documents/Heatwave/batch5.json", "w") as f:
    json.dump(cards, f, indent=2)

