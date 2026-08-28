#!/usr/bin/env python3
"""
LLM Radar Clock CLI & Terminal Plugin v2.5 (High-Precision Edition)
Live Peak Hours Surge Tracker, Vector Radar Reticle & Off-Peak Discount Telemetry.

Features:
  - High-Definition Unicode Braille Sub-Pixel Vector Dial Canvas (72x64 sub-pixel resolution)
  - Mature analog face: graduated bezel, cardinal numerals, smooth-sweep second hand
  - Broad hour hand, slim minute hand and counterweighted second needle with center hub
  - Peak surge window arc markers on the bezel and 24-hour timeline horizon bar
  - Multi-Provider Matrix: GLM-5.3, DeepSeek-V4 (Pro & Flash), MiniMax, Moonshot/Kimi, Qwen
  - Interactive TUI: HOLD mode (SPACE) with fine ±1s/±1m scrubbing, coarse time travel (←/→ ↑/↓),
    In-TUI Calculator (k), Dial Modes (m), Themes (t)
  - Workload Gatekeeper (`--wait-offpeak`): Blocks until discount window opens for automated scripts
  - Multi-format Statusline Plugins: Tmux, Starship, Waybar, Polybar, i3blocks, Zsh/Bash, PowerShell
  - Native Cross-Platform: Linux, macOS, and Windows (Windows Terminal, PowerShell, CMD, WezTerm, Kitty, Alacritty)
  - Zero external dependencies (Pure Python 3.9+ Standard Library)
"""

import sys
import os
import time
import math
import json
import argparse
from datetime import datetime, timezone, timedelta

# Ensure UTF-8 output encoding across all platforms
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Enable VT100 ANSI escape sequences on Windows consoles
if sys.platform == "win32":
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        h_stdout = kernel32.GetStdHandle(-11)
        mode = ctypes.c_ulong()
        kernel32.GetConsoleMode(h_stdout, ctypes.byref(mode))
        mode.value |= 0x0004  # ENABLE_VIRTUAL_TERMINAL_PROCESSING
        kernel32.SetConsoleMode(h_stdout, mode)
    except Exception:
        pass

# -------------------------------------------------------------
# PROVIDER CONFIGURATIONS & PEAK WINDOW DEFINITIONS (UTC+8)
# -------------------------------------------------------------
PROVIDERS = {
    "glm": {
        "id": "glm",
        "name": "GLM-5.3 / GLM-5-Turbo",
        "short_name": "GLM",
        "vendor": "Zhipu AI (Z.ai)",
        "peak_multiplier": 3.0,
        "offpeak_multiplier": 1.0,
        "badge_window": "14:00-18:00 UTC+8 (Mon-Fri)",
        "windows": [
            {"start_h": 14, "start_m": 0, "end_h": 18, "end_m": 0, "label": "14:00 - 18:00"}
        ],
        "desc_offpeak": "Standard 1.0x quota rate active. 3x capacity for repo indexing & power agents.",
        "desc_peak": "3.0x quota surge active! Quota consumes at 3x rate. Defer non-critical batch sweeps.",
        "desc_weekend": "100% OFF-PEAK ALL-DAY. Full 1.0x standard quota consumption throughout the weekend."
    },
    "deepseek": {
        "id": "deepseek",
        "name": "DeepSeek-V4 (4-Pro & 4-Flash)",
        "short_name": "DeepSeek",
        "vendor": "DeepSeek AI",
        "peak_multiplier": 2.0,
        "offpeak_multiplier": 1.0,
        "badge_window": "09:00-12:00 & 14:00-18:00 UTC+8 (Mon-Fri)",
        "windows": [
            {"start_h": 9, "start_m": 0, "end_h": 12, "end_m": 0, "label": "09:00 - 12:00"},
            {"start_h": 14, "start_m": 0, "end_h": 18, "end_m": 0, "label": "14:00 - 18:00"}
        ],
        "desc_offpeak": "50% Off-Peak Discount active (standard rate). Tokens billed at half peak surge rate.",
        "desc_peak": "2.0x Peak surge active (standard discount disabled). Input & output charged at 2x rate.",
        "desc_weekend": "100% OFF-PEAK ALL-DAY. Full 50% discount applies across Saturday & Sunday."
    },
    "minimax": {
        "id": "minimax",
        "name": "MiniMax-01 / Babble-Pro",
        "short_name": "MiniMax",
        "vendor": "MiniMax",
        "peak_multiplier": 1.5,
        "offpeak_multiplier": 1.0,
        "badge_window": "10:00-12:00 & 15:00-18:00 UTC+8 (Mon-Fri)",
        "windows": [
            {"start_h": 10, "start_m": 0, "end_h": 12, "end_m": 0, "label": "10:00 - 12:00"},
            {"start_h": 15, "start_m": 0, "end_h": 18, "end_m": 0, "label": "15:00 - 18:00"}
        ],
        "desc_offpeak": "Standard 1.0x rate active. Full throughput for high-concurrency coding batches.",
        "desc_peak": "1.5x Peak surge active. Heavy generation runs should pause for off-peak.",
        "desc_weekend": "100% OFF-PEAK ALL-DAY. Full standard pricing throughout the weekend."
    },
    "kimi": {
        "id": "kimi",
        "name": "Moonshot / Kimi K1.5 & K2",
        "short_name": "Kimi",
        "vendor": "Moonshot AI",
        "peak_multiplier": 2.0,
        "offpeak_multiplier": 1.0,
        "badge_window": "09:30-11:30 & 14:30-17:30 UTC+8 (Mon-Fri)",
        "windows": [
            {"start_h": 9, "start_m": 30, "end_h": 11, "end_m": 30, "label": "09:30 - 11:30"},
            {"start_h": 14, "start_m": 30, "end_h": 17, "end_m": 30, "label": "14:30 - 17:30"}
        ],
        "desc_offpeak": "Standard allowance active. Optimal 200k+ long-context indexing window.",
        "desc_peak": "Peak surge coefficient active. Long-context caching rates elevated.",
        "desc_weekend": "100% OFF-PEAK ALL-DAY. Full unthrottled token allowance active."
    },
    "qwen": {
        "id": "qwen",
        "name": "Qwen / Qoder (Qwen-Coder & 3.8-Max)",
        "short_name": "Qwen/Qoder",
        "vendor": "Qoder / Alibaba Cloud",
        "peak_multiplier": 2.0,
        "offpeak_multiplier": 1.0,
        "badge_window": "08:00-22:00 UTC+8 (00:00-14:00 UTC)",
        "windows": [
            {"start_h": 8, "start_m": 0, "end_h": 22, "end_m": 0, "label": "08:00 - 22:00"}
        ],
        "desc_offpeak": "Qoder 50-80% Off-Peak credit discount active (14:00-00:00 UTC). Max token efficiency for Qwen-Coder-Qoder.",
        "desc_peak": "Peak rate active (00:00-14:00 UTC). Standard credit consumption without off-peak multiplier discount.",
        "desc_weekend": "100% OFF-PEAK ALL-DAY. Full credit multiplier discounts active across weekend."
    }
}

