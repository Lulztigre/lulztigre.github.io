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
    title_match = re.search(r'<h1 class="article-title">(.*?)</h1>', content, re.DOTALL)
    if not title_match:
        title_match = re.search(r'<meta property="og:title" content="(.*?)">', content)
    if not title_match:
        title_match = re.search(r'<title>(.*?)(?:\s*//.*)?</title>', content)
    title = html.unescape(title_match.group(1).strip()) if title_match else filename.replace(".html", "")
    
    # Author
    author_match = re.search(r'<span class="meta-label">AUTHOR:</span>\s*<strong>(.*?)</strong>', content)
    author = author_match.group(1).strip() if author_match else "Lulztigre"
    
    # Date
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
        "embargoed": False
    }

def generate_index_card(post: dict) -> str:
    data_tags = ", ".join(post["tags"])
    tag_chips = "\n".join([f'                <span class="tag-chip">{clean_text(tag)}</span>' for tag in post["tags"][:6]])
    
    return f"""          <!-- Auto-generated: {post['memo_label']} - {clean_text(post['title'])} -->
          <article class="post-card" 
                   data-tags="{data_tags}"
                   data-bibtex="{post['bibtex']}">
            <div class="post-card-header">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span class="post-id-badge">{post['memo_label']}</span>
                <span>DATE: {post['date_str']}</span>
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
    cat_tag = post["category"] or "OFFENSIVE SECURITY"
    return f"""            <div class="post-card" style="padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
                <span>{post['memo_label']} // {post['date_str']}</span>
                <span class="tag-chip">{cat_tag}</span>
              </div>
              <h3 style="font-size: 1.15rem; margin: 0.35rem 0;">
                <a href="{post['rel_link']}" style="color: var(--text-primary); text-decoration: none;">
                  {clean_text(post['title'])}
                </a>
              </h3>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0;">
                {clean_text(post['abstract'])}
              </p>
            </div>"""

def generate_rss_item(post: dict) -> str:
    # Do not include embargoed posts in RSS
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
    
    # Load any extra/embargoed posts
    if EXTRA_POSTS_FILE.exists():
        try:
            extra_posts = json.loads(EXTRA_POSTS_FILE.read_text(encoding="utf-8"))
            for ep in extra_posts:
                # If post isn't already covered by a real html file
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
    latest_real_post = next((p for p in posts if not p.get("embargoed") and p["date_str"] != "TBD"), None)
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
        
        archive_content = re.sub(r'ARCHIVE_INDEX: \d+ ENTRIES',
                                 f'ARCHIVE_INDEX: {total_posts} ENTRIES',
                                 archive_content)
        
        entries_html = "\n\n".join([generate_archive_entry(p) for p in posts])
        archive_pattern = r'(<h2 style="margin-top: 1rem; border-color: var\(--accent-primary\);">2026 RESEARCH LOG</h2>\s*<div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.25rem;">)[\s\S]*?(</div>\s*</div>\s*<!-- 2025/Older or layout closing -->|</div>\s*</div>\s*</article>)'
        archive_content = re.sub(archive_pattern, rf'\1\n\n{entries_html}\n\n          \2', archive_content)
        
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
