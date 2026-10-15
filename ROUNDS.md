# Design Competition & Theme Heritage Ledger

This document tracks all design competition rounds, winners, component lineage, and mockup artifacts across models (`agy`, `mimo`, `deepseek`). All autonomous coding agents and collaborators should consult this ledger before iterating on themes or building new rounds.

---

## 🏆 Round Summary Ledger

| Round | Theme / Concept | Winner | Core Lineage & Contributions | Mockup File | Live Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R1** | **Uchiha / Bloodmoon** | **Mimo** | • **Header font & typography base**: Agy (`Shippori Mincho`, `Crimson Pro`)<br>• **Visual layout & crimson palette**: Mimo<br>• **Giant Mangekyō Sharingan background**: Agy (custom SVG overlay) | [`mimo.html`](file:///C:/Users/moyoo/lulztigre.pw/mimo.html)<br>[`agy.html`](file:///C:/Users/moyoo/lulztigre.pw/agy.html) | **Active in production** (`[data-theme="uchiha"]`) |
| **R2** | **Ghost → Floral (Flora Ecosystem)** | **Agy** | • **Field Notes & Botanical Architecture**: Agy (`agyghost.html`)<br>• **Canvas**: Crisp botanical parchment (`#fcfaf5`), pure white card surfaces (`#ffffff`), hunter green headings (`#1B4D3E`), moss green borders (`#8A9A5B`), and sage drop shadows (`#c3d2ab`)<br>• **Typography**: Classical serif `Playfair Display` (700 headers), typewriter `Courier Prime` (body), and `Special Elite` (stamps)<br>• **Organic elements**: Leaf emoji toggle (`🌿 FLORA`), circular botanical crest (`.flora-crest-svg`), `id=(flora)` badge, leaf-vein watermark statement box with corner stem flourishes and wavy vow underline, and subtle pollen pattern | [`agyghost.html`](file:///C:/Users/moyoo/lulztigre.pw/agyghost.html) | **Active in production** (`[data-theme="floral"]`) |
| **R3** | **Phantom (Spectral Wraith)** | **DeepSeek** | • **Winner**: DeepSeek (`deepseekphantom.html`)<br>• **Fonts, borders & boxes**: Mimo (`mimophantom.html` Orbitron headers, layered tactical boxes, sharp borders)<br>• **Motes & Beam**: Agy (`agyphantom.html` floating motes and laser sweep beam)<br>• **Sigil**: Specter from Agy (👻)<br>• **Badge**: `id=(phantom)` | [`deepseekphantom.html`](file:///C:/Users/moyoo/lulztigre.pw/deepseekphantom.html)<br>[`agyphantom.html`](file:///C:/Users/moyoo/lulztigre.pw/agyphantom.html)<br>[`mimophantom.html`](file:///C:/Users/moyoo/lulztigre.pw/mimophantom.html) | Ready for deployment / production theme rollout |
| **R4** | **Phosphor (Cathode Ray Terminal)** | **GLM** | • **Overall Winner / Chassis Base**: GLM (`glmphospor.html` CRT glass stack, rolling refresh bar, power strike, vignette, inverse vow bar)<br>• **Typography**: Mimo (`mimophosphor.html` `VT323` display headers with beam convergence wobble, `Share Tech Mono` & `Space Mono` body)<br>• **Radar**: Agy (`agyphosphor.html` vector oscilloscope chassis, 20px grid reticle, concentric rings & 360° sweeping beam) | [`glmphospor.html`](file:///C:/Users/moyoo/lulztigre.pw/glmphospor.html)<br>[`mimophosphor.html`](file:///C:/Users/moyoo/lulztigre.pw/mimophosphor.html)<br>[`agyphosphor.html`](file:///C:/Users/moyoo/lulztigre.pw/agyphosphor.html)<br>[`deepseekphosphor.html`](file:///C:/Users/moyoo/lulztigre.pw/deepseekphosphor.html) | **Active in production** (`[data-theme="phosphor"]`) |
| **R5** | **Cobalt (Cyanotype Light Blue Sheet & Reactor Acoustics)** | **DeepSeek & GLM** *(Joint Winners)* | • **Canvas & Borders**: DeepSeek (`deepseekcobalt.html` Cyanotype light blue stock `#b8d7f2` — not white, drafting borders with zone ticks `1–4` / `A–D`, corner registration crosses, corner engineering title block, dimension witness lines, 45° hatching, redline vow in Architects Daughter, subtle observable water sheen wash)<br>• **Reactor Optics & Brand**: GLM (`glmcobalt.html` 7x5 cellular Core Map lattice with migrating hot fuel cell, rotating radiation trefoil brand with `Chakra Petch`, suspended boil bubbles)<br>• **Acoustic Sonar**: Agy (`agycobalt.html` native Web Audio API hydro-acoustic chirp synthesizer, Doppler indicators, vector sonar canvas HUD)<br>• **System Tag**: `id=(co29)`<br>• **Dead Last**: Copilot (4th consecutive loss) | [`agycobalt.html`](file:///C:/Users/moyoo/lulztigre.pw/agycobalt.html)<br>[`deepseekcobalt.html`](file:///C:/Users/moyoo/lulztigre.pw/deepseekcobalt.html)<br>[`glmcobalt.html`](file:///C:/Users/moyoo/lulztigre.pw/glmcobalt.html) | Revamped synthesis in [`agycobalt.html`](file:///C:/Users/moyoo/lulztigre.pw/agycobalt.html) |

---

## 📜 Detailed Round Breakdown

### Round 1: Uchiha / Bloodmoon
- **Prompt & Concept**: High-contrast dark cyber-occult aesthetic inspired by the Uchiha clan and the crimson moon.
- **Winning Implementation**: `mimo`
- **Key Component Attribution**:
  - **Header & Title Fonts**: Borrowed from `agy`'s initial proposal using Japanese-styled serif *Shippori Mincho* paired with *Crimson Pro* for body hierarchy and crimson text glow (`text-shadow: 0 0 12px rgba(230, 57, 70, 0.65)`).
  - **Atmospheric Background**: Styled giant Mangekyō Sharingan geometry embedded as a low-opacity SVG background with subtle spin and pulse effects.
  - **Terminal / Dossier Structure**: Monospace telemetry indicators, blood-red badges (`id=(root)`), and sharp cybernetic borders.
- **Associated Mockup Files**:
  - Agy: [`agy.html`](file:///C:/Users/moyoo/lulztigre.pw/agy.html), [`agy_about.html`](file:///C:/Users/moyoo/lulztigre.pw/agy_about.html)
  - Mimo: [`mimo.html`](file:///C:/Users/moyoo/lulztigre.pw/mimo.html), [`mimo_about.html`](file:///C:/Users/moyoo/lulztigre.pw/mimo_about.html)
  - DeepSeek: [`deepseeek.html`](file:///C:/Users/moyoo/lulztigre.pw/deepseeek.html), [`deep_about.html`](file:///C:/Users/moyoo/lulztigre.pw/deep_about.html)

---

### Round 2: Ghost → Floral (Flora Ecosystem / Botanical Field Notes)
- **Prompt & Concept**: Transition the austere black-and-white Ghost terminal theme into an organic, living ecosystem resembling scientific botanical field notes.
- **Winning Implementation**: `Agy` (`agyghost.html`)
- **Key Component Attribution**:
  - **Typography**: Classical serif *Playfair Display* (700) for botanical headers and titles, italic serif for quote blocks and terracotta heading accents (`.accent-terra-italic`), typewriter monospace *Courier Prime* for scientific field notes body text, and *Special Elite* for classified herbarium stamps.
  - **Canvas & Palette**: Crisp botanical parchment ground (`#fcfaf5`), pure white card surfaces (`#ffffff`), Hunter Green text (`#1B4D3E`), Sea Green highlights (`#2E8B57`), Moss Green borders (`#8A9A5B`), Sage Green drop shadows (`rgba(138, 154, 91, 0.28)`), and terracotta earth accents (`#944E38`).
  - **Iconography & Badges**:
    - Header brand crest: Circular botanical crest SVG (`.flora-crest-svg`) with dark green stem, leaves, and berry bud.
    - Theme selection toggle: Clean white button with green border (`#2E8B57`) and leaf emoji (`🌿 FLORA`).
    - System root tag updated to `id=(flora)` in sage-tinted pill badge (`#eaf2eb` / `#8A9A5B`).
    - Flasher and pronounce line: Botanical leaf marker (`🌿`).
    - Herbarium certified specimen rotating seal SVG stamp (`HERBARIUM • LZ-994 • SPECIMEN •`).
    - Statement box: Pressed leaf-vein watermark SVG background, berry stem corner flourishes (`.statement-corner-tl` / `.statement-corner-br`), italic quote, and pink border with wavy underline on the vow line.
    - Header and footer separated by organic vine-like SVG line borders.
    - Corner watermark branch: Low-opacity top-right branch (`opacity: 0.09`) in Hero section.
    - Canvas background: Subtle repeating blossom and pollen SVG pattern in `body::before` (detaching from the heavy falling sakura petal canvas).
  - **Radar Integration**: Mimo's greenhouse telemetry radar (`.garden` from `mimoghost.html`) featuring concentric dashed rings (`.gring.o`, `.gring.m`, `.gring.i`), crosshairs (`.gaxis.x`, `.gaxis.y`), breathing teardrop seed targets (`.gtarget` with `@keyframes seedPulse`), and center core insignia (`🌱 LZ-994`), integrated directly into Agy's botanical chassis.
- **Associated Mockup Files**:
  - Agy: [`agyghost.html`](file:///C:/Users/moyoo/lulztigre.pw/agyghost.html)
  - Mimo: [`mimoghost.html`](file:///C:/Users/moyoo/lulztigre.pw/mimoghost.html)
  - DeepSeek: [`deepseekghost.html`](file:///C:/Users/moyoo/lulztigre.pw/deepseekghost.html)

---

### Round 3: Phantom (Spectral Wraith & Tactical HUD)
- **Prompt & Concept**: Ethereal, phantom-ops aesthetic featuring spectral radar telemetry, haunting typography, and wraith graphics.
- **Winning Implementation**: `DeepSeek` (`deepseekphantom.html`)
- **Key Component Attribution**:
  - **DeepSeek Core Heritage (Winner)**:
    - Overall concept, spectral radar summon HUD, and `.phantom-wraith` creature graphic drawn as an inline SVG data URI.
    - Specialized cyber-occult ward circle, signature corner ornaments, and tactical radar telemetry.
  - **Mimo Contributions**:
    - Typography pairing (`Orbitron` headers, monospace hierarchy).
    - Box framing, card containment, layered containers, and sharp border system.
  - **Agy Contributions**:
    - Floating phantom motes (`.phantom-motes`) rising across the interface.
    - Laser scanner sweep beam (`heroScanSweep`) traversing hero banners.
    - Sigil Specter (`👻`) icon on the theme toggle button and phonetic flasher slot.
    - System root tag updated to `id=(phantom)`.
- **Associated Mockup Files**:
  - Agy: [`agyphantom.html`](file:///C:/Users/moyoo/lulztigre.pw/agyphantom.html)
  - Mimo: [`mimophantom.html`](file:///C:/Users/moyoo/lulztigre.pw/mimophantom.html)
  - DeepSeek: [`deepseekphantom.html`](file:///C:/Users/moyoo/lulztigre.pw/deepseekphantom.html)

---

### Round 4: Phosphor (P1 / P31 High-Persistence Cathode Ray Terminal)
- **Prompt & Concept**: Monochrome green cathode-ray tube terminal viewed through curved glass, featuring scanlines, shadow mask, rolling refresh band, electron persistence decay, and amber alerts.
- **Winning Implementation**: `GLM` (`glmphospor.html`)
- **Key Component Attribution**:
  - **GLM Core Heritage (Winner & Base Architecture)**:
    - **CRT Glass Stack**: Fixed full-screen cathode ray overlay stack (`.phos-glass`) composed of horizontal raster scanlines, aperture grille shadow mask, rolling refresh sync bar, spherical tube curvature vignette, and hardware curved bezel.
    - **Cathode Ray Lifecycle**: Power-on strike beam (`.phos-power`) expanding into vertical bloom, tube persistence decay engine (`@keyframes phosDecay`), and degauss shockwave wobble.
    - **Hardware Indicators & Badges**: Hardware ticker diodes (`.phos-diode` for PWR, RASTER, P1 nm), solid terminal block cursor (`.phos-cursor`) replacing emojis, and system tag `id=(p69)`.
    - **Dossier & Statements**: High-contrast inverse-video vow line bar (`statement-quote strong`), base-16 hex corner tags ("0x") seared on cards, and amber (`#ffb000`) critical alert strobe.
  - **Mimo Contributions (Typography)**:
    - **Header & Display Face**: Retro terminal matrix font `VT323` paired with `Share Tech Mono` for titles, navigation, and badges.
    - **Convergence Wobble**: Electron-beam convergence settling animation (`@keyframes converge`) on headline elements.
    - **Body Font**: Structured monospace pairing (`'Share Tech Mono', 'Space Mono', monospace`) for crisp terminal documentation readability.
    - **Persistence Text Shadows**: Layered glowing afterglow text shadows (`0 0 4px rgba(242, 255, 244, 0.9), 0 0 14px rgba(77, 255, 106, 0.7)`).
  - **Agy Contributions (Vector Oscilloscope & Sweeping Radar)**:
    - **Radar Frame & Reticle**: P31 vector oscilloscope chassis with dark cathode glass (`#010602`), green border bezel (`#22bb3b`), inset glow, and 20px x 20px phosphor reticle grid.
    - **Center Crosshairs & Concentric Rings**: Axis crosshairs (`.scope-center-axis`, `.scope-center-vaxis`) and concentric vector range rings (100%, 66%, 33%).
    - **360° Vector Sweep Beam**: Rotating radar beam with phosphor persistence tail and decay wash.
    - **Phosphor Radar Targets**: Illuminated, pulsing blips marking active CVEs and coordinated pipeline discoveries.
- **Associated Mockup Files**:
  - GLM: [`glmphospor.html`](file:///C:/Users/moyoo/lulztigre.pw/glmphospor.html)
  - Mimo: [`mimophosphor.html`](file:///C:/Users/moyoo/lulztigre.pw/mimophosphor.html)
  - Agy: [`agyphosphor.html`](file:///C:/Users/moyoo/lulztigre.pw/agyphosphor.html)
  - DeepSeek: [`deepseekphosphor.html`](file:///C:/Users/moyoo/lulztigre.pw/deepseekphosphor.html)

---

### Round 5: Cobalt (Cyanotype Light Blue Blueprint & Reactor Hydro-Acoustics)
- **Prompt & Concept**: Blue-water naval engineering and nuclear reactor research facility theme, synthesized from the top model innovations.
- **Winning Implementations**: **DeepSeek & GLM** (Joint Winners), synthesized into **[`agycobalt.html`](file:///C:/Users/moyoo/lulztigre.pw/agycobalt.html)**.
- **Key Component Attribution**:
  - **DeepSeek Contributions (Visual Architecture, Sheet Canvas & Drafting Language)**:
    - **Cyanotype Light Blue Sheet Ground**: Authentic light blue blueprint stock (`#b8d7f2`, replacing plain white) paired with deep Prussian navy ink (`#062a55`), architectural blue secondary inks, and light blue card containers (`#cee3f8` / `#c4ddf6`).
    - **Drafting Border System**: Double hairline rules with perimeter coordinate zone ticks (`1–4`, `A–D`) and four corner optical alignment registration crosses.
    - **Corner Engineering Title Block**: Bottom-right drafting drawing plate (`DRG NO LZ-994-CO29`, `TITLE: CYANOTYPE LIGHT BLUE SHEET`, `SCALE: 1:1 FULL`, `REV D`, `ID: CO29`, `DRAWN: LULZTIGRE`, hand note `DEEPSEEK & GLM JOINT WINNER` in Architects Daughter).
    - **Stolen Ocean / Water Sheen Wash**: Observable, subtle wave ripples (`.cobalt-wash`) flowing across the light blue stock with deep cobalt stroke paths (`#0f4c8a`), providing an authentic cyanotype developing bath wash without compromising text contrast.
    - **Drafting Typography & Markings**: Single-stroke technical titling in `Saira Condensed`, typed technical annotation in `Roboto Mono`, dimension witness lines (`.cobalt-dim`), 45° hatched stat tiles, and redline pen vow note in `Architects Daughter` with wavy underline.
  - **GLM Contributions (Reactor Optics, Trefoil Identity & Bubble Physics)**:
    - **7x5 Cellular Core Map Lattice**: Dynamic reactor core lattice (`.coremap-cells`) tracking fuel pin flux with an autonomous wandering hot fuel cell (`.core-cell.hot`) and thermal dispersion ring (`.core-cell.warm`).
    - **Lulztigre Brand Identity**: Rotating cobalt radiation trefoil SVG mark (`.cob-mark`) paired with `Chakra Petch` geometric brand font.
    - **Suspended Boil**: Gentle rising bubble physics (`.cobalt-boil`) with translucent radial gradients floating up the viewport.
  - **Agy Contributions (Active Hydro-Acoustic Sonar Engine)**:
    - **Native Web Audio API Sonar Synth**: Zero-dependency audio synthesizer generating real 880Hz → 1760Hz chirped sonar pings with reverberant decay, mechanical relay clicks, and emergency SCRAM bass thuds.
    - **Vector Sonar Canvas HUD**: Expanding hydro-acoustic wave fronts, Doppler frequency indicators (`+4.2 Hz UP`), bearing tracking (`042.8° TRUE`), range telemetry (`1,420 YDS`), and detected target blips.
    - **Multi-Instrument Switcher**: Seamless live toggle in the telemetry chassis between GLM's Core Map lattice and Agy's Sonar HUD.
  - **Badge Identity**: Unified to `id=co29` across header pill, title block, and telemetry metadata.
  - **Copilot Standing**: Placed dead last for the 4th consecutive round due to repetitive layout bloat and unrefined styling.
- **Associated Mockup Files**:
  - Revamped Synthesis: [`agycobalt.html`](file:///C:/Users/moyoo/lulztigre.pw/agycobalt.html)
  - DeepSeek: [`deepseekcobalt.html`](file:///C:/Users/moyoo/lulztigre.pw/deepseekcobalt.html)
  - GLM: [`glmcobalt.html`](file:///C:/Users/moyoo/lulztigre.pw/glmcobalt.html)
  - Mimo: [`mimocobalt.html`](file:///C:/Users/moyoo/lulztigre.pw/mimocobalt.html)
  - Copilot: [`copilotcobalt.html`](file:///C:/Users/moyoo/lulztigre.pw/copilotcobalt.html)

---

## 🤖 Instructions for Autonomous Agents Reading This Document

1. **Check Prior Heritage Before Starting a New Round**:
   - Always review which components were praised or chosen in earlier rounds (e.g., Agy typography, DeepSeek radar/SVG graphics, Mimo borders and layout polish).
2. **Naming Conventions**:
   - Save candidate mockups using the pattern `{modelname}{themename}.html` (e.g., `agyphantom.html`, `mimophantom.html`, `deepseekphantom.html`).
   - For multi-page tests, append `_{page}.html` (e.g., `agy_about.html`).
3. **Cross-Pollination Policy**:
   - When permitted by the user, inspect competitor files (`mimo*.html`, `deepseek*.html`, `agy*.html`) to extract and synthesize the strongest UI components, SVGs, and font pairings.
4. **Updating This File**:
   - When a new round concludes, append the results to the ledger above with the winner, key attribution credits, and linked mockup files.
