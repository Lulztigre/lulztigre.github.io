#!/usr/bin/env python3
"""
sync_posts.py — Automatic blog synchronization for lulztigre.pw

Reads all articles in posts/*.html (and optional posts/extra_posts.json), extracts metadata, and updates:
  - index.html (post cards, total post counts, last sync date)
  - archive.html (chronological archive log, telemetry count)
  - feed.xml (RSS 2.0 items and build date)

Usage:
  python sync_posts.py
"""

import os
import re
import json
import html
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
POSTS_DIR = ROOT_DIR / "posts"
INDEX_FILE = ROOT_DIR / "index.html"
ARCHIVE_FILE = ROOT_DIR / "archive.html"
FEED_FILE = ROOT_DIR / "feed.xml"
EXTRA_POSTS_FILE = POSTS_DIR / "extra_posts.json"

DATE_MAP = {
    "dokploy-cve-2026-72867-working-poc.html": "2026-10-19",
    "balbooa-forms-penny-rce-67363-67364.html": "2026-08-30",
    "gravitino-test-connection-rce-41042.html": "2026-08-17",
    "dropoutjeep-the-phishing-simulator-that-refuses-to-drop-out.html": "2026-08-15",
    "icagenda-stored-xss-75948.html": "2026-09-12",
    "grandscream-phone-to-pbx-root.html": "2026-08-15",
    "icagenda-csv-formula-injection-102799.html": "2026-11-04",
    "icagenda-stored-xss-102790.html": "2026-11-04",
}

TARGET_MAP = {
    "dokploy-cve-2026-72867-working-poc.html": "Dokploy 0.29.12",
    "balbooa-forms-penny-rce-67363-67364.html": "Balbooa Forms 2.4.3.1",
    "gravitino-test-connection-rce-41042.html": "Apache Gravitino 0.5.0–0.7.0",
    "dropoutjeep-the-phishing-simulator-that-refuses-to-drop-out.html": "FRAMEWORK: <strong>DropoutJeep v2.1</strong>",
    "icagenda-stored-xss-75948.html": "iCagenda 4.0.8–4.0.12",
    "grandscream-phone-to-pbx-root.html": "Grandstream GXP16xx / PBX",
    "icagenda-csv-formula-injection-102799.html": "iCagenda 3.5.0–4.0.16",
    "icagenda-stored-xss-102790.html": "iCagenda 3.2.1–4.0.16",
}

CVSS_MAP = {
    "dokploy-cve-2026-72867-working-poc.html": ("CVSS 9.9 CRITICAL", "crit"),
    "balbooa-forms-penny-rce-67363-67364.html": ("CVSS 9.8 CRITICAL", "crit"),
    "gravitino-test-connection-rce-41042.html": ("CVSS 9.8 CRITICAL", "crit"),
    "dropoutjeep-the-phishing-simulator-that-refuses-to-drop-out.html": ("RED TEAM SIM", "sec"),
    "icagenda-stored-xss-75948.html": ("CVSS 7.2 HIGH", "high"),
    "grandscream-phone-to-pbx-root.html": ("CVSS 9.8 ROOT CHAIN", "crit"),
    "icagenda-csv-formula-injection-102799.html": ("CVSS 7.8 HIGH", "high"),
    "icagenda-stored-xss-102790.html": ("CVSS 7.5 HIGH", "high"),
}

