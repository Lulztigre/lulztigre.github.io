# ⚡ LLM Radar Clock CLI & Terminal Plugin v2.0

> **Live GLM, DeepSeek, MiniMax, Kimi & Qwen Peak Hours Surge Tracker & Off-Peak Discount Telemetry**  
> Cross-platform high-definition vector radar clock, tmux plugin, Starship custom module, workload gatekeeper, and token optimizer for Linux, macOS, and Windows.

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Platform](https://img.shields.io/badge/Platform-Linux%20|%20macOS%20|%20Windows-brightgreen?style=flat)]()
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Stdlib)-blue)]()
[![License](https://img.shields.io/badge/License-MIT-purple)]()

Web Version: **[lulztigre.pw/llm-clock.html](https://lulztigre.pw/llm-clock.html)**  
GitHub Repository: **[github.com/lulztigre/lulztigre.github.io](https://github.com/lulztigre/lulztigre.github.io)**

---

## 🛰️ Overview

The **LLM Radar Clock** monitors real-time pricing surge vs off-peak discount windows for **Z.ai GLM** (GLM-5.3), **DeepSeek** (DeepSeek-V4 Pro & Flash), **Qwen / Qoder** (Qwen-Coder-Qoder & 3.8-Max), **MiniMax**, and **Moonshot / Kimi** APIs based on official Beijing (UTC+8 / CST) & UTC surge schedules.

| AI Model / Provider | Peak Window (UTC+8 CST, Mon-Fri) | Peak Surge Rate | Off-Peak Rate | Weekend Policy |
| :--- | :--- | :--- | :--- | :--- |
| **GLM-5.3 / GLM-5-Turbo** | `14:00 - 18:00` | **3.0× Multiplier** | **1.0× Standard** | 100% Off-Peak All Day |
| **DeepSeek-V4 (Pro & Flash)** | `09:00 - 12:00` & `14:00 - 18:00` | **2.0× Surge** | **1.0× (50% Discount)** | 100% Off-Peak All Day |
| **Qwen / Qoder (Qwen-Coder & Max)** | `08:00 - 22:00` (14:00-00:00 UTC Off-Peak) | **2.0× Standard** | **1.0× (50-80% Disc.)** | 100% Off-Peak All Day |
| **MiniMax-01 / Babble-Pro** | `10:00 - 12:00` & `15:00 - 18:00` | **1.5× Surge** | **1.0× Standard** | 100% Off-Peak All Day |
| **Moonshot / Kimi K1.5 & K2** | `09:30 - 11:30` & `14:30 - 17:30` | **2.0× Surge** | **1.0× Standard** | 100% Off-Peak All Day |

---

## ⚡ Quick Installation

### Option 1: Instant Single-Line Run (No clone or install needed)

**Linux & macOS:**
```bash
# Run interactive vector radar clock directly
curl -sSL https://raw.githubusercontent.com/lulztigre/lulztigre.github.io/main/llm_clock.py | python3
```

**Windows (PowerShell / Windows Terminal):**
```powershell
irm https://raw.githubusercontent.com/lulztigre/lulztigre.github.io/main/llm_clock.py | python
```

### Option 2: Install as CLI package via pip / pipx

```bash
# Global pip install from repository
pip install git+https://github.com/lulztigre/lulztigre.github.io.git
```

Or install with `pipx`:
```bash
pipx install git+https://github.com/lulztigre/lulztigre.github.io.git
```

Then run anywhere:
```bash
llm-clock
```

---

## 🖥️ Interactive Radar TUI Features

Launch the interactive high-definition vector radar display:
```bash
llm-clock
```

```
┌─ LLM_CLOCK // TACTICAL TELEMETRY RADAR v2.0 ──────────────────────────────────────────────────┐
│                                      │  PROVIDER:   GLM-5.3 / GLM-5-Turbo (Zhipu AI (Z.ai))      │
│             ⢀⣀⠤⠤⠒⠒⠖⠒⠲⠤⢤⣀             │  STATUS:     [STATE: PEAK_SURGE // 3.0X COEFFICIENT]      │
│          ⢀⡤⠊⠉           ⠙⠲⢄          │  RATE COEFFICIENT: 3.0× SURGE RATE                        │
│        ⢀⠔⠉           ⡜   ⢀⠔⠑⣄        │  COUNTDOWN:  03h 15m 00s (Off-Peak Discount)              │
│       ⢠⠋      ⢀⡠⠤⠤⠤⠤⡼⣀ ⢀⠔⠁  ⠈⢳⣶⡀     │  BEIJING (UTC+8): 2026-08-27 14:45:00 CST                 │
│      ⢠⠇     ⢀⠔⠉    ⢠⠃⢈⠕⢅      ⢻⣷     │  WORKSTATION:    2026-08-27 07:45:00 Local                │
│      ⡞     ⢀⠏     ⢀⢇⠔⠁ ⠈⢇     ⠘⣿⡆    │  SURGE WINDOWS:  14:00-18:00 UTC+8 (Mon-Fri)              │
│      ⡇⠠   ⣀⣸⣀⣀⣀⡠⠤⠤⣾⠥⠒⠒⠒⠊⢹⠁   ⠠ ⣿⡇    │  DIAL / THEME:   12H Reticle │ VOID PHOSPHOR              │
│      ⣇ ⠉⠉⠉ ⠘⡄           ⡜     ⢀⣿⡇    │  ────────────────────────────────────────────             │
│      ⠸⡄     ⠙⢄        ⢀⠜⠁     ⣸⣿     │  3.0x quota surge active! Quota consumes at 3x rate. Defe │
│       ⠱⡀      ⠙⠢⠤⠤⠤⠤⠤⠚⠁      ⣰⣿⠃     │  [P] Provider  [M] 12/24h  [T] Theme  [S] Scrub  [K] Calc  [Q] Exit│
│        ⠙⢄                  ⢀⣾⡿⠃      │                                                           │
│          ⠙⠦⡀            ⢀⣠⣴⡿⠋        │                                                           │
│            ⠈⠙⠒⠤⠤⣀⣀⣄⣀⣠⣤⣴⣶⠿⠛⠉          │                                                           │
│                   ⠛⠛⠛⠉⠉              │                                                           │
├─ GLOBAL METROPOLIS SURGE MATRIX (LIVE TIMEZONE CONVERSION) ───────────────────────────────────┤
│  [CN/SG] Beijing / Singapor 14:45 PEAK (3.0X) │  [JP/KR] Tokyo / Seoul      15:45 PEAK (3.0X) │
│  [UK/EU] London (UTC+0/1)   07:45 PEAK (3.0X) │  [EU] Paris / Berlin     08:45 PEAK (3.0X)    │
│  [US-E] New York (EDT)     02:45 PEAK (3.0X)  │  [US-W] San Francisco (PDT 23:45 PEAK (3.0X)  │
│  [IN] Bengaluru (IST)    12:15 PEAK (3.0X)    │  [AU] Sydney (AEST)      16:45 PEAK (3.0X)    │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 🎮 Keyboard Controls

- `p` : Cycle AI Providers (`GLM` ➔ `DeepSeek` ➔ `MiniMax` ➔ `Kimi` ➔ `Qwen`)
- `m` : Toggle Reticle Mode (`12-Hour` ⟷ `24-Hour` Reticle)
- `t` : Cycle Visual Themes (`Void Green`, `Tactical CRT Amber`, `Bloodmoon Threat`, `Arctic Horizon`, `Synthwave Neon`)
- `s` or `←` / `→` : **Time-Travel Scrubber** (Scrub ±30m forward/backward in time to simulate pricing at any hour)
- `r` : Reset time scrubber back to real-time live clock
- `k` : **Interactive Token / Cost Calculator**
- `q` : Exit

---

## 🛑 Workload Gatekeeper (`wait-offpeak`)

Block execution of automated scripts, agent sweeper loops, and CI/CD jobs until the off-peak discount window opens:

```bash
# Block until off-peak discount is active, then execute heavy agent workflow
llm-clock --provider glm --wait-offpeak && python run_repo_indexing.py
```

Outputs a live countdown spinner and chime before exiting with code 0:
```
⚡ [GATEKEEPER] Monitoring GLM-5.3 / GLM-5-Turbo Peak Hours Surge...
⠋ PEAK SURGE ACTIVE (3.0x) ⏳ Off-peak resumes in: 03h 14m 20s
```

---

## 📊 Multi-Provider Matrix View

Compare the live status of all major Chinese LLM API providers simultaneously:

```bash
llm-clock -p all
```

Output:
```
┌─ LLM_CLOCK // MULTI-PROVIDER PRICING MATRIX ────────────────────────┐
│  BEIJING CST: 2026-08-27 14:45:00 (UTC+8)                             │
├────────────────────────┬─────────────┬────────────┬─────────────────┤
│  MODEL / PROVIDER      │  STATE      │  RATE      │  NEXT PHASE     │
├────────────────────────┼─────────────┼────────────┼─────────────────┤
│  GLM                   │  PEAK SURGE │  3.0×      │  03h 15m 00s    │
│  DeepSeek              │  PEAK SURGE │  2.0×      │  03h 15m 00s    │
│  Qwen/Qoder            │  PEAK SURGE │  2.0×      │  07h 15m 00s    │
│  MiniMax               │  OFF-PEAK   │  1.0× (50%)│  00h 15m 00s    │
│  Kimi                  │  PEAK SURGE │  2.0×      │  02h 45m 00s    │
└────────────────────────┴─────────────┴────────────┴─────────────────┘
```

---

## 🧩 Statusline & Prompt Plugins

### 🟢 Tmux (`~/.tmux.conf`)
```tmux
set -g status-right '#(llm-clock --provider glm --format tmux) | %H:%M '
set -g status-interval 15
```

### 🚀 Starship Prompt (`~/.config/starship.toml`)
```toml
[custom.llm_clock]
command = "llm-clock --provider deepseek --format starship"
when = "true"
style = "bold green"
format = "[$output]($style) "
```

### 🐚 Linux Zsh / Bash Prompt (`~/.zshrc` or `~/.bashrc`)
```bash
# Right prompt in Zsh
RPROMPT='$(llm-clock --format short)'

# Quick CLI alias
alias llm='llm-clock --format short'
```

### 🪟 Windows PowerShell Profile (`$PROFILE`)
```powershell
function Get-LLMPeakStatus {
    python (Get-Command llm_clock.py).Source --format short
}
```

### 📊 Waybar / i3blocks / Polybar (Linux)
```bash
llm-clock --provider glm --format waybar
```

---

## 📜 License

MIT License. Open source and free for developers worldwide.
