"""Bereitet die Schlangenbilder für die App auf: weißen Hintergrund entfernen, zuschneiden, als WebP speichern.
Aufruf im Projektordner: python3 tools/bilder_aufbereiten.py
Ergebnis: public/images/snake/app/<stufe>-<stimmung>.webp
"""
import numpy as np
from PIL import Image, ImageFilter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / 'public' / 'images' / 'snake'
OUT = ROOT / 'app'
OUT.mkdir(exist_ok=True)
MAXSEITE = 640


def freistellen(im: Image.Image) -> Image.Image:
    """Entfernt den hellen Hintergrund samt weichem Schatten. Nur Pixel, die vom Rand aus erreichbar sind,
    werden transparent, so bleiben weiße Augen oder Glanzlichter im Bild erhalten."""
    im = im.convert('RGBA')
    a = np.array(im)
    rgb = a[..., :3].astype(int)
    hell = (rgb.min(axis=2) >= 215) & ((rgb.max(axis=2) - rgb.min(axis=2)) <= 18)
    leer = a[..., 3] < 30
    kandidat = hell | leer
    erreicht = leer.copy()
    erreicht[0, :] |= kandidat[0, :]; erreicht[-1, :] |= kandidat[-1, :]
    erreicht[:, 0] |= kandidat[:, 0]; erreicht[:, -1] |= kandidat[:, -1]
    while True:
        n = erreicht.copy()
        n[1:, :] |= erreicht[:-1, :]; n[:-1, :] |= erreicht[1:, :]
        n[:, 1:] |= erreicht[:, :-1]; n[:, :-1] |= erreicht[:, 1:]
        n &= kandidat
        if (n == erreicht).all():
            break
        erreicht = n
    alpha = Image.fromarray(np.where(erreicht, 0, a[..., 3]).astype('uint8'))
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    im.putalpha(alpha)
    return im


def speichern(im: Image.Image, name: str) -> None:
    im = freistellen(im)
    box = im.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox()
    if box:
        im = im.crop(box)
    im.thumbnail((MAXSEITE, MAXSEITE), Image.LANCZOS)
    im.save(OUT / f'{name}.webp', quality=88, method=6)
    print(name, im.size)


def viertel(pfad: Path):
    im = Image.open(pfad).convert('RGBA')
    w, h = im.size
    return {
        'happy': im.crop((0, 0, w // 2, h // 2)),
        'tired': im.crop((w // 2, 0, w, h // 2)),
        'eating': im.crop((0, h // 2, w // 2, h)),
        'surprised': im.crop((w // 2, h // 2, w, h)),
    }


def lade(pfad: str) -> Image.Image:
    return Image.open(ROOT / pfad)


# Normalbilder: die Fassung mit Transparenz
for stufe, datei in [('baby', 'baby'), ('smallChild', 'smallChild'), ('child', 'child'), ('teen', 'teen'), ('adult', 'adult')]:
    speichern(lade(f'transparent/snake-{datei}.png'), f'{stufe}-standard')

# Baby: Einzelbilder
for m, d in [('happy', 'baby/happy_baby2.png'), ('tired', 'baby/tired_baby2.png'), ('eating', 'baby/food_baby2.png'), ('surprised', 'baby/surprised_baby2.png')]:
    speichern(lade(d), f'baby-{m}')

# Kleinkind: Einzelbilder (Bildschirmfotos)
bc = sorted((ROOT / 'babychild').glob('Bildschirmfoto*.png'))
for m, p in zip(['happy', 'tired', 'eating', 'surprised'], bc):
    speichern(Image.open(p), f'smallChild-{m}')

# Kind: Tafel mit vier Gesichtern
for m, im in viertel(ROOT / 'child' / 'childGefuehle.png').items():
    speichern(im, f'child-{m}')
# Teenager und Erwachsene: nur das Normalbild. Die Gefühls-Tafeln im Ordner teen/ zeigen den Stil des Kindes und passen nicht zum Teenager.

# ---------- Shop ----------
# Reihenfolge = alphabetisch sortierte Dateinamen im Ordner Shop/. IDs müssen zu src/logic/shop.ts passen.
SHOP_IDS = [
    'alocasia', 'gewundener-ast', 'knorriger-ast', 'wurzelbogen', 'blaetterzweig', 'ranken', 'alter-stamm', 'lianenbogen',
    'moosstamm', 'eckstamm', 'geaest', 'brunnen', 'haengebruecke', 'spiralast', 'monstera-topf', 'fliegenfalle-topf',
    'bluetenranke', 'runenast', 'leuchtpilzast', 'zauberast', 'goldast', 'eisast', 'dichte-liane', 'korallenast',
    'strauchast', 'korkrinde', 'rinde', 'duenner-ast', 'felshoehle', 'zimmerpflanze', 'discokugel', 'wassernapf',
    'steinturm', 'moos-hoehle', 'steinhaufen', 'fliegenfallen', 'haengematte', 'kristall', 'kristall-rosa', 'monstera',
    'geode', 'steinweg', 'terrarium1', 'terrarium2', 'wasserfall',
]
SHOP_OUT = OUT / 'shop'
SHOP_OUT.mkdir(exist_ok=True)
dateien = sorted((ROOT / 'Shop').glob('*.png'))
assert len(dateien) == len(SHOP_IDS), (len(dateien), len(SHOP_IDS))
for pfad, sid in zip(dateien, SHOP_IDS):
    im = Image.open(pfad)
    if sid.startswith('terrarium'):
        im = im.convert('RGB')
        im.thumbnail((640, 800), Image.LANCZOS)
        im.save(SHOP_OUT / f'{sid}.webp', quality=85, method=6)
        print('shop', sid, im.size)
        continue
    im = freistellen(im)
    box = im.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox()
    if box:
        im = im.crop(box)
    im.thumbnail((360, 360), Image.LANCZOS)
    im.save(SHOP_OUT / f'{sid}.webp', quality=88, method=6)
    print('shop', sid, im.size)