TAGS_OVERRIDE = {
    "dokploy-cve-2026-72867-working-poc.html": ["CVE-2026-72867", "VERIFIED POC", "DOKPLOY", "N-DAY"],
    "balbooa-forms-penny-rce-67363-67364.html": ["CVE-2026-67363", "CVE-2026-67364", "VERIFIED POC", "JOOMLA"],
    "gravitino-test-connection-rce-41042.html": ["CVE-2026-41042", "DETERMINISTIC POC", "JDBC DRIVER RCE"],
    "dropoutjeep-the-phishing-simulator-that-refuses-to-drop-out.html": ["80+ MODULES", "RED TEAM", "PHISHING SIM"],
    "icagenda-stored-xss-75948.html": ["CVE-2026-75948", "COORDINATED FIX", "STORED XSS"],
    "grandscream-phone-to-pbx-root.html": ["ROOT CHAIN", "PROVEN WEAPONIZATION", "VOIP ROOT"],
    "icagenda-csv-formula-injection-102799.html": ["CVE-2026-102799", "PLACEHOLDER", "ICAGENDA", "CSV INJECTION"],
    "icagenda-stored-xss-102790.html": ["CVE-2026-102790", "PLACEHOLDER", "ICAGENDA", "STORED XSS"],
}

def clean_text(text: str) -> str:
    """Escapes special HTML characters except normal apostrophes and quotes for readability."""
    if not text:
        return ""
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return text

def parse_post(filepath: Path):
    content = filepath.read_text(encoding="utf-8")
    
    filename = filepath.name
    url = f"https://lulztigre.pw/posts/{filename}"
    rel_link = f"posts/{filename}"
    
    # Memo #
    memo_match = re.search(r"MEMO\s*#?(\d+)", content, re.IGNORECASE)
    memo_num = memo_match.group(1).zfill(3) if memo_match else "000"
    memo_label = f"MEMO #{memo_num}"
    
    # Title
    title_match = re.search(r'<h1 class="article-title"[^>]*>(.*?)</h1>', content, re.DOTALL)
    if not title_match:
        title_match = re.search(r'<meta property="og:title" content="(.*?)">', content)
    if not title_match:
        title_match = re.search(r'<title>(.*?)(?:\s*//.*)?</title>', content)
    title = html.unescape(title_match.group(1).strip()) if title_match else filename.replace(".html", "")
    
    # Author
    author_match = re.search(r'<span class="meta-label">AUTHOR:</span>\s*<strong>(.*?)</strong>', content)
    author = author_match.group(1).strip() if author_match else "Lulztigre"
    
    # Date
    date_str = DATE_MAP.get(filename, "")
    if not date_str:
        date_match = re.search(r'<span class="meta-label">DATE:</span>\s*<strong>(.*?)</strong>', content)
        date_str = date_match.group(1).strip() if date_match else "2026-01-01"
    
    # Read Time
    time_match = re.search(r'<span class="meta-label">READ TIME:</span>\s*<strong>(.*?)</strong>', content)
    read_time = time_match.group(1).strip() if time_match else "~10 MIN"
    
    # Category
    cat_match = re.search(r'<span class="meta-label">CATEGORY:</span>\s*<strong>(.*?)</strong>', content)
    category = cat_match.group(1).strip() if cat_match else "OFFENSIVE SECURITY"
    
    # Tags
    tags_match = re.search(r'<span class="meta-label">TAGS:</span>\s*<strong>(.*?)</strong>', content)
    tags = []
    if tags_match:
        raw_tags = tags_match.group(1)
        tags = [t.strip().lstrip("#").upper() for t in raw_tags.split("#") if t.strip()]
    if not tags:
        tags = [category]
    
    # Abstract
    abstract_match = re.search(r'<div class="callout callout-definition" id="abstract">[\s\S]*?<p>([\s\S]*?)</p>', content)
    if not abstract_match:
        abstract_match = re.search(r'<meta name="description" content="(.*?)">', content)
    abstract = html.unescape(abstract_match.group(1).strip()) if abstract_match else ""
    abstract = re.sub(r'<[^>]+>', '', abstract)
    
    # BibTeX
    bibtex_match = re.search(r'<pre class="bibtex-code">([\s\S]*?)</pre>', content)
    if bibtex_match:
        bibtex = bibtex_match.group(1).strip()
    else:
        bib_key = f"lulz2026_{filename[:12].replace('-', '_')}"
        bibtex = f"""@article{{{bib_key},
  author    = {{{author}}},
  title     = {{{title}}},
  journal   = {{Lulztigre Dispatches}},
  year      = {{2026}},
  url       = {{{url}}}
}}"""

    is_placeholder = "PLACEHOLDER" in content.upper()

    # Target
    target = TARGET_MAP.get(filename, "")
    if not target:
        target_match = re.search(r'<span class="article-telemetry-lbl">TARGET RUNTIME</span>\s*<span class="article-telemetry-val">(.*?)</span>', content)
        if target_match:
            target = target_match.group(1).strip()

    # CVSS
    if filename in CVSS_MAP:
        cvss_text, cvss_class = CVSS_MAP[filename]
    else:
        cvss_match = re.search(r'<span class="dossier-sub-id"[^>]*>(.*?)</span>', content)
        cvss_text = cvss_match.group(1).strip() if cvss_match else "CVSS 7.5 HIGH"
        cvss_class = "crit" if "CRIT" in cvss_text.upper() else "high" if "HIGH" in cvss_text.upper() else "sec"

    # Parse date for sorting
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        dt = datetime(2026, 1, 1)

    return {
        "filename": filename,
        "url": url,
        "rel_link": rel_link,
        "memo_num": memo_num,
        "memo_label": memo_label,
        "title": title,
        "author": author,
        "date_str": date_str,
        "dt": dt,
        "read_time": read_time,
        "category": category,
        "tags": tags,
        "abstract": abstract,
        "bibtex": bibtex,
        "is_placeholder": is_placeholder,
        "target": target,
        "cvss_text": cvss_text,
        "cvss_class": cvss_class,
        "embargoed": False
    }

