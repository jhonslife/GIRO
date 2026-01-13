#!/usr/bin/env python3
import re
from pathlib import Path

root = Path(".").resolve()
md_files = list(root.rglob("*.md"))

changed_files = []

for path in md_files:
    try:
        text = path.read_text(encoding="utf-8")
    except Exception:
        continue
    orig = text

    # 1) MD040: replace code fence lines that are exactly ``` with ```text
    text = re.sub(r"^```\s*$", "```text", text, flags=re.M)

    # 2) MD026: remove trailing punctuation (colon) in headings (e.g., '# Heading:')
    text = re.sub(r"^(#{1,6}\s.*?)\:\s*$", r"\1", text, flags=re.M)

    # 3) MD034: wrap bare URLs on their own line with <>
    text = re.sub(r"^(https?://\S+)\s*$", r"<\1>", text, flags=re.M)

    # 4) MD036: emphasis used as heading -> convert to level-2 heading
    text = re.sub(r"^\s*\*{1,2}(.+?)\*{1,2}\s*$", r"## \1", text, flags=re.M)
    text = re.sub(r"^\s*_ {1,2}(.+?)_{1,2}\s*$", r"## \1", text, flags=re.M)

    # 5) MD024: duplicate headings -> append " (cont.)" to subsequent duplicates
    lines = text.splitlines()
    seen = {}
    for i, line in enumerate(lines):
        m = re.match(r"^(#{1,6})\s+(.*)$", line)
        if m:
            level = m.group(1)
            title = m.group(2).strip()
            key = (level, title.lower())
            if key in seen:
                seen[key] += 1
                lines[i] = f"{level} {title} (cont.)"
            else:
                seen[key] = 1
    text = "\n".join(lines)

    if text != orig:
        path.write_text(text, encoding="utf-8")
        changed_files.append(str(path))

print(
    f"Processed {len(md_files)} markdown files. Modified: {len(changed_files)} files."
)
for f in changed_files:
    print(f)