# Provider aliases
PROVIDERS["qoder"] = PROVIDERS["qwen"]
PRIMARY_PROVIDERS = ["glm", "deepseek", "qwen", "minimax", "kimi"]

GLOBAL_CITIES = [
    {"name": "Beijing / Singapore", "tz_offset": 8, "flag": "CN/SG"},
    {"name": "Tokyo / Seoul", "tz_offset": 9, "flag": "JP/KR"},
    {"name": "London (UTC+0/1)", "tz_offset": 1, "flag": "UK/EU"},
    {"name": "Paris / Berlin", "tz_offset": 2, "flag": "EU"},
    {"name": "New York (EDT)", "tz_offset": -4, "flag": "US-E"},
    {"name": "San Francisco (PDT)", "tz_offset": -7, "flag": "US-W"},
    {"name": "Bengaluru (IST)", "tz_offset": 5.5, "flag": "IN"},
    {"name": "Sydney (AEST)", "tz_offset": 10, "flag": "AU"}
]

# Color Themes
THEMES = {
    "void": {
        "name": "VOID PHOSPHOR",
        "accent": "\033[38;2;0;255;136m",
        "sec": "\033[38;2;56;189;248m",
        "peak": "\033[38;2;255;51;68m",
        "amber": "\033[38;2;255;180;0m"
    },
    "amber": {
        "name": "TACTICAL CRT AMBER",
        "accent": "\033[38;2;255;180;0m",
        "sec": "\033[38;2;251;146;60m",
        "peak": "\033[38;2;239;68;68m",
        "amber": "\033[38;2;255;215;0m"
    },
    "bloodmoon": {
        "name": "BLOODMOON THREAT",
        "accent": "\033[38;2;255;51;68m",
        "sec": "\033[38;2;244;63;94m",
        "peak": "\033[38;2;255;100;100m",
        "amber": "\033[38;2;251;191;36m"
    },
    "arctic": {
        "name": "ARCTIC HORIZON",
        "accent": "\033[38;2;56;189;248m",
        "sec": "\033[38;2;129;140;248m",
        "peak": "\033[38;2;244;63;94m",
        "amber": "\033[38;2;52;211;153m"
    },
    "synthwave": {
        "name": "SYNTHWAVE NEON",
        "accent": "\033[38;2;244;63;94m",
        "sec": "\033[38;2;168;85;247m",
        "peak": "\033[38;2;236;72;153m",
        "amber": "\033[38;2;250;204;21m"
    },
    "matrix": {
        "name": "MATRIX GREEN",
        "accent": "\033[38;2;34;197;94m",
        "sec": "\033[38;2;74;222;128m",
        "peak": "\033[38;2;239;68;68m",
        "amber": "\033[38;2;134;239;172m"
    }
}

CLR_RESET = "\033[0m"
CLR_BOLD = "\033[1m"
CLR_DIM = "\033[2m"
CLR_RED = "\033[38;2;255;51;68m"
CLR_GREEN = "\033[38;2;0;255;136m"
CLR_CYAN = "\033[38;2;56;189;248m"
CLR_AMBER = "\033[38;2;255;180;0m"
CLR_GRAY = "\033[38;2;100;116;139m"
CLR_WHITE = "\033[38;2;248;250;252m"

import re
ANSI_ESCAPE_RE = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')

def strip_ansi(text):
    return ANSI_ESCAPE_RE.sub('', text)

def pad_to_visible_width(text, width):
    vlen = len(strip_ansi(text))
    if vlen < width:
        return text + " " * (width - vlen)
    elif vlen > width:
        # Trim plain text to exact width and preserve ANSI color if present
        clean_trimmed = strip_ansi(text)[:width]
        match = re.match(r'^(\x1B\[[0-9;]*m)+', text)
        prefix = match.group(0) if match else ""
        return prefix + clean_trimmed + CLR_RESET
    return text

