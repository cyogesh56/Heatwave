import json
import random

phases = [1]*30 + [2]*40 + [3]*40 + [4]*40
types = ["truth", "dare", "truth", "dare", "truth"]

base_prompts = {
    1: {
        "truth": [
            "[Player A], what was your first impression of [Player B], and how did it change when [Player C] entered the picture?",
            "[Player B], what is a boundary that you were initially afraid to set with [Player A], but that [Player C] helped you enforce?",
            "[Player C], what is something you admire about the connection between [Player A] and [Player B]?",
            "[Player A], describe a moment of compersion you felt when seeing [Player B] and [Player C] together.",
            "[Player B], what is a small habit [Player C] has that always makes you think of [Player A]?",
            "[Player A], who is the anchor in this polycule when things get chaotic, and why?",
            "[Player C], how do you balance your energy between [Player A] and [Player B] on a busy day?"
        ],
        "dare": [
            "[Player A], give [Player B] and [Player C] a genuine compliment about how they interact.",
            "[Player B], hold hands with [Player A] and [Player C] for the next [3/5/10] minutes.",
            "[Player C], whisper a secret you've never told [Player A] into [Player B]'s ear.",
            "[Player A], orchestrate a group hug with [Player B] and [Player C] that lasts for [30/60] seconds.",
            "[Player B], share a piece of clothing with [Player C] and have [Player A] judge the look.",
            "[Player C], create a secret handshake with [Player A] that includes a nod to [Player B]."
        ]
    },
    2: {
        "truth": [
            "[Player A], what is the most intimate non-sexual moment you've shared with [Player B] and [Player C]?",
            "[Player B], how do you show affection differently to [Player A] compared to [Player C]?",
            "[Player C], what is a fantasy you have that involves both [Player A] and [Player B]?",
            "[Player A], when did you realize that [Player B] and [Player C] were both essential to your happiness?",
            "[Player B], what is something [Player C] does that makes you feel deeply seen, and how does it compare to [Player A]?"
        ],
        "dare": [
            "[Player A], kiss [Player B] on the [neck/jawline/cheek] while maintaining eye contact with [Player C].",
            "[Player B], give [Player C] a shoulder massage while [Player A] traces your spine.",
            "[Player C], trace the outline of [Player A]'s lips while [Player B] whispers in your ear.",
            "[Player A], let [Player B] and [Player C] each kiss a different part of your face simultaneously.",
            "[Player B], straddle [Player C]'s lap and pull [Player A] in for a group embrace."
        ]
    },
    3: {
        "truth": [
            "[Player A], what is the most intense moment of jealousy you've felt regarding [Player B] and [Player C], and how did you resolve it?",
            "[Player B], what is a specific sexual dynamic you enjoy with [Player A] that you want to explore with [Player C]?",
            "[Player C], describe a time when [Player A] and [Player B] perfectly met your emotional and physical needs simultaneously.",
            "[Player A], what is a boundary you've pushed with [Player B] that you would never push with [Player C]?",
            "[Player B], what is a fantasy involving [Player A] and [Player C] that you've been too shy to share?"
        ],
        "dare": [
            "[Player A], orchestrate a three-way kiss with [Player B] and [Player C] that lasts for at least [15/30] seconds.",
            "[Player B], blindfold [Player A] and guide [Player C]'s hands to touch [Player A]'s [neck/chest/waist].",
            "[Player C], straddle [Player A] and pull [Player B] in for a deep, passionate kiss.",
            "[Player A], let [Player B] and [Player C] undress a piece of your clothing using only their teeth.",
            "[Player B], trace the jawline of [Player C] with your lips while [Player A] traces your spine."
        ]
    },
    4: {
        "truth": [
            "[Player A], what is the most profound realization you've had about your capacity for love since being with [Player B] and [Player C]?",
            "[Player B], describe the exact moment you knew you wanted [Player A] and [Player C] in your life permanently.",
            "[Player C], what is a deeply transformative experience you've shared with [Player A] and [Player B]?",
            "[Player A], how has your understanding of commitment evolved through your relationships with [Player B] and [Player C]?",
            "[Player B], what is a legacy you hope to build together with [Player A] and [Player C]?"
        ],
        "dare": [
            "[Player A], guide [Player B] and [Player C] into a deeply intimate, intertwined embrace and hold it for 2 minutes in silence.",
            "[Player B], look into [Player A]'s eyes and then [Player C]'s eyes, and whisper a raw, unspoken truth to each.",
            "[Player C], let [Player A] and [Player B] take complete physical control of your body for the next 3 minutes.",
            "[Player A], initiate a synchronized, full-body sensual massage involving both [Player B] and [Player C].",
            "[Player B], blindfold [Player A] and [Player C], and orchestrate a sensory experience for them using touch, taste, and sound."
        ]
    }
}

cards = []
count = 1
used = set()

for phase in phases:
    while True:
        ctype = random.choice(["truth", "dare"])
        prompt = random.choice(base_prompts[phase][ctype])
        
        # shuffle players
        p = ["A", "B", "C"]
        random.shuffle(p)
        prompt = prompt.replace("[Player A]", "TEMP_A").replace("[Player B]", "TEMP_B").replace("[Player C]", "TEMP_C")
        prompt = prompt.replace("TEMP_A", f"[Player {p[0]}]").replace("TEMP_B", f"[Player {p[1]}]").replace("TEMP_C", f"[Player {p[2]}]")
        
        # apply substitutions
        for to_replace, options in [
            ("[3/5/10]", ["3", "5", "10"]),
            ("[30/60]", ["30", "60"]),
            ("[15/30]", ["15", "30"]),
            ("[neck/jawline/cheek]", ["neck", "jawline", "cheek"]),
            ("[neck/chest/waist]", ["neck", "chest", "waist"])
        ]:
            if to_replace in prompt:
                prompt = prompt.replace(to_replace, random.choice(options))
                
        if prompt not in used or len(used) > 1000:
            used.add(prompt)
            break
            
    tags = ["polyamory"]
    if phase > 2:
        tags.append("after_dark")
    if phase == 1:
        tags.append("first_date")
    if phase == 2:
        tags.append("base")
        
    cards.append({
        "id": f"card_poly_{count:03d}",
        "phase": phase,
        "type": ctype,
        "prompt": prompt,
        "decks": tags
    })
    count += 1

with open("/Users/cyogesh56/Documents/Heatwave/batch4.json", "w") as f:
    json.dump(cards, f, indent=2)

print("Generated batch4.json")
