"""Zet de huisstijl (de map kit/ van de hub) over naar één of meer spellen.

    python kit/tools/sync-kit.py mijnspel            # kopieer naar mijnspel/kit/
    python kit/tools/sync-kit.py --check mijnspel    # enkel kijken: verschilt er iets?
    python kit/tools/sync-kit.py --all               # alle spellen die al een kit/ hebben

Elk spel krijgt een gewone KOPIE, geen link: zo blijft "wat in de repo staat, staat online"
waar, werkt het spel offline, en breekt een aanpassing aan de kit nooit ongemerkt een
spel dat al online staat. De kopie draagt een kit/VERSION met de vingerafdruk.
"""
import hashlib
import os
import shutil
import sys

HUB = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KIT = os.path.join(HUB, "kit")

# enkel wat een spel in de browser nodig heeft; geen gids, geen tools
FILES = [
    "tokens.css", "arcade.css", "tokens.js", "ttcw.js", "board.js",
    "logo/ttc-bat.svg", "logo/ttc-bat-512.png", "logo/clublogo.png",
    "sponsor/spotit.png",
]


def fingerprint():
    h = hashlib.sha256()
    for f in FILES:
        h.update(f.encode())
        with open(os.path.join(KIT, f), "rb") as fh:
            h.update(fh.read())
    return h.hexdigest()[:12]


def differs(game_dir):
    out = []
    for f in FILES:
        src, dst = os.path.join(KIT, f), os.path.join(game_dir, "kit", f)
        if not os.path.exists(dst):
            out.append(f + " (ontbreekt)")
            continue
        with open(src, "rb") as a, open(dst, "rb") as b:
            if a.read() != b.read():
                out.append(f)
    return out


def sync(game_dir):
    for f in FILES:
        dst = os.path.join(game_dir, "kit", f)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(os.path.join(KIT, f), dst)
    with open(os.path.join(game_dir, "kit", "VERSION"), "w", encoding="utf-8") as fh:
        fh.write(fingerprint() + "\n")
        fh.write("Kopie van de clubhuisstijl. Niet hier aanpassen: pas de hub aan en\n")
        fh.write("draai daarna python kit/tools/sync-kit.py <spel> vanuit de hub.\n")


def main(argv):
    check = "--check" in argv
    names = [a for a in argv if not a.startswith("--")]
    if "--all" in argv:
        names = [d for d in sorted(os.listdir(HUB))
                 if os.path.isdir(os.path.join(HUB, d, "kit")) and d not in ("kit", "template")]
    if not names:
        print(__doc__)
        return 2
    bad = 0
    for name in names:
        game = os.path.join(HUB, name)
        if not os.path.isdir(game):
            print("?? %s: geen map" % name)
            bad += 1
            continue
        diff = differs(game)
        if check:
            print(("OK  %s" % name) if not diff else ("OUD %s: %s" % (name, ", ".join(diff))))
            bad += bool(diff)
        else:
            sync(game)
            print("%s/kit bijgewerkt (%d bestanden, %s)" % (name, len(diff), fingerprint()))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