# -------------------------------------------------------------
# HIGH-DEFINITION UNICODE BRAILLE VECTOR CANVAS
# -------------------------------------------------------------
class BrailleVectorCanvas:
    """
    Sub-pixel vector drawing canvas utilizing Unicode Braille dot matrix patterns (U+2800..U+28FF).
    Each terminal character contains 2 horizontal by 4 vertical sub-pixels (8 dots total),
    delivering 4x resolution over standard character grids.
    """
    def __init__(self, char_w=36, char_h=16):
        self.cw = char_w
        self.ch = char_h
        self.pw = char_w * 2
        self.ph = char_h * 4
        self.dots = [[0 for _ in range(self.pw)] for _ in range(self.ph)]
        self.colors = [[None for _ in range(char_w)] for _ in range(char_h)]
        self.text_overlays = []

    def place_text(self, cx, cy, text, color=None):
        """Composite plain text glyphs onto the character grid at render time."""
        self.text_overlays.append((cx, cy, text, color))

    def set_pixel(self, x, y, color=None):
        if 0 <= x < self.pw and 0 <= y < self.ph:
            self.dots[y][x] = 1
            if color:
                cx, cy = x // 2, y // 4
                self.colors[cy][cx] = color

    def draw_line(self, x0, y0, x1, y1, color=None):
        dx = abs(x1 - x0)
        dy = -abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx + dy
        while True:
            self.set_pixel(x0, y0, color)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                x0 += sx
            if e2 <= dx:
                err += dx
                y0 += sy

    def draw_circle(self, cx, cy, r, color=None, aspect=0.92):
        steps = int(2 * math.pi * r * 1.5)
        for i in range(steps):
            th = (i / steps) * 2 * math.pi
            x = int(round(cx + r * math.cos(th)))
            y = int(round(cy + r * math.sin(th) * aspect))
            self.set_pixel(x, y, color)

    def draw_arc(self, cx, cy, r, start_deg, end_deg, color=None, aspect=0.92, thickness=2, shaded=True):
        diff = (end_deg - start_deg) % 360
        steps = max(int(diff * 1.5), 16)
        for t in range(thickness):
            curr_r = r + t
            for i in range(steps + 1):
                deg = (start_deg + (i / steps) * diff) - 90
                rad = math.radians(deg)
                x = int(round(cx + curr_r * math.cos(rad)))
                y = int(round(cy + curr_r * math.sin(rad) * aspect))
                self.set_pixel(x, y, color)
        # Optional radial fill pips
        if shaded:
            for r_fill in range(int(r * 0.7), r, 3):
                for i in range(0, steps + 1, 4):
                    deg = (start_deg + (i / steps) * diff) - 90
                    rad = math.radians(deg)
                    x = int(round(cx + r_fill * math.cos(rad)))
                    y = int(round(cy + r_fill * math.sin(rad) * aspect))
                    self.set_pixel(x, y, color)

    def render_rows(self):
        dot_map = [
            (0, 0, 0x01), (0, 1, 0x02), (0, 2, 0x04),
            (1, 0, 0x08), (1, 1, 0x10), (1, 2, 0x20),
            (0, 3, 0x40), (1, 3, 0x80)
        ]
        glyphs = [[" " for _ in range(self.cw)] for _ in range(self.ch)]
        cols = [[None for _ in range(self.cw)] for _ in range(self.ch)]
        for cy in range(self.ch):
            for cx in range(self.cw):
                val = 0
                for dx, dy, bit in dot_map:
                    px = cx * 2 + dx
                    py = cy * 4 + dy
                    if self.dots[py][px]:
                        val |= bit
                if val > 0:
                    glyphs[cy][cx] = chr(0x2800 + val)
                    cols[cy][cx] = self.colors[cy][cx]
        for tx, ty, text, color in self.text_overlays:
            for i, g in enumerate(text):
                x = tx + i
                if 0 <= x < self.cw and 0 <= ty < self.ch:
                    glyphs[ty][x] = g
                    cols[ty][x] = color
        rows = []
        for cy in range(self.ch):
            row = []
            for cx in range(self.cw):
                ch = glyphs[cy][cx]
                col = cols[cy][cx]
                if col:
                    row.append(f"{col}{ch}{CLR_RESET}")
                else:
                    row.append(f"{CLR_GRAY}{ch}{CLR_RESET}" if ch != " " else " ")
            rows.append("".join(row))
        return rows

# -------------------------------------------------------------
# TIME & STATUS CALCULATION ENGINE
# -------------------------------------------------------------
def get_beijing_time(dt_utc=None):
    if dt_utc is None:
        dt_utc = datetime.now(timezone.utc)
    cst_tz = timezone(timedelta(hours=8))
    return dt_utc.astimezone(cst_tz)

def calculate_status(provider_key="glm", dt_utc=None):
    if dt_utc is None:
        dt_utc = datetime.now(timezone.utc)
    cst = get_beijing_time(dt_utc)
    p = PROVIDERS.get(provider_key, PROVIDERS["glm"])
    
    # Python weekday: Mon=0, Tue=1, ..., Sat=5, Sun=6
    weekday = cst.weekday()
    is_weekend = (weekday >= 5)
    total_sec = cst.hour * 3600 + cst.minute * 60 + cst.second
    
    first_peak_start = p["windows"][0]["start_h"] * 3600 + p["windows"][0]["start_m"] * 60

    if is_weekend:
        days_until_mon = (7 - weekday)  # Sat(5)->2, Sun(6)->1
        sec_until_peak = (days_until_mon * 86400) + (first_peak_start - total_sec)
        return {
            "provider": p["id"],
            "provider_name": p["name"],
            "state": "weekend",
            "is_peak": False,
            "multiplier": 1.0,
            "headline": "WEEKEND OFF-PEAK ACTIVE",
            "description": p["desc_weekend"],
            "sec_until_next_phase": max(0, sec_until_peak),
            "next_phase_name": "Monday Peak Window",
            "cst_time": cst,
            "utc_time": dt_utc
        }

    # Check if inside any peak window
    for w in p["windows"]:
        w_start = w["start_h"] * 3600 + w["start_m"] * 60
        w_end = w["end_h"] * 3600 + w["end_m"] * 60
        if w_start <= total_sec < w_end:
            return {
                "provider": p["id"],
                "provider_name": p["name"],
                "state": "peak",
                "is_peak": True,
                "multiplier": p["peak_multiplier"],
                "headline": "SURGE COEFFICIENT ACTIVE",
                "description": p["desc_peak"],
                "sec_until_next_phase": max(0, w_end - total_sec),
                "next_phase_name": "Off-Peak Discount",
                "cst_time": cst,
                "utc_time": dt_utc
            }

    # Check next upcoming peak window today
    for w in p["windows"]:
        w_start = w["start_h"] * 3600 + w["start_m"] * 60
        if total_sec < w_start:
            return {
                "provider": p["id"],
                "provider_name": p["name"],
                "state": "offpeak",
                "is_peak": False,
                "multiplier": p["offpeak_multiplier"],
                "headline": "OPTIMAL BATCH WINDOW",
                "description": p["desc_offpeak"],
                "sec_until_next_phase": max(0, w_start - total_sec),
                "next_phase_name": "Peak Hours Surge",
                "cst_time": cst,
                "utc_time": dt_utc
            }

    # If past all windows today
    if weekday == 4:  # Friday -> Monday
        sec_until_next = (86400 - total_sec) + (2 * 86400) + first_peak_start
    else:
        sec_until_next = (86400 - total_sec) + first_peak_start

    return {
        "provider": p["id"],
        "provider_name": p["name"],
        "state": "offpeak",
        "is_peak": False,
        "multiplier": p["offpeak_multiplier"],
        "headline": "OPTIMAL BATCH WINDOW",
        "description": p["desc_offpeak"],
        "sec_until_next_phase": max(0, sec_until_next),
        "next_phase_name": "Next Peak Window",
        "cst_time": cst,
        "utc_time": dt_utc
    }

