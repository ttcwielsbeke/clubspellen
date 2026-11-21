"""Start een nieuw clubspel vanuit template/, met de huisstijl erin.

    python tools/nieuw-spel.py servicekoning --titel "SERVICEKONING!"

Optioneel: --kop "krantenkop van de nieuwsflits"  --omschrijving "één zin"  --poort 8133

Wat het doet:
  1. kopieert template/ naar <slug>/ en vult {{TITEL}}, {{SLUG}}, ... in
  2. zet de kit erin (kit/tools/sync-kit.py)
  3. geeft het spel een eigen poort en zet het in .claude/launch.json van de hub
  4. git init op main (pushen naar github.com/ttcwielsbeke/<slug> doe je zelf)
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys

HUB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXT = (".html", ".css", ".js", ".md", ".json", ".py")


def next_port(launch):
    used = {c.get("port", 0) for c in launch["configurations"]} | {8124}  # 8124 = ogsave
    p = 8133
    while p in used:
        p += 1
    return p


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug", help="kleine letters, zonder spaties: wordt de repo- en url-naam")
    ap.add_argument("--titel", required=True, help='bv. "SERVICEKONING!"')
    ap.add_argument("--kop", default="Bestuur lanceert alweer een videospel. Leden reageren verdeeld.")
    ap.add_argument("--omschrijving", default="Het nieuwste videospel van TTC Wielsbeke-Spotit.")
    ap.add_argument("--poort", type=int)
    ap.add_argument("--bestaande-map", action="store_true",
                    help="de map bestaat al (bv. al een git-repo): vul aan, overschrijf niets")
    a = ap.parse_args()

    if not re.fullmatch(r"[a-z][a-z0-9-]{2,30}", a.slug):
        sys.exit("slug: kleine letters, cijfers en '-', 3 tot 31 tekens")
    dst = os.path.join(HUB, a.slug)
    if os.path.exists(dst) and not a.bestaande_map:
        sys.exit("%s bestaat al (gebruik --bestaande-map om aan te vullen zonder te overschrijven)" % dst)

    launch_path = os.path.join(HUB, ".claude", "launch.json")
    with open(launch_path, encoding="utf-8") as fh:
        launch = json.load(fh)
    port = a.poort or next_port(launch)

    # het logo op het titelscherm: titel over twee regels (rood + goud)
    words = a.titel.split()
    l1, l2 = (" ".join(words[:-1]), words[-1]) if len(words) > 1 else (a.titel, "")
    vals = {"TITEL": a.titel, "SLUG": a.slug, "POORT": str(port), "KRANTENKOP": a.kop,
            "OMSCHRIJVING": a.omschrijving, "LOGO_REGEL1": l1, "LOGO_REGEL2": l2}

    # kopieer het sjabloon; een bestand dat er al staat, blijft staan
    tpl = os.path.join(HUB, "template")
    new = []
    for root, _, files in os.walk(tpl):
        for f in files:
            src = os.path.join(root, f)
            out = os.path.join(dst, os.path.relpath(src, tpl))
            if os.path.exists(out):
                print("  laat staan: %s" % os.path.relpath(out, HUB))
                continue
            os.makedirs(os.path.dirname(out), exist_ok=True)
            shutil.copyfile(src, out)
            new.append(out)
    for p in new:
        if not p.endswith(TEXT):
            continue
        with open(p, encoding="utf-8") as fh:
            s = fh.read()
        for k, v in vals.items():
            s = s.replace("{{%s}}" % k, v)
        with open(p, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(s)

    subprocess.check_call([sys.executable, os.path.join(HUB, "kit", "tools", "sync-kit.py"), a.slug])

    if not any(c.get("name") == a.slug for c in launch["configurations"]):
        launch["configurations"].append({
            "name": a.slug, "runtimeExecutable": "python",
            "runtimeArgs": ["-m", "http.server", str(port), "--directory", a.slug], "port": port})
    with open(launch_path, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(launch, fh, indent=2)
        fh.write("\n")

    # de hub negeert spelmappen: elk spel is een eigen repo
    gi = os.path.join(HUB, ".gitignore")
    if os.path.exists(gi):
        with open(gi, encoding="utf-8") as fh:
            lines = fh.read().splitlines()
        if "/%s/" % a.slug not in lines:
            at = next((i for i, l in enumerate(lines) if l.startswith("# nieuwe spellen")), len(lines))
            lines.insert(at, "/%s/" % a.slug)
            with open(gi, "w", encoding="utf-8", newline="\n") as fh:
                fh.write("\n".join(lines) + "\n")

    if not os.path.isdir(os.path.join(dst, ".git")):   # al een repo? dan niets doen
        try:
            subprocess.check_call(["git", "init", "-q", "-b", "main"], cwd=dst)
        except (OSError, subprocess.CalledProcessError):
            print("(git init lukte niet; doe het zelf)")

    print("\nKlaar: %s/  -  http://localhost:%d" % (a.slug, port))
    print("Volgende stap: maak github.com/ttcwielsbeke/%s aan en push." % a.slug)


if __name__ == "__main__":
    main()
