# DESIGN.md — Daniel Vekar portfolio

The site is set in the same type and colours as WAR-TCG, Daniel's own trading card game, so the portfolio reads as
the work of the person who made those cards. Everything is quiet, left-aligned and easy to skim for a recruiter.

Direction note: no UXKIN tools were connected, so this direction comes from Daniel's own game assets and from
game-design portfolio guides (GameDesignSkills, Game Developer, PocketGamer.biz), not from comparing real sites.

## Colour

All values come from `WAR-TCG/Assets/Palette.ase` (CMYK converted to sRGB).

| Token | Value | Role |
|---|---|---|
| `--page` | `#E8EAE9` | Page background (Pewter, lightened) |
| `--surface` | `#F8F8F5` | Raised areas: summary boxes, tables |
| `--ink` | `#170F0B` | Body text, headings (palette "Ink") |
| `--ink-2` | `#353F42` | Secondary text, captions (palette "Ash", 9:1 on page) |
| `--rule` | `#C3C9C9` | Hairlines and table borders |
| `--iron` | `#191F21` | Dark bands: hero, footer (palette "Iron") |
| `--on-iron` | `#ECEDEA` / `#AEB7B8` | Text on Iron, primary / secondary |
| `--primary` | `#0B39DA` | Links and the primary button (palette "Sapphire", 7:1 on page) |
| `--primary-deep` | `#001570` | Hover / pressed (palette "Midnight") |
| `--gold` | `#F5991F` | Focus ring only (palette "Frame Gold") |
| `--paper` | `#E6E0CF` | Card text boxes only |

**60-30-10.** Roughly 60% light page (`--page`, `--surface`), 30% Iron (hero, project tiles, footer) and 10%
Sapphire as the one accent: links, the primary button, the bar under the hero role and over each home section title,
and the top edge of the plain tiles. Each project theme follows the same split with its own three colours (table
below). Measured on the home page at 1440 px: about 55% light, 37% dark, the rest text and accent.

Faction colours appear only where they mean a WAR colour: W `#EBC000`, U `#0B39DA`, B `#4C0BC3`, R `#B8001F`,
G `#139926`.

## Typography

Daniel's card fonts, subset to WOFF2 in `fonts/war/` (all derived from OFL / GUST-licensed families).

- **WAR Caption** (Barlow Semi Condensed base): headings, navigation, buttons, labels. Sentence case. 600 and 700.
- **WAR Text** (TeX Gyre Pagella base): body copy, 18px / 1.6, measure ≤ 66ch.
- **WAR Display** (Cormorant Upright base): card subtype lines and figure captions, sparingly.
- **WAR Text Icons**: the full WAR Text with the game's icon ligatures (`[DEPLOY]`, `{Might}`, `<rush>`), used
  only inside card mock-ups.

Scale (px): 14 · 16 · 18 · 22 · 28 · 38 · 52 · 76. Headings use line-height 1.05, body 1.6.
No all-caps labels, no monospace, no tracked eyebrows.

## Spacing and layout

- 8px base: 8, 16, 24, 32, 48, 64, 96, 128.
- Content width 1120px, side gutter 24px (16px on phones). Section spacing 96px (64px on phones).
- Everything left-aligned. Case studies: summary block, then a sticky table of contents on the left (desktop) and
  the narrative on the right.

## Shape and depth

- Radius: 3px on buttons and inputs; card images keep their own printed corners; panels have no radius.
- One shadow, for card images and screenshots only: `0 18px 36px rgba(23,15,11,.28)`.
- Structure is drawn with hairlines (`--rule`), not boxes.

## Components

- **Primary button**: Sapphire fill, white WAR Caption 600, 48px tall. Hover Midnight. Focus: 3px gold outline.
- **Secondary button**: 1.5px ink outline (Iron bands: light outline).
- **Text link**: Sapphire, underlined, thicker underline on hover.
- **Summary block** (case studies): definition list of Role, Team, Timeline, Tools, Links.
- **Project row** (home): thumbnail, title, one-line pitch, role and years, "Read the case study".
- **Figure**: image + WAR Display caption that says what to notice.

## Imagery