def format_countdown(sec):
    days = int(sec // 86400)
    rem1 = sec % 86400
    hours = int(rem1 // 3600)
    rem2 = rem1 % 3600
    mins = int(rem2 // 60)
    secs = int(rem2 % 60)
    if days > 0:
        return f"{days}d {hours:02d}h {mins:02d}m {secs:02d}s"
    return f"{hours:02d}h {mins:02d}m {secs:02d}s"

# -------------------------------------------------------------
# 24-HOUR HORIZON PROGRESS BAR
# -------------------------------------------------------------
def render_24h_horizon_bar(provider_key, cst_time, theme):
    p = PROVIDERS.get(provider_key, PROVIDERS["glm"])
    total_slots = 24  # 1 slot per hour
    cur_slot = cst_time.hour
    
    slots = []
    for s in range(total_slots):
        is_peak = False
        if cst_time.weekday() < 5:
            for w in p["windows"]:
                if w["start_h"] <= s < w["end_h"]:
                    is_peak = True
                    break
        
        if s == cur_slot:
            slots.append(f"{CLR_WHITE}{CLR_BOLD}▲{CLR_RESET}")
        elif is_peak:
            slots.append(f"{theme['peak']}█{CLR_RESET}")
        else:
            slots.append(f"{theme['accent']}░{CLR_RESET}")
            
    bar_str = "".join(slots)
    return f"00 [{bar_str}] 24"

# -------------------------------------------------------------
# RADAR RETICLE RENDERER (ADVANCED VECTOR BRAILLE ENGINE)
# -------------------------------------------------------------
def render_advanced_radar(provider_key="glm", dial_mode="12", theme_name="void", sweep_angle=None, time_offset_sec=0):
    now_utc = datetime.now(timezone.utc) + timedelta(seconds=time_offset_sec)
    cst = get_beijing_time(now_utc)
    local_now = datetime.now() + timedelta(seconds=time_offset_sec)
    status = calculate_status(provider_key, now_utc)
    p = PROVIDERS.get(provider_key, PROVIDERS["glm"])
    theme = THEMES.get(theme_name, THEMES["void"])

    is_24 = (dial_mode == "24")
    
    # State styling
    if status["state"] == "peak":
        theme_color = theme["peak"]
        state_badge = f"{theme['peak']}{CLR_BOLD}[STATE: PEAK_SURGE // {p['peak_multiplier']:.1f}X COEFFICIENT]{CLR_RESET}"
        mult_badge = f"{theme['peak']}{CLR_BOLD}{p['peak_multiplier']:.1f}× SURGE RATE{CLR_RESET}"
    elif status["state"] == "weekend":
        theme_color = theme["sec"]
        state_badge = f"{theme['sec']}{CLR_BOLD}[STATE: WEEKEND // 100% OFF-PEAK]{CLR_RESET}"
        mult_badge = f"{theme['sec']}{CLR_BOLD}1.0× ALL-DAY (50% DISC.){CLR_RESET}"
    else:
        theme_color = theme["accent"]
        state_badge = f"{theme['accent']}{CLR_BOLD}[STATE: OFF_PEAK // DISPATCH]{CLR_RESET}"
        mult_badge = f"{theme['accent']}{CLR_BOLD}1.0× STANDARD (50% DISC.){CLR_RESET}"

    # Build Braille Canvas: 36 cols x 16 rows -> 72 x 64 sub-pixels
    CW, CH = 36, 16
    canvas = BrailleVectorCanvas(CW, CH)
    cx, cy = 36, 32
    radius = 30
    ASPECT = 0.92
    hold_mode = sweep_angle is None
    hour_mod = 24 if is_24 else 12

    def polar(deg, length):
        rad = math.radians(deg - 90.0)
        c_, s_ = math.cos(rad), math.sin(rad)
        return int(round(cx + length * c_)), int(round(cy + length * s_ * ASPECT)), c_, s_

    # Dial bezel
    canvas.draw_circle(cx, cy, radius, theme["sec"], aspect=ASPECT)

    # Graduated tick marks (minor + major)
    if is_24:
        divisions, major_every = 48, 4   # 30-min ticks, major every 2h
    else:
        divisions, major_every = 60, 5   # minute ticks, major every hour
    for i in range(divisions):
        tick_deg = (i / divisions) * 360.0
        _, _, tc, ts = polar(tick_deg, 1.0)
        if i % major_every == 0:
            r0, r1, tcol = radius - 5, radius - 1, CLR_WHITE
        else:
            r0, r1, tcol = radius - 3, radius - 1, CLR_GRAY
        canvas.draw_line(
            int(round(cx + r0 * tc)), int(round(cy + r0 * ts * ASPECT)),
            int(round(cx + r1 * tc)), int(round(cy + r1 * ts * ASPECT)),
            tcol
        )

    # Cardinal numerals
    label_r = radius - 11
    if is_24:
        labels = [(0, "00"), (6, "06"), (12, "12"), (18, "18")]
    else:
        labels = [(12, "12"), (3, "3"), (6, "6"), (9, "9")]
    for h, txt in labels:
        lx, ly, _, _ = polar((h / hour_mod) * 360.0, label_r)
        tx = int(round(lx / 2.0 - len(txt) / 2.0))
        ty = int(round(ly / 4.0))
        canvas.place_text(tx, ty, txt, theme["amber"])

    # Peak surge window arcs on the outer bezel
    if status["state"] != "weekend":
        for w in p["windows"]:
            if is_24:
                start_deg = (w["start_h"] + w["start_m"] / 60.0) * 15.0
                end_deg = (w["end_h"] + w["end_m"] / 60.0) * 15.0
            else:
                start_deg = ((w["start_h"] % 12) + w["start_m"] / 60.0) * 30.0
                end_deg = ((w["end_h"] % 12) + w["end_m"] / 60.0) * 30.0
            canvas.draw_arc(cx, cy, radius + 1, start_deg, end_deg, theme["peak"],
                            aspect=ASPECT, thickness=2, shaded=False)

    # Clock hands (smooth sweep; frozen to whole seconds while in HOLD)
    sec_f = cst.second + (0.0 if hold_mode else cst.microsecond / 1_000_000.0)
    min_f = cst.minute + sec_f / 60.0
    hour_f = (cst.hour % hour_mod) + min_f / 60.0

    # Hour hand — short & broad
    hx, hy, hc, hs = polar((hour_f / hour_mod) * 360.0, 15)
    canvas.draw_line(cx, cy, hx, hy, theme_color)
    pox, poy = int(round(-hs)), int(round(hc * ASPECT))  # perpendicular offset
    if pox == 0 and poy == 0:
        pox = 1
    bx, by, _, _ = polar((hour_f / hour_mod) * 360.0, 9)
    canvas.draw_line(cx + pox, cy + poy, bx + pox, by + poy, theme_color)

    # Minute hand — slim, with short tail
    mx, my, mc, ms_ = polar((min_f / 60.0) * 360.0, 24)
    mtx = int(round(cx - 4 * mc))
    mty = int(round(cy - 4 * ms_ * ASPECT))
    canvas.draw_line(mtx, mty, mx, my, theme_color)

    # Second hand — fine needle with counterweight tail
    sx, sy, sc, ss = polar((sec_f / 60.0) * 360.0, 26)
    stx = int(round(cx - 8 * sc))
    sty = int(round(cy - 8 * ss * ASPECT))
    canvas.draw_line(stx, sty, sx, sy, theme["amber"])

    # Center hub pivot
    for hub_dx in (0, 1):
        for hub_dy in (0, 1):
            canvas.set_pixel(cx + hub_dx, cy + hub_dy, CLR_WHITE)

    radar_rows = canvas.render_rows()

    # Telemetry Panel lines
    BOX_WIDTH = 100
    lines = []
    
    scrub_tag = ""
    if time_offset_sec != 0:
        off_m, off_s = divmod(abs(time_offset_sec), 60)
        off_sign = "+" if time_offset_sec > 0 else "-"
        scrub_tag = f" {CLR_AMBER}[TIME TRAVEL {off_sign}{off_m}m{off_s:02d}s]{CLR_RESET}"
    hold_tag = f" {CLR_WHITE}[HOLD]{CLR_RESET}" if hold_mode else ""
    top_title = f"┌─ LLM_CLOCK // TACTICAL TELEMETRY RADAR v2.5{scrub_tag}{hold_tag} "
    lines.append(f"{CLR_BOLD}{top_title}{'─' * (BOX_WIDTH - 2 - len(strip_ansi(top_title)) + 1)}┐{CLR_RESET}")

    p_vendor = f"({p['vendor']})" if len(p['name']) + len(p['vendor']) < 38 else ""
    side_info = [
        f"{CLR_BOLD}PROVIDER:{CLR_RESET}   {p['name']} {CLR_DIM}{p_vendor}{CLR_RESET}".strip(),
        f"{CLR_BOLD}STATUS:{CLR_RESET}     {state_badge}",
        f"{CLR_BOLD}RATE COEFFICIENT:{CLR_RESET} {mult_badge}",
        f"{CLR_BOLD}COUNTDOWN:{CLR_RESET}  {theme_color}{CLR_BOLD}{format_countdown(status['sec_until_next_phase'])}{CLR_RESET} {CLR_DIM}({status['next_phase_name']}){CLR_RESET}",
        f"{CLR_BOLD}BEIJING (UTC+8):{CLR_RESET} {theme['amber']}{cst.strftime('%Y-%m-%d %H:%M:%S')} CST{CLR_RESET}",
        f"{CLR_BOLD}WORKSTATION:{CLR_RESET}    {CLR_WHITE}{local_now.strftime('%Y-%m-%d %H:%M:%S')} Local{CLR_RESET}",
        f"{CLR_BOLD}SURGE WINDOWS:{CLR_RESET}  {theme['peak']}{p['badge_window']}{CLR_RESET}",
        f"{CLR_BOLD}DIAL / THEME:{CLR_RESET}   {theme['sec']}{dial_mode}H Reticle{CLR_RESET} │ {theme['accent']}{theme['name']}{CLR_RESET}",
        f"{CLR_DIM}────────────────────────────────────────────{CLR_RESET}",
        f"{CLR_BOLD}24H TIMELINE:{CLR_RESET}   {render_24h_horizon_bar(provider_key, cst, theme)}",
        f"{status['description'][:56]}",
        f"{CLR_DIM}[P]rov [M]ode [T]heme [SPC]Hold [←→↑↓]Scrub [K]alc [Q]{CLR_RESET}"
    ]

    INFO_WIDTH = 55
    for y in range(CH):
        r_line = radar_rows[y] if y < len(radar_rows) else " " * CW
        info_raw = side_info[y] if y < len(side_info) else ""
        info_padded = pad_to_visible_width(info_raw, INFO_WIDTH)
        lines.append(f"│  {r_line}  │  {info_padded}│")

    # Global City Matrix Section
    mid_title = "├─ GLOBAL METROPOLIS SURGE MATRIX (LIVE TIMEZONE CONVERSION) "
    lines.append(f"{CLR_BOLD}{mid_title}{'─' * (BOX_WIDTH - 2 - len(strip_ansi(mid_title)) + 1)}┤{CLR_RESET}")

    city_cells = []
    for city in GLOBAL_CITIES:
        city_tz = timezone(timedelta(hours=city["tz_offset"]))
        city_time = now_utc.astimezone(city_tz)
        
        c_status = status["state"].upper()
        if c_status == "PEAK":
            c_badge = f"{theme['peak']}PEAK ({p['peak_multiplier']:.1f}X){CLR_RESET}"
        elif c_status == "WEEKEND":
            c_badge = f"{theme['sec']}WEEKEND{CLR_RESET}"
        else:
            c_badge = f"{theme['accent']}OFF-PEAK{CLR_RESET}"
            
        cell_raw = f"[{city['flag']}] {city['name'][:18]:<18} {city_time.strftime('%H:%M')} {c_badge}"
        city_cells.append(cell_raw)

    # 2 columns: 3 + 45 + 4 + 47 + 1 = 100 characters
    for i in range(0, len(city_cells), 2):
        c1_raw = city_cells[i] if i < len(city_cells) else ""
        c2_raw = city_cells[i+1] if i+1 < len(city_cells) else ""
        c1_pad = pad_to_visible_width(c1_raw, 45)
        c2_pad = pad_to_visible_width(c2_raw, 47)
        lines.append(f"│  {c1_pad} │  {c2_pad}│")

    lines.append(f"{CLR_BOLD}└{'─' * (BOX_WIDTH - 2)}┘{CLR_RESET}")
    return "\n".join(lines)

# -------------------------------------------------------------
# PLUGINS & ONE-SHOT FORMATTERS
# -------------------------------------------------------------
def format_status_line(provider_key="glm", fmt="short"):
    now_utc = datetime.now(timezone.utc)
    status = calculate_status(provider_key, now_utc)
    p = PROVIDERS.get(provider_key, PROVIDERS["glm"])
    cd = format_countdown(status["sec_until_next_phase"])
    
    if fmt == "json":
        data = {
            "provider": p["id"],
            "provider_name": p["name"],
            "vendor": p["vendor"],
            "state": status["state"],
            "is_peak": status["is_peak"],
            "multiplier": status["multiplier"],
            "seconds_remaining": status["sec_until_next_phase"],
            "countdown_formatted": cd,
            "next_phase": status["next_phase_name"],
            "cst_time": status["cst_time"].isoformat(),
            "local_time": datetime.now().isoformat()
        }
        return json.dumps(data, indent=2)
        
    elif fmt == "tmux":
        if status["state"] == "peak":
            return f"#[fg=red,bold]⚡ {p['short_name']} {status['multiplier']:.1f}x (Peak: {cd})#[default]"
        elif status["state"] == "weekend":
            return f"#[fg=cyan,bold]🟢 {p['short_name']} 1x (Wknd: {cd})#[default]"
        else:
            return f"#[fg=green,bold]🟢 {p['short_name']} 1x (Off-Peak: {cd})#[default]"

    elif fmt == "starship":
        if status["state"] == "peak":
            return f"⚡[{p['short_name']} {status['multiplier']:.1f}x ⏳{cd}](bold red)"
        elif status["state"] == "weekend":
            return f"🟢[{p['short_name']} 1x 🌴{cd}](bold cyan)"
        else:
            return f"🟢[{p['short_name']} 1x ⏳{cd}](bold green)"

    elif fmt == "prompt" or fmt == "short":
        if status["state"] == "peak":
            return f"{CLR_RED}{CLR_BOLD}⚡ {p['short_name']} {status['multiplier']:.1f}x Surge ({cd}){CLR_RESET}"
        elif status["state"] == "weekend":
            return f"{CLR_CYAN}{CLR_BOLD}🟢 {p['short_name']} 1x Weekend ({cd}){CLR_RESET}"
        else:
            return f"{CLR_GREEN}{CLR_BOLD}🟢 {p['short_name']} 1x Off-Peak ({cd}){CLR_RESET}"

    elif fmt == "waybar" or fmt == "i3blocks" or fmt == "polybar":
        text = f"⚡ {p['short_name']} {status['multiplier']:.1f}x" if status["is_peak"] else f"🟢 {p['short_name']} 1x"
        tooltip = f"{p['name']} ({status['state'].upper()})\nNext phase in: {cd} ({status['next_phase_name']})"
        css_class = "peak" if status["is_peak"] else ("weekend" if status["state"] == "weekend" else "offpeak")
        return json.dumps({"text": text, "tooltip": tooltip, "class": css_class, "percentage": 100 if status["is_peak"] else 0})

    elif fmt == "tsv":
        return f"{p['id']}\t{status['state']}\t{status['multiplier']}\t{status['sec_until_next_phase']}\t{cd}"

    elif fmt == "markdown":
        return f"| **{p['name']}** | `{status['state'].upper()}` | **{status['multiplier']:.1f}x** | {cd} |"

    return format_status_line(provider_key, "short")

# -------------------------------------------------------------
# WORKLOAD GATEKEEPER: WAIT UNTIL OFF-PEAK
# -------------------------------------------------------------
def wait_until_offpeak(provider_key="glm"):
    """
    Blocks execution until the next off-peak discount window opens.
    Outputs an interactive countdown spinner, then exits with return code 0.
    """
    p = PROVIDERS.get(provider_key, PROVIDERS["glm"])
    spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    idx = 0
    
    print(f"\n{CLR_BOLD}⚡ [GATEKEEPER] Monitoring {p['name']} Peak Hours Surge...{CLR_RESET}")
    
    while True:
        now_utc = datetime.now(timezone.utc)
        status = calculate_status(provider_key, now_utc)
        
        if not status["is_peak"]:
            print(f"\r\033[K{CLR_GREEN}{CLR_BOLD}🟢 [GATE OPEN] {p['name']} Off-Peak Discount Active! Proceeding...{CLR_RESET}\n")
            # Terminal chime
            sys.stdout.write("\a")
            sys.stdout.flush()
            sys.exit(0)
            
        cd = format_countdown(status["sec_until_next_phase"])
        spin_char = spinner[idx % len(spinner)]
        sys.stdout.write(f"\r\033[K{CLR_RED}{CLR_BOLD}{spin_char} PEAK SURGE ACTIVE ({status['multiplier']:.1f}x){CLR_RESET} ⏳ Off-peak resumes in: {CLR_WHITE}{cd}{CLR_RESET}")
        sys.stdout.flush()
        idx += 1
        time.sleep(0.5)

# -------------------------------------------------------------
# MULTI-PROVIDER COMPARISON STATUS
# -------------------------------------------------------------
def print_all_providers_status():
    now_utc = datetime.now(timezone.utc)
    cst = get_beijing_time(now_utc)
    print(f"\n{CLR_BOLD}┌─ LLM_CLOCK // MULTI-PROVIDER PRICING MATRIX ────────────────────────┐{CLR_RESET}")
    print(f"│  {CLR_DIM}BEIJING CST: {cst.strftime('%Y-%m-%d %H:%M:%S')} (UTC+8){CLR_RESET}                             │")
    print(f"{CLR_BOLD}├────────────────────────┬─────────────┬────────────┬─────────────────┤{CLR_RESET}")
    print(f"│  {CLR_BOLD}MODEL / PROVIDER{CLR_RESET}      │  {CLR_BOLD}STATE{CLR_RESET}      │  {CLR_BOLD}RATE{CLR_RESET}      │  {CLR_BOLD}NEXT PHASE{CLR_RESET}     │")
    print(f"{CLR_BOLD}├────────────────────────┼─────────────┼────────────┼─────────────────┤{CLR_RESET}")
    
    for key in PRIMARY_PROVIDERS:
        p = PROVIDERS[key]
        status = calculate_status(key, now_utc)
        cd = format_countdown(status["sec_until_next_phase"])
        if status["state"] == "peak":
            st_str = f"{CLR_RED}PEAK SURGE {CLR_RESET}"
            rate_str = f"{CLR_RED}{status['multiplier']:.1f}×{CLR_RESET}      "
        elif status["state"] == "weekend":
            st_str = f"{CLR_CYAN}WEEKEND   {CLR_RESET}"
            rate_str = f"{CLR_CYAN}1.0× (50%){CLR_RESET}"
        else:
            st_str = f"{CLR_GREEN}OFF-PEAK  {CLR_RESET}"
            rate_str = f"{CLR_GREEN}1.0× (50%){CLR_RESET}"
            
        p_name = p['short_name'][:20].ljust(20)
        print(f"│  {p_name}  │  {st_str} │  {rate_str}  │  {cd:<14} │")
        
    print(f"{CLR_BOLD}└────────────────────────┴─────────────┴────────────┴─────────────────┘{CLR_RESET}\n")

# -------------------------------------------------------------
# CALCULATOR UTILITY
# -------------------------------------------------------------
def calculate_tokens(tokens=1000000, provider_key="glm"):
    p = PROVIDERS.get(provider_key, PROVIDERS["glm"])
    off_pts = tokens * p["offpeak_multiplier"]
    peak_pts = tokens * p["peak_multiplier"]
    saved_pts = peak_pts - off_pts
    pct = (saved_pts / peak_pts) * 100 if peak_pts > 0 else 0

    print(f"\n{CLR_BOLD}=== {p['name'].upper()} TOKEN / QUOTA OPTIMIZER ==={CLR_RESET}")
    print(f"Batch Volume:         {tokens:,.0f} tokens / quota units")
    print(f"Off-Peak Consumption: {CLR_GREEN}{CLR_BOLD}{off_pts:,.0f} units (1.0x standard discount){CLR_RESET}")
    print(f"Peak Surge Cost:      {CLR_RED}{CLR_BOLD}{peak_pts:,.0f} units ({p['peak_multiplier']:.1f}x surge rate){CLR_RESET}")
    print(f"Off-Peak Advantage:   {CLR_CYAN}{CLR_BOLD}+{saved_pts:,.0f} units saved ({pct:.1f}% capacity gain){CLR_RESET}\n")

# -------------------------------------------------------------
# INTERACTIVE WATCH / TUI MODE
# -------------------------------------------------------------
def run_interactive_tui(provider_key="glm", dial_mode="12", theme_name="void"):
    import select
    
    # Hide cursor & clear screen
    sys.stdout.write("\033[?25l\033[2J")
    sys.stdout.flush()

    provider_keys = PRIMARY_PROVIDERS
    theme_keys = list(THEMES.keys())
    
    p_idx = provider_keys.index(provider_key) if provider_key in provider_keys else 0
    t_idx = theme_keys.index(theme_name) if theme_name in theme_keys else 0
    current_dial = dial_mode
    time_offset_sec = 0
    sweep_angle = 0
    paused = False

    # Non-blocking key read
    if sys.platform == "win32":
        import msvcrt
        def get_key():
            if msvcrt.kbhit():
                ch = msvcrt.getch()
                if ch in (b'\x00', b'\xe0'):  # Arrow key prefix
                    ch2 = msvcrt.getch()
                    if ch2 == b'K': return 'left'
                    if ch2 == b'M': return 'right'
                    if ch2 == b'H': return 'up'
                    if ch2 == b'P': return 'down'
                try:
                    return ch.decode("utf-8").lower()
                except Exception:
                    return ""
            return None
    else:
        import termios
        import tty
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        tty.setcbreak(fd)
        def get_key():
            dr, _, _ = select.select([sys.stdin], [], [], 0)
            if dr:
                ch = sys.stdin.read(1)
                if ch == '\x1b':
                    dr2, _, _ = select.select([sys.stdin], [], [], 0.05)
                    if dr2:
                        ch2 = sys.stdin.read(2)
                        if ch2 == '[D': return 'left'
                        if ch2 == '[C': return 'right'
                        if ch2 == '[A': return 'up'
                        if ch2 == '[B': return 'down'
                    return 'q'
                return ch.lower()
            return None

    try:
        while True:
            key = get_key()
            if key == "q":
                break
            elif key == "p":
                p_idx = (p_idx + 1) % len(provider_keys)
            elif key == "t":
                t_idx = (t_idx + 1) % len(theme_keys)
            elif key == "m":
                current_dial = "24" if current_dial == "12" else "12"
            elif key in ("right", "l"):
                time_offset_sec += 1 if paused else 900    # Fine +1s in HOLD, else +15m
            elif key in ("left", "h"):
                time_offset_sec -= 1 if paused else 900    # Fine -1s in HOLD, else -15m
            elif key == "up":
                time_offset_sec += 60 if paused else 3600  # Fine +1m in HOLD, else +1h
            elif key == "down":
                time_offset_sec -= 60 if paused else 3600  # Fine -1m in HOLD, else -1h
            elif key == "r":
                time_offset_sec = 0      # Reset scrubber
            elif key == " ":
                paused = not paused      # Pause / Resume sweep
            elif key == "k":
                # Quick calculator modal
                sys.stdout.write("\033[?25h\033[2J\033[H")
                print(f"\n{CLR_BOLD}=== LLM RADAR TOKEN CALCULATOR ==={CLR_RESET}")
                try:
                    tok_input = input("Enter token volume (e.g. 500000 or 1000000): ").strip()
                    tok_val = float(tok_input.replace(",", ""))
                    calculate_tokens(tok_val, provider_keys[p_idx])
                except Exception:
                    print("Invalid input.")
                input("Press [Enter] to resume Radar Reticle...")
                sys.stdout.write("\033[?25l\033[2J")
                sys.stdout.flush()

            # Advance sweep beam if not paused
            if not paused:
                sweep_angle = (sweep_angle + 10) % 360

            # Render frame
            output = render_advanced_radar(
                provider_key=provider_keys[p_idx],
                dial_mode=current_dial,
                theme_name=theme_keys[t_idx],
                sweep_angle=sweep_angle if not paused else None,
                time_offset_sec=time_offset_sec
            )
            sys.stdout.write("\033[H" + output + "\n")
            sys.stdout.flush()
            time.sleep(0.06)
    except KeyboardInterrupt:
        pass
    finally:
        if sys.platform != "win32":
            try:
                termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
            except Exception:
                pass
        sys.stdout.write("\033[?25h\n")
        sys.stdout.flush()

# -------------------------------------------------------------
# MAIN CLI ENTRYPOINT
# -------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        prog="llm-clock",
        description="GLM, DeepSeek & Qwen/Qoder Live Peak Hours Surge Tracker & Off-Peak Discount Telemetry CLI v2.5."
    )
    parser.add_argument(
        "-p", "--provider",
        choices=["glm", "deepseek", "qwen", "qoder", "minimax", "kimi", "all"],
        default="glm",
        help="AI Provider to track (default: glm, or 'all' for comparative matrix)"
    )
    parser.add_argument(
        "-m", "--mode",
        choices=["12", "24"],
        default="12",
        help="Dial mode (12-hour or 24-hour reticle)"
    )
    parser.add_argument(
        "-t", "--theme",
        choices=["void", "amber", "bloodmoon", "arctic", "synthwave", "matrix"],
        default="void",
        help="Color theme for radar display"
    )
    parser.add_argument(
        "-f", "--format",
        choices=["short", "tmux", "starship", "prompt", "json", "waybar", "i3blocks", "polybar", "tsv", "markdown"],
        help="One-shot format for statuslines/prompts (e.g. tmux, starship, zsh, waybar, json)"
    )
    parser.add_argument(
        "-c", "--calc",
        type=float,
        metavar="TOKENS",
        help="Calculate token cost & savings for a given batch size"
    )
    parser.add_argument(
        "--wait-offpeak",
        action="store_true",
        help="Block execution with countdown spinner until next off-peak discount window opens"
    )
    parser.add_argument(
        "--watch",
        action="store_true",
        help="Run live interactive radar watch mode in terminal (default if no flags)"
    )

    args = parser.parse_args()

    if args.wait_offpeak:
        wait_until_offpeak(args.provider if args.provider != "all" else "glm")
    elif args.provider == "all" and not args.format:
        print_all_providers_status()
    elif args.calc is not None:
        calculate_tokens(args.calc, args.provider if args.provider != "all" else "glm")
    elif args.format:
        print(format_status_line(args.provider if args.provider != "all" else "glm", args.format))
    else:
        if sys.stdout.isatty():
            run_interactive_tui(args.provider if args.provider != "all" else "glm", args.mode, args.theme)
        else:
            print(format_status_line(args.provider if args.provider != "all" else "glm", "short"))

if __name__ == "__main__":
    main()
