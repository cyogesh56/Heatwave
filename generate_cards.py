import json

p1_prompts = [
    ("truth", "[Player A], what is a hill you are absolutely willing to die on, and can you convince [Player B]?"),
    ("dare", "[Player A], let [Player B] redesign your phone's home screen for the next [5/10/24] hours."),
    ("truth", "[Player A], what was your absolute first impression of [Player B], and how completely wrong was it?"),
    ("kahoot", "Who is more likely to accidentally start a cult?"),
    ("dare", "[Player A], explain the plot of your favorite movie to [Player B] using only sound effects and zero words."),
    ("truth", "[Player A], what is the most unhinged late-night rabbit hole you've dragged [Player B] into?"),
    ("truth", "[Player A], if [Player B] was a minor inconvenience, what would they be?"),
    ("dare", "[Player A], text a random contact in your phone a message dictated entirely by [Player B]."),
    ("kahoot", "Who is more likely to survive a zombie apocalypse purely by dumb luck?"),
    ("truth", "[Player A], what is the most chaotic piece of advice you've ever given [Player B] that actually worked?"),
    ("truth", "[Player A], if you and [Player B] were on a reality TV show, what would be your designated roles?"),
    ("dare", "[Player A], speak in a terrible accent of [Player B]'s choosing until it is your turn again."),
    ("truth", "[Player A], what is a highly specific vibe that [Player B] perfectly embodies?"),
    ("kahoot", "Who would be the first to get kicked out of a fancy restaurant?"),
    ("dare", "[Player A], let [Player B] rewrite your latest dating app bio or social media bio."),
    ("truth", "[Player A], what is an inside joke between you and [Player B] that makes zero sense to anyone else?"),
    ("truth", "[Player A], if [Player B] was a specific [soup/sandwich/beverage], what would they be and why?"),
    ("dare", "[Player A], do your best dramatic reading of the last text message [Player B] sent you."),
    ("kahoot", "Who is more likely to completely forget they have plans until 5 minutes before?"),
    ("truth", "[Player A], what is the most ridiculously niche subject that you think [Player B] is an expert in?"),
    ("truth", "[Player A], what is one fictional character that [Player B] is deeply, embarrassingly similar to?"),
    ("dare", "[Player A], try to juggle three items chosen by [Player B]. If you fail, you must answer a truth."),
    ("truth", "[Player A], what is the most baffling fashion choice [Player B] has ever made?"),
    ("kahoot", "Who is more likely to accidentally go viral for doing something embarrassing?"),
    ("dare", "[Player A], let [Player B] pick an embarrassing song that you must lip-sync to for 60 seconds."),
    ("truth", "[Player A], what is a hyper-specific red flag that [Player B] somehow manages to ignore?"),
    ("truth", "[Player A], what is the most questionable financial decision you’ve seen [Player B] make?"),
    ("dare", "[Player A], swap shirts with [Player B] if you're comfortable, or wear your shirt backwards for [1/2/3] rounds."),
    ("kahoot", "Who has the absolute worst taste in movies?"),
    ("truth", "[Player A], what is one entirely harmless conspiracy theory that you think [Player B] secretly believes?"),
    ("truth", "[Player A], what is the most bizarre thing [Player B] has ever confidently claimed was a fact?"),
    ("dare", "[Player A], attempt to balance a [spoon/book/cup] on your head while answering [Player B]'s next question."),
    ("truth", "[Player A], if [Player B] was a boss in a video game, what would their main attack be?"),
    ("kahoot", "Who is more likely to confidently give completely wrong directions?"),
    ("dare", "[Player A], you must communicate only in rhymes until it’s your turn again."),
    ("truth", "[Player A], what is a song that instantly reminds you of [Player B] and why?"),
    ("truth", "[Player A], what is the most useless talent [Player B] possesses?"),
    ("dare", "[Player A], perform an interpretive dance expressing your friendship with [Player B]."),
    ("kahoot", "Who is more likely to fall asleep during a highly dramatic movie scene?"),
    ("truth", "[Player A], what is a weird habit [Player B] has that they think nobody notices?"),
    ("truth", "[Player A], if you had to describe [Player B] as a wildly specific weather event, what are they?"),
    ("dare", "[Player A], try to draw [Player B] blindfolded in 60 seconds."),
    ("truth", "[Player A], what is the best spontaneous adventure you’ve ever had with [Player B]?"),
    ("kahoot", "Who is more likely to talk their way out of a speeding ticket?"),
    ("dare", "[Player A], let [Player B] style your hair using whatever is in the room."),
    ("truth", "[Player A], what is something [Player B] introduced you to that you now absolutely love?"),
    ("truth", "[Player A], if [Player B] wrote an autobiography, what would the title be?"),
    ("dare", "[Player A], give a 1-minute TedTalk on a completely random topic selected by [Player B]."),
    ("kahoot", "Who is the superior driver in high-stress situations?"),
    ("truth", "[Player A], what is the most unwarranted argument you and [Player B] have ever had?"),
    ("truth", "[Player A], what is one deeply mundane thing [Player B] does that inexplicably annoys you?"),
    ("dare", "[Player A], sing whatever [Player B] says in the style of an opera singer for 30 seconds."),
    ("kahoot", "Who is more likely to secretly be an undercover agent?"),
    ("truth", "[Player A], what is [Player B]'s most distinctive aesthetic choice?"),
    ("truth", "[Player A], what is an incredibly trivial secret you've kept from [Player B] until now?"),
    ("dare", "[Player A], attempt a staring contest with [Player B] while they actively try to make you laugh."),
    ("kahoot", "Who is more likely to break a piece of furniture and hide it?"),
    ("truth", "[Player A], what is one ridiculous thing you and [Player B] passionately agree on?"),
    ("truth", "[Player A], what is a piece of slang [Player B] needs to permanently retire?"),
    ("dare", "[Player A], pitch a completely unhinged startup idea to [Player B] for 60 seconds.")
]