Only real material: card renders, card frame versions, screenshots of Daniel's own sites, data from his
spreadsheets. No stock art, no AI art, no emoji, no icon sets beyond the WAR glyphs.

## Motion

None. Nothing animates on load, scroll or hover beyond link and button colour changes.

## Project pages

WAR-TCG and CHARDSS have their own websites, so their portfolio pages are short overviews (the game, what I did) with a
"More on the … website" list linking to each site's design notes, updates, rules and cards. The detailed design
thinking lives on those sites (WAR-TCG: `/design` and the Updates feed; CHARDSS: `/design/`). Glory, Expanchess and The
Wondering Emperor keep their detail here (Glory's site is only the game).

## Project themes

Each project page uses its own game's look on top of the shared layout (`body.theme-*` in `styles.css`). The site
header, navigation and footer stay the same everywhere.

| Page | Source of the theme | Background / text / accent | Type |
|---|---|---|---|
| WAR-TCG | The WAR-TCG card database's dark theme | `#140b06` / `#f3e3c3` / gold `#d6a756` | WAR Caption + WAR Text |
| CHARDSS | CHARDSS website DESIGN.md (ebony, walnut, parchment, brass) | `#1e140e` / `#ead9b0` / brass `#c9a24e` | Chardss Display + Alegreya Sans |
| Glory | The game's dark UI and sand hex tiles | `#161a15` / `#ece6d6` / sand `#e0a868` | Alagard (the game's font) + Alegreya Sans |
| Expanchess | Colours only, no logo or art (Daniel's choice) | `#0b1020` / `#eef0f6` / gold `#e2c25b` | Portfolio fonts |
| The Wondering Emperor | Brass, parchment and ink (no art yet) | `#efe6d2` / `#2b2118` / brass `#7a5a22` | IM Fell English + WAR Text |
| One Piece, Community, Timeline, Home | Portfolio base (no Bandai assets) | as above | WAR Caption + WAR Text |

## Timeline

`timeline.html` holds the data (`ENTRIES`); `timeline.js` lays it out: a centre line, a branch for each entry at its
start date, a coloured line running down to its end date for things that lasted, and "Present (Month Year)" at the
bottom. Before 2021 the scale is compressed. Under 760px it becomes a simple list on a left rail.

## Wikilinks

Key terms link to where they're explained, like links in an Obsidian vault. Hovering or focusing one shows a short
preview card; on touch screens the first tap shows the card and the second follows the link. Write `[[key]]` or
`[[key|label]]` in any page, add the key to `tools/glossary.py` (title, target, one-line preview), then run
`python3 tools/wikilinks.py`, which converts the markers and regenerates `wiki-data.js`. Wikilinks are dotted-underlined
in the page's accent colour to set them apart from ordinary links.

## Visit notifications

`notify.js` sends one ntfy.sh push per browser session ("Someone opened <page> (from <site>)"). No cookies and no
personal data; bots and automated browsers are skipped. Opening any page with `?me=1` stops notifications from that
browser; `?me=0` turns them back on. (The footer note about this was removed on Daniel's request on 2026-10-26.)

History: a LaunchAgent on Daniel's Mac (`com.danielvekar.portfolio-visits`, script in
`~/Library/Application Support/PortfolioVisits/watch.sh`) saves every visit to `Portfolio visits.csv` there, with a
shortcut on the Desktop, and shows a pop-up. ntfy.sh keeps messages about 12 hours, so visits made while the Mac is
off longer than that are lost, unless the checker below has saved them.

The private repo TheVaus/portfolio-visits has a GitHub Actions job (every 10 hours) that saves every visit from ntfy.sh to
`visits.csv` and shows totals and the latest visits in its README. That's the complete history, Mac on or off.

## The cube page

`cube.html` shows the One Piece TCG cube: format rules, the Rainbow Luffy card (`img/cube/`) and every version of the
card list (`cube/vN-YYYY-MM.txt`, listed in `cube/versions.json`, drawn by `cube.js`). The current list lives in the
private repo TheVaus/OPTCG-Cube (`cube.txt`). A weekly scheduled Claude task (Mondays 08:37 Israel time) runs
`tools/sync_cube.py` against it and commits a new version when the cards change.