def generate_index_card(post: dict) -> str:
    data_tags = ", ".join(post["tags"])
    tag_chips = "\n".join([f'                <span class="tag-chip">{clean_text(tag)}</span>' for tag in post["tags"][:6]])
    
    placeholder_badge = ""
    if post.get("is_placeholder"):
        placeholder_badge = '\n                <span class="tag-chip" style="background: rgba(255, 153, 0, 0.15); color: #ff9900; border: 1px solid #ff9900; padding: 0.1rem 0.4rem; font-size: 0.65rem;">PLACEHOLDER</span>'

    return f"""          <!-- Auto-generated: {post['memo_label']} - {clean_text(post['title'])} -->
          <article class="post-card" 
                   data-tags="{data_tags}"
                   data-bibtex="{post['bibtex']}">
            <div class="post-card-header">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span class="post-id-badge">{post['memo_label']}</span>
                <span>DATE: {post['date_str']}</span>{placeholder_badge}
              </div>
              <span>EST. TIME: {post['read_time']}</span>
            </div>

            <h3 class="post-card-title">
              <a href="{post['rel_link']}">{clean_text(post['title'])}</a>
            </h3>

            <p class="post-abstract">
              {clean_text(post['abstract'])}
            </p>

            <div class="post-card-footer">
              <div class="post-tags">
{tag_chips}
              </div>
              <div class="post-card-actions">
                <button class="btn btn-secondary btn-sm" onclick="openBibtexModal(this)">BIBTEX</button>
                <a href="{post['rel_link']}" class="btn btn-primary btn-sm">READ DISPATCH →</a>
              </div>
            </div>
          </article>"""

