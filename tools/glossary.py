# Wikilink glossary: key -> (title, page#anchor, short preview text).
# Write [[key]] or [[key|label]] in any page, then run: python3 tools/wikilinks.py
G = {
 # Projects
 "war-tcg":   ("WAR-TCG", "war-tcg.html", "An original five-colour trading card game I'm designing solo."),
 "chardss":   ("CHARDSS", "chardss.html", "Chess with a shared deck of 40 cards that each bend one rule."),
 "glory":     ("Glory", "glory.html", "A digital tactics card game where your hand is your move set."),
 "expanchess":("Expanchess", "expanchess.html", "A browser chess game with one-use ability cards. My job since July 2025."),
 "world":     ("The Wondering Emperor", "world.html", "An original fantasy-steampunk world with a hard magic system."),
 "optcg":     ("Competitive One Piece TCG", "optcg.html", "Top-level play since the game's release at the end of 2022."),
 "community": ("Community management", "community.html", "Co-managed One Piece TCG Israel from January 2023 to 2025."),
 "timeline":  ("Timeline", "timeline.html", "Everything, in the order it happened."),
 # WAR-TCG
 "might":     ("Might", "https://thevaus.github.io/war-tcg-site/design#combat", "WAR-TCG's one combat number. An attack hits if the attackers' combined Might is at least the target's."),
 "block":     ("Block", "https://thevaus.github.io/war-tcg-site/design#defending", "A Command's Block value (0 to 3) is added to the target's Might when it's pitched to defend."),
 "pitch":     ("Pitch", "https://thevaus.github.io/war-tcg-site/design#defending", "When attacked, pitch Commands from your hand to add their Block to the target's Might for that combat."),
 "station":   ("Station", "https://thevaus.github.io/war-tcg-site/design#resources", "Once per turn, put a unit from your hand into your Backline for free, where it produces energy."),
 "backline":  ("Backline", "https://thevaus.github.io/war-tcg-site/design#resources", "The zone where stationed units tap to produce energy."),
 "middle":    ("Middle", "https://thevaus.github.io/war-tcg-site/design#resources", "The zone between Backline and Frontline. It holds one unit."),
 "frontline": ("Frontline", "https://thevaus.github.io/war-tcg-site/design#resources", "Where deployed units and items go. Only Frontline units can attack."),
 "colour-pie":("Colour pie", "https://thevaus.github.io/war-tcg-site/design#colours", "WAR-TCG's five colours, each with a play style, signature mechanics and mechanics it never gets."),
 "balance-formula": ("Balance formula", "https://thevaus.github.io/war-tcg-site/design#balance", "value − cost = 3 to 5, where value = Might + production + text."),
 # CHARDSS
 "points":    ("Points", "https://thevaus.github.io/CHARDSS-Website/design/#economy", "In CHARDSS you earn points when your own pieces are captured: Pawn 1, Knight and Bishop 3, Rook 5, Queen 9."),
 "armageddon":("Armageddon", "https://thevaus.github.io/CHARDSS-Website/design/#pricing", "A 39-point CHARDSS card. It wins the game if your King is your only piece left."),
 # Glory
 "combat-chain": ("Combat chain", "glory.html#chain", "Glory's attack sequence: both players add reactions in turn, then the chain resolves last-in, first-out."),
 "facing":    ("Facing", "glory.html#facing", "In Glory, attacks land on a character's front, side or back, set by the shortest path."),
 # Expanchess
 "pans":      ("Pans", "expanchess.html#game", "Expanchess's one-use ability cards. Each can be played once per match."),
 # The Wondering Emperor
 "mana":      ("Mana", "world.html#mana", "The unit of magic. Living mana is in everything alive, non-living mana in everything else."),
 "cosmic-flow": ("Cosmic Flow", "world.html#cosmic-flow", "Mana is never created or destroyed. It circulates by changing between living and non-living."),
 "inner-magic": ("Inner magic", "world.html#inner-magic", "Channelling your own living mana inward to boost the body and senses."),
 "outer-magic": ("Outer magic", "world.html#outer-magic", "Moving mana into matter: gases heat, liquids expand, solids soften."),
 "indexes":   ("Material indexes", "world.html#indexes", "Every material's base, max, leak and purity values for mana."),
 "magic-circles": ("Magic circles", "world.html#magic-circles", "Patterns of magical plant strings that dictate what mana does in an object. Mana's programming language."),
 "teleportation": ("Teleportation", "world.html#teleportation", "Forbidden magic. A failed attempt kills the caster instantly."),
 "magical-plant": ("The magical plant", "world.html#magical-plant", "The world's most valuable resource: mana cable, currency, unit of length and royal tax."),
 "power-stones": ("Power stones", "world.html#technology", "High-purity rocks that store mana, charged by Sorcerers."),
 "sol":       ("SOL, the Seed of Life", "world.html#sol", "A device that captures a dying soul and later releases it to carry out a command."),
 "gifted":    ("The Gifted", "world.html#gifted", "People born bonded to the magical plant, with silver hair and far more mana than anyone else."),
 "omnigoyf":  ("The Omnigoyf", "world.html#omnigoyf", "The most ancient humanoid race: forest-dwelling, armoured and hostile."),
 "manakin":   ("The manakin", "world.html#manakin", "A small, long-lived mountain people with advanced inner magic."),
 "sorcerers": ("Sorcerers and Guardians", "world.html#sorcerers", "People with more mana than most. Sorcerers do mana labour; Guardians are stronger still."),
 "houses-of-power": ("The Houses of Power", "world.html#houses-of-power", "The fragile alliance of seven kingdoms that rules most of the land."),
 "god-island":("God Island", "world.html#god-island", "The hidden sanctuary of the alliance's royalty, reachable only through the Stone Gates."),
 "stone-gates": ("The Stone Gates", "world.html#stone-gates", "Ten ancient gates, 100 to 300 metres tall, built by no one knows who."),
 "kan-noulend": ("Kan Noulend", "world.html#kan-noulend", "The God of War: the conqueror who solved the Stone Gates and founded the Houses of Power."),
}
