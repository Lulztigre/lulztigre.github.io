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