def generate_archive_entry(post: dict) -> str:
    try:
        hex_val = f"0x{int(post['memo_num']):02X}"
    except (ValueError, TypeError):
        hex_val = "0x00"

    cvss_text = post.get("cvss_text", "CVSS 7.5 HIGH")
    cvss_class = post.get("cvss_class", "high")
    border_color = "#ff3366" if cvss_class == "crit" else "#ff9900" if cvss_class == "high" else "var(--accent-primary)"

    target = post.get("target", "")
    if target:
        if "FRAMEWORK:" in target:
            target_badge = f'<span class="target-badge-pill">{target}</span>'
        else:
            target_badge = f'<span class="target-badge-pill">TARGET: <strong>{clean_text(target)}</strong></span>'
    else:
        target_badge = ""

    filename = post["filename"]
    if filename in TAGS_OVERRIDE:
        archive_tags = TAGS_OVERRIDE[filename]
    else:
        archive_tags = post["tags"][:4]

    chips = []
    for t in archive_tags:
        if t.startswith("CVE-"):
            chip_cls = "chip-critical" if cvss_class == "crit" else "chip-high"
            chips.append(f'<span class="tag-chip {chip_cls}">{clean_text(t)}</span>')
        elif t in ["VERIFIED POC", "DETERMINISTIC POC", "COORDINATED FIX", "ROOT CHAIN", "PROVEN WEAPONIZATION", "80+ MODULES"]:
            chips.append(f'<span class="tag-chip chip-verified">{clean_text(t)}</span>')
        elif t == "PLACEHOLDER":
            chips.append('<span class="tag-chip chip-high">PLACEHOLDER</span>')
        else:
            chips.append(f'<span class="tag-chip">{clean_text(t)}</span>')
    tag_chips_html = "\n                ".join(chips)

    target_line = f"{target_badge}\n                " if target_badge else ""

    return f"""          <!-- Entry {hex_val}: {post['memo_label']} -->
          <article class="archive-entry-card" style="border-left: 4px solid {border_color};">
            <span class="card-reticle tl"></span>
            <span class="card-reticle br"></span>

            <div class="archive-entry-top">
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span class="hex-counter-badge">{hex_val}</span>
                <span class="memo-num-badge">{post['memo_label']}</span>
                {target_line}<span>{post['date_str']}</span>
              </div>
              <span class="post-cvss-indicator {cvss_class}">{cvss_text}</span>
            </div>

            <h3 class="archive-entry-title">
              <a href="{post['rel_link']}">
                {clean_text(post['title'])}
              </a>
            </h3>

            <p class="archive-entry-desc">
              {clean_text(post['abstract'])}
            </p>

            <div class="archive-entry-bottom">
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                {tag_chips_html}
              </div>
              <a href="{post['rel_link']}" class="btn btn-primary btn-sm">VIEW MEMO →</a>
            </div>
          </article>"""

def generate_rss_item(post: dict) -> str:
    if post.get("embargoed"):
        return ""
    pub_date = post["dt"].strftime("%a, %d %b %Y 00:00:00 GMT")
    return f"""    <item>
      <title>{clean_text(post['title'])}</title>
      <link>{post['url']}</link>
      <guid>{post['url']}</guid>
      <pubDate>{pub_date}</pubDate>
      <description>{clean_text(post['abstract'])}</description>
    </item>"""

