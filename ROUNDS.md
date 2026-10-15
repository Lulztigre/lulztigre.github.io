# Design Competition & Theme Heritage Ledger

This document tracks all design competition rounds, winners, component lineage, and mockup artifacts across models (`agy`, `mimo`, `deepseek`). All autonomous coding agents and collaborators should consult this ledger before iterating on themes or building new rounds.

---

## 🏆 Round Summary Ledger

| Round | Theme / Concept | Winner | Core Lineage & Contributions | Mockup File | Live Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R1** | **Uchiha / Bloodmoon** | **Mimo** | • **Header font & typography base**: Agy (`Shippori Mincho`, `Crimson Pro`)<br>• **Visual layout & crimson palette**: Mimo<br>• **Giant Mangekyō Sharingan background**: Agy (custom SVG overlay) | [`mimo.html`](file:///C:/Users/moyoo/lulztigre.pw/mimo.html)<br>[`agy.html`](file:///C:/Users/moyoo/lulztigre.pw/agy.html) | **Active in production** (`[data-theme="uchiha"]`) |
| **R2** | **Ghost → Floral (Ecosystem)** | **Agy** | • **Field Notes & Botanical Architecture**: Agy (`agyghost.html`)<br>• **Canvas**: Creamy warm parchment (`#faf6ec`) with active drifting petals (`🌸 PETALS: ON`) and gentle botanical petal motion<br>• **Typography**: Classical serif `Merriweather` (headers), typewriter `Courier Prime` (body), and `Special Elite` (stamps)<br>• **Organic elements**: Leaf flasher (🌿), `id=(seed)` badge, pressed fern frond across all pages<br>• **Greenhouse Radar**: Adapted from Mimo (`mimoghost.html` greenhouse radar with seed targets) | [`agyghost.html`](file:///C:/Users/moyoo/lulztigre.pw/agyghost.html)<br>[`mimoghost.html`](file:///C:/Users/moyoo/lulztigre.pw/mimoghost.html) | **Active in production** (`[data-theme="floral"]`) |
| **R3** | **Phantom (Spectral Wraith)** | **DeepSeek** | • **Winner**: DeepSeek (`deepseekphantom.html`)<br>• **Fonts, borders & boxes**: Mimo (`mimophantom.html` Orbitron headers, layered tactical boxes, sharp borders)<br>• **Motes & Beam**: Agy (`agyphantom.html` floating motes and laser sweep beam)<br>• **Sigil**: Specter from Agy (👻)<br>• **Badge**: `id=(phantom)` | [`deepseekphantom.html`](file:///C:/Users/moyoo/lulztigre.pw/deepseekphantom.html)<br>[`agyphantom.html`](file:///C:/Users/moyoo/lulztigre.pw/agyphantom.html)<br>[`mimophantom.html`](file:///C:/Users/moyoo/lulztigre.pw/mimophantom.html) | Ready for deployment / production theme rollout |

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

### Round 2: Ghost → Floral (Botanical Field Notes)
- **Prompt & Concept**: Transition the austere black-and-white Ghost terminal theme into an organic, living ecosystem resembling scientific botanical field notes.
- **Winning Implementation**: `Agy` (`agyghost.html`)
- **Key Component Attribution**:
  - **Typography**: Classical serif *Merriweather* for botanical headers and titles, typewriter serif *Courier Prime* for scientific field notes body text, and *Special Elite* for classified herbarium stamps.
  - **Canvas & Palette**: Warm creamy parchment ground (`#faf6ec`), deep Forest Green text (`#2e8b57`), Moss Green borders/accents (`#8a9a5b`), Fern Green secondary accents (`#4f7942`), and terracotta earth tones (`#c0724a`).
  - **Iconography & Badges**:
    - Lightning icon replaced with a leaf sprig and flower blossom (🌿 🌸), and theme selection toggle styled with the blooming botanical flower sigil (`FLORA`).
    - System root tag updated to `id=(seed)`.
    - Status indicator converted into a budding seed with an organic pulse animation.
    - Header and footer separated by organic vine-like SVG line borders.
    - Pressed fern frond pinned in the left gutter across all pages (Dispatches, About, Archive, Posts).
    - Drifting blossoms and golden pollen pattern active across parchment canvas (`🌸 PETALS: ON`), paired with delicate floating botanical petal animation.
  - **Radar**: Adapted from Mimo (`mimoghost.html`) featuring concentric dashed garden rings, rotated seed targets (`.gtarget`), and central sprout icon (`🌱 LZ-994`).
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