p2_prompts = [
    ("truth", "[Player A], when did you realize that [Player B] was more than just an acquaintance, but a real friend?"),
    ("truth", "[Player A], what is one specific thing [Player B] does that always makes you feel seen and supported?"),
    ("truth", "[Player A], what is a deeply personal fear you’ve shared with [Player B], and how did they handle it?"),
    ("kahoot", "Who is the anchor of this friendship when things get chaotic?"),
    ("truth", "[Player A], what is an area of life where you truly admire [Player B]'s approach?"),
    ("truth", "[Player A], describe a time [Player B] completely changed your perspective on something important."),
    ("dare", "[Player A], give [Player B] a genuinely heartfelt compliment that you've never said out loud."),
    ("truth", "[Player A], what is a silent way [Player B] shows they care about you?"),
    ("truth", "[Player A], what is one insecurity [Player B] has that you genuinely wish they would let go of?"),
    ("kahoot", "Who gives the most ruthlessly honest advice?"),
    ("truth", "[Player A], what is a memory of [Player B] that you instantly go to when you need to smile?"),
    ("truth", "[Player A], how has your life noticeably improved since [Player B] entered it?"),
    ("dare", "[Player A], list 3 highly specific reasons why you value [Player B]'s presence in your life."),
    ("truth", "[Player A], what is a hard truth [Player B] told you that you needed to hear?"),
    ("truth", "[Player A], what is one dream or goal of [Player B]'s that you would do anything to help them achieve?"),
    ("kahoot", "Who is more likely to drop everything and show up at 3 AM if the other is in crisis?"),
    ("truth", "[Player A], what is a trait of [Player B]'s that you actively try to emulate?"),
    ("truth", "[Player A], what is an unspoken rule in your friendship with [Player B]?"),
    ("dare", "[Player A], tell [Player B] something you deeply appreciate about how their mind works."),
    ("truth", "[Player A], when was a moment you felt incredibly proud to call [Player B] your friend?"),
    ("truth", "[Player A], what is something [Player B] does that makes the world a better place?"),
    ("kahoot", "Who has emotionally grown the most since you first met?"),
    ("truth", "[Player A], what is an aspect of [Player B]'s personality that most people don't get to see?"),
    ("truth", "[Player A], what is a boundary you and [Player B] have navigated perfectly together?"),
    ("dare", "[Player A], hold [Player B]’s hands and sincerely thank them for a specific time they were there for you."),
    ("truth", "[Player A], what is the most comforting thing about [Player B]'s presence?"),
    ("truth", "[Player A], how would you describe [Player B]'s unique brand of empathy?"),
    ("kahoot", "Who is better at reading the other's mind without a single word?"),
    ("truth", "[Player A], what is an obstacle you’ve seen [Player B] overcome that left you in awe?"),
    ("truth", "[Player A], what is the most meaningful conversation you’ve ever had with [Player B]?")
]

p3_prompts = [
    ("dare", "[Player A] and [Player B], engage in an intensely competitive thumb war. Best two out of three wins."),
    ("dare", "[Player A] and [Player B], arm wrestle. Loser has to fetch the winner a [snack/drink/pillow]."),
    ("dare", "[Player A], give [Player B] a highly dramatic, overly enthusiastic high-five, mimicking a sports victory."),
    ("dare", "[Player A] and [Player B], try to complete a secret handshake you make up on the spot in under 30 seconds."),
    ("dare", "[Player A], give [Player B] a genuinely great 60-second shoulder massage to release the tension of the game."),
    ("dare", "[Player A] and [Player B], link arms and try to stand up from sitting on the floor without using your hands."),
    ("dare", "[Player A], initiate a completely unironic, fully committed bear hug with [Player B] for exactly [5/10/15] seconds."),
    ("dare", "[Player A] and [Player B], play a round of Rock, Paper, Scissors using your whole bodies to signify the choices."),
    ("dare", "[Player A], carry [Player B] piggyback across the room, or if not possible, securely link arms and skip."),
    ("dare", "[Player A] and [Player B], lightly poke each other's sides to see who breaks and laughs first. Limit 30 seconds.")
]

cards = []
card_index = 1

for p in p1_prompts:
    cards.append({
        "id": f"card_friends_{card_index:03d}",
        "phase": 1,
        "type": p[0],
        "prompt": p[1],
        "decks": ["base", "just_friends"]
    })
    card_index += 1

for p in p2_prompts:
    cards.append({
        "id": f"card_friends_{card_index:03d}",
        "phase": 2,
        "type": p[0],
        "prompt": p[1],
        "decks": ["base", "just_friends"]
    })
    card_index += 1

for p in p3_prompts:
    cards.append({
        "id": f"card_friends_{card_index:03d}",
        "phase": 3,
        "type": p[0],
        "prompt": p[1],
        "decks": ["base", "just_friends"]
    })
    card_index += 1

with open('/Users/cyogesh56/Documents/Heatwave/batch2.json', 'w') as f:
    json.dump(cards, f, indent=2)

print("SUCCESS")