def sync_all():
    post_files = list(POSTS_DIR.glob("*.html"))
    posts = [parse_post(f) for f in post_files]
    
    # Load any extra posts
    if EXTRA_POSTS_FILE.exists():
        try:
            extra_posts = json.loads(EXTRA_POSTS_FILE.read_text(encoding="utf-8"))
            for ep in extra_posts:
                if not any(p["filename"] == ep.get("filename") for p in posts):
                    ep.setdefault("dt", datetime(2026, 1, 1))
                    posts.append(ep)
        except Exception as e:
            print(f"[!] Warning reading extra_posts.json: {e}")

    # Sort descending by memo number, then date
    def sort_key(p):
        memo_val = int(p["memo_num"]) if str(p.get("memo_num", "")).isdigit() else 0
        dt_val = p.get("dt", datetime(2026, 1, 1))
        return (memo_val, dt_val)

    posts.sort(key=sort_key, reverse=True)
    
    total_posts = len(posts)
    latest_real_post = next((p for p in posts if p["date_str"] != "TBD"), None)
    latest_date = latest_real_post["date_str"] if latest_real_post else datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    print(f"[*] Total {total_posts} blog posts indexed:")
    for p in posts:
        print(f"    - {p['memo_label']} [{p['date_str']}] {p['title']}")
        
    # 1. Update index.html
    if INDEX_FILE.exists():
        index_content = INDEX_FILE.read_text(encoding="utf-8")
        
        index_content = re.sub(r'<button class="tag-btn active" data-tag="ALL">ALL \(\d+\)</button>',
                               f'<button class="tag-btn active" data-tag="ALL">ALL ({total_posts})</button>',
                               index_content)
        
        index_content = re.sub(r'<span class="posts-count" id="filtered-count">\[\d+ RECORDS? FOUND\]</span>',
                               f'<span class="posts-count" id="filtered-count">[{total_posts} RECORDS FOUND]</span>',
                               index_content)
        
        index_content = re.sub(r'(<span class="meta-key">LAST SYNC</span>\s*<span class="meta-val">)[^<]+(</span>)',
                               rf'\g<1>{latest_date} UTC\g<2>',
                               index_content)
        
        cards_html = "\n\n".join([generate_index_card(p) for p in posts])
        feed_pattern = r'(<div class="posts-feed" id="posts-feed">)[\s\S]*?(</div>\s*<!-- Filter Empty State -->)'
        index_content = re.sub(feed_pattern, rf'\1\n\n{cards_html}\n\n        \2', index_content)
        
        INDEX_FILE.write_text(index_content, encoding="utf-8")
        print("[+] Updated index.html successfully.")

    # 2. Update archive.html
    if ARCHIVE_FILE.exists():
        archive_content = ARCHIVE_FILE.read_text(encoding="utf-8")
        
        # Update Published Memos stat
        archive_content = re.sub(
            r'(<div class="archive-stat-tile">\s*<span class="archive-stat-val">)\d+(</span>\s*<span class="archive-stat-lbl">PUBLISHED MEMOS</span>)',
            rf'\g<1>{total_posts}\g<2>',
            archive_content
        )
        
        # Update CVE Disclosures stat count (6 published/staged CVEs)
        archive_content = re.sub(
            r'(<div class="archive-stat-tile">\s*<span class="archive-stat-val">)\d+(</span>\s*<span class="archive-stat-lbl">CVE DISCLOSURES</span>)',
            r'\g<1>6\g<2>',
            archive_content
        )
        
        entries_html = "\n\n".join([generate_archive_entry(p) for p in posts])
        archive_pattern = r'(<div class="archive-cycle-divider">\s*<span>// CYCLE 2026 // FIELD DISPATCHES</span>\s*</div>\s*<div style="display: flex; flex-direction: column; gap: 1.25rem;">)[\s\S]*?(</div>\s*</div>\s*<!-- Tactical Sidebar -->)'
        archive_content = re.sub(archive_pattern, rf'\1\n\n{entries_html}\n\n        \2', archive_content)
        
        ARCHIVE_FILE.write_text(archive_content, encoding="utf-8")
        print("[+] Updated archive.html successfully.")

    # 3. Update feed.xml
    if FEED_FILE.exists():
        now_rfc822 = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")
        rss_items = [generate_rss_item(p) for p in posts if generate_rss_item(p)]
        items_html = "\n\n".join(rss_items)
        
        feed_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Lulztigre // Phantom Research Kernel</title>
    <link>https://lulztigre.pw/</link>
    <description>Stealth research blog exploring mechanistic interpretability, distributed consensus, and zero-knowledge cryptography.</description>
    <language>en-us</language>
    <lastBuildDate>{now_rfc822}</lastBuildDate>
    <atom:link href="https://lulztigre.pw/feed.xml" rel="self" type="application/rss+xml"/>

{items_html}
  </channel>
</rss>
"""
        FEED_FILE.write_text(feed_content, encoding="utf-8")
        print("[+] Updated feed.xml successfully.")

if __name__ == "__main__":
    sync_all()
