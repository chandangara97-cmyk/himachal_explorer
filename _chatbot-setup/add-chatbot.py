#!/usr/bin/env python3
"""
Adds (or updates / removes) the Himachal Explorer chatbot on every HTML page of the site.

Run from the ROOT of your website repo (the folder that contains index.html):

    python3 _chatbot-setup/add-chatbot.py --whatsapp 919876543210 --dry-run   # preview only
    python3 _chatbot-setup/add-chatbot.py --whatsapp 919876543210             # apply
    python3 _chatbot-setup/add-chatbot.py --remove                            # undo everything

It is safe to run repeatedly: an existing chatbot block is updated in place, never duplicated.
Windows: use  py  instead of  python3.
"""
import argparse, os, re, sys, time

START = "<!-- hx-chatbot:start -->"
END = "<!-- hx-chatbot:end -->"
BLOCK_RE = re.compile(re.escape(START) + r".*?" + re.escape(END) + r"\r?\n?", re.S)
BODY_RE = re.compile(r"</body\s*>", re.I)
REFRESH_RE = re.compile(r"http-equiv\s*=\s*[\"']?refresh", re.I)

DEFAULT_SKIP_DIRS = {".git", ".github", "node_modules", "_chatbot-setup", "admin", "legacy", "docs",
                     "android", "app", "build", "dist", "vendor"}


def read(path):
    with open(path, "rb") as f:
        raw = f.read()
    # only treat as "utf-8-sig" when the file really starts with a BOM, so we never add or strip one
    order = ("utf-8-sig", "cp1252") if raw.startswith(b"\xef\xbb\xbf") else ("utf-8", "cp1252")
    for enc in order:
        try:
            return raw.decode(enc), enc
        except UnicodeDecodeError:
            continue
    return None, None


def write(path, text, enc):
    # keep the original encoding and line endings untouched
    with open(path, "wb") as f:
        f.write(text.encode(enc))


def make_block(base, whatsapp, version, nl):
    lines = [START]
    if whatsapp:
        lines.append('<script>window.HX_CONFIG={whatsapp:"%s"};</script>' % whatsapp)
    lines.append('<script src="%shx-chatbot.js?v=%s" defer></script>' % (base, version))
    lines.append(END)
    return nl.join(lines) + nl


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default=".", help="site root (default: current folder)")
    ap.add_argument("--whatsapp", default="", help="WhatsApp number, digits only with country code, e.g. 919876543210")
    ap.add_argument("--base", default="/", help='URL prefix where hx-chatbot.js is served (default "/" for a custom domain)')
    ap.add_argument("--skip", action="append", default=[], help="extra folder name to skip (repeatable)")
    ap.add_argument("--dry-run", action="store_true", help="show what would change, write nothing")
    ap.add_argument("--remove", action="store_true", help="remove the chatbot from all pages")
    a = ap.parse_args()

    root = os.path.abspath(a.root)
    if not os.path.isfile(os.path.join(root, "index.html")):
        sys.exit("index.html not found in %s. Run this from your site root (or pass --root)." % root)
    if not a.remove and not os.path.isfile(os.path.join(root, "hx-chatbot.js")):
        sys.exit("hx-chatbot.js is not in the site root. Copy it next to index.html first.")
    if a.whatsapp and not re.fullmatch(r"\d{10,15}", a.whatsapp):
        sys.exit("--whatsapp must be digits only, with country code (example: 919876543210).")
    if not a.base.endswith("/"):
        a.base += "/"

    skip_dirs = DEFAULT_SKIP_DIRS | set(a.skip)
    version = time.strftime("%Y%m%d%H%M")
    added, updated, removed, skipped, unchanged = [], [], [], [], []

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if d not in skip_dirs)
        for fn in sorted(filenames):
            if not fn.lower().endswith((".html", ".htm")):
                continue
            path = os.path.join(dirpath, fn)
            rel = os.path.relpath(path, root).replace(os.sep, "/")
            text, enc = read(path)
            if text is None:
                skipped.append((rel, "unreadable encoding")); continue
            nl = "\r\n" if "\r\n" in text else "\n"
            has_block = bool(BLOCK_RE.search(text))

            if a.remove:
                if has_block:
                    removed.append(rel)
                    if not a.dry_run:
                        write(path, BLOCK_RE.sub("", text), enc)
                continue

            if REFRESH_RE.search(text):
                skipped.append((rel, "redirect stub")); continue
            if not BODY_RE.search(text):
                skipped.append((rel, "no </body> (partial or include)")); continue

            block = make_block(a.base, a.whatsapp, version, nl)
            if has_block:
                new = BLOCK_RE.sub(lambda m: block, text, count=1)
                (updated if new != text else unchanged).append(rel)
            else:
                idx = [m.start() for m in BODY_RE.finditer(text)][-1]
                new = text[:idx] + block + text[idx:]
                added.append(rel)
            if not a.dry_run and new != text:
                write(path, new, enc)

    tag = "[DRY RUN] " if a.dry_run else ""
    if a.remove:
        print("%sRemoved from %d page(s)." % (tag, len(removed)))
        for r in removed: print("  -", r)
        return
    print("%sAdded to %d page(s), updated %d, already current %d, skipped %d." % (tag, len(added), len(updated), len(unchanged), len(skipped)))
    for r in added: print("  + added   ", r)
    for r in updated: print("  ~ updated ", r)
    for r, why in skipped: print("  . skipped ", r, "(%s)" % why)
    if not a.whatsapp:
        print("\nNote: no --whatsapp given. The bot will send WhatsApp requests to your contact page until you set it.")
    print("\nNext: commit and push, then open any page and look for the orange 'Plan your trip' button.")


if __name__ == "__main__":
    main()
