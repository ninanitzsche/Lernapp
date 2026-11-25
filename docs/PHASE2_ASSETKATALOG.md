# Phase 2 – Asset-Katalog und Produktionsstatus

> **Branch:** `design/luminous-fantasy-adventure`
> **Status:** Arbeitskatalog; keine Konzeptgrafik gilt automatisch als Produktionsasset.
> **Leitdokumente:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) · [PHASE2_ASSETPLAN.md](./PHASE2_ASSETPLAN.md) · [PHASE2_NICO_REFERENZ.md](./PHASE2_NICO_REFERENZ.md) · [PHASE2_NICO_EMOTIONSMATRIX.md](./PHASE2_NICO_EMOTIONSMATRIX.md)

## Statusdefinitionen

| Status | Bedeutung |
|---|---|
| Bestand | Bereits im Repository vorhanden; technische und visuelle Eignung kann noch offen sein |
| Konzept | Stil-/Motivstudie, nicht für die Laufzeit geeignet |
| Zu produzieren | Benötigtes Einzelasset ohne freigegebene Produktionsdatei |
| Freigegeben | Visuell vom Projektinhaber bestätigt |
| Produktionsasset | Einzeldatei mit geprüftem Zuschnitt, Transparenz, Größe und Format |
| Integriert | Im Code referenziert und in der App visuell geprüft |

## 1. Charakter Nico

| Assetgruppe | Bestand / Referenz | Zielumfang | Status | Nächster Schritt |
|---|---|---:|---|---|
| Baby neutral | `public/images/snake/app/baby-standard.webp`; neuer Kandidat `nico_baby_neutral.webp` (ZIP außerhalb des Repos) | 1 | Bestand + Kandidat technisch geprüft, visuell offen | Kandidat prüfen; erst nach Freigabe in den Repo-Assetpfad übernehmen |
| Kleinkind neutral | `public/images/snake/app/smallChild-standard.webp` | 1 | Bestand | Als Basis behalten; Kontinuität prüfen |
| Kind neutral | `public/images/snake/app/child-standard.webp` | 1 | Bestand | Augen-/Kopfkontinuität harmonisieren |
| Teenager neutral | `public/images/snake/app/teen-standard.webp` | 1 | Bestand | Silhouette behalten; reifere, weniger niedliche Wirkung |
| Erwachsen/legendär neutral | Logo + `adult-standard.webp` | 1 | Bestand / zu überarbeiten | App-Pose an Logo-Identität annähern |
| Emotionen | Emotionsmatrix | 35 | Zu produzieren | 7 Zustände aus 5 freigegebenen Basen ableiten |

## 2. Terrarium und Welt

| Assetgruppe | Bestand | Zielumfang | Status | Nächster Schritt |
|---|---|---:|---|---|
| Terrarium-Hintergrund | `terrarium1.webp`, `terrarium2.webp` | 1–2 | Bestand / Stilabgleich offen | Luminous-Fantasy-Tiefe und UI-Ruheflächen prüfen |
| Modulare Naturbausteine | Wurzeln, Äste, Moos, Steine, Pflanzen | 8–12 | Zu prüfen / teilweise Bestand | Wiederverwendbare Vordergrund-/Hintergrundteile katalogisieren |
| Magische Akzente | Kristalle, Glow-Pflanzen, Sporen | 5–8 | Zu produzieren / Bestand prüfen | Als separate Layer gestalten |
| Lernansicht-Hintergrund | noch keiner freigegeben | 1 | Zu produzieren | Reduzierte, kontrastarme Variante |

## 3. Shop- und Terrariumobjekte

| Assetgruppe | Bestand | Zielumfang | Status | Nächster Schritt |
|---|---|---:|---|---|
| Shop-Objekte | 45 WebP in `snake/app`, 45 PNG-Quellen in `snake/Shop` | Bestand wiederverwenden | Bestand | Vollständige Sichtprüfung, Duplikate und Stilabweichungen markieren |
| Pflanzen / Töpfe | Teil des Bestands | 4–6 | Bestand / zu prüfen | Perspektive und Material vereinheitlichen |
| Kristalle / Steine | Teil des Bestands | 4–6 | Bestand / zu prüfen | Luminous-Fantasy-Material definieren |
| Nester / Äste / Rückzugsorte | Bestand teilweise vorhanden | 3–5 | Bestand / zu prüfen | Schlangenspezifische Motive ergänzen |
| Futter | bestehende Motive | 1–3 | Bestand | Als separate Requisite, nie in Emotion einbetten |

## 4. Belohnungen und Fortschritt

| Assetgruppe | Zielumfang | Status | Nächster Schritt |
|---|---:|---|---|
| Schuppenband / Schwierigkeitsanzeige | 1 Grundmotiv + 0–3 gefüllte Zustände | Zu produzieren | Zeigt leicht/mittel/knifflig; keine Sammelwährung (siehe `REWARD_SYSTEM.md`) |
| Pokale / Medaillen | 3–5 | Zu produzieren / Bestand prüfen | Terrarium-Belohnungen konsistent gestalten |
| Relikt / Expertenbereich | 1 Tür + 3–5 Relikte | Zu produzieren | Erst nach Themenabschluss sichtbar; bestehende Spiellogik beachten |
| Wissensalbum-Themenillustrationen | modular je Lernfeld | Zu produzieren | Motivsystem definieren; keine Fachwelten anderer Fächer vorwegnehmen |

## 5. Technische Abnahme pro Produktionsasset

### Erster Nico-Kandidat (noch nicht integriert)

- Datei: `nico_baby_neutral.webp` (im Paket `nico_phase2_first_production_candidate.zip`, außerhalb des Repositories)
- Maße: 1328 × 1317 px
- Format: WebP, RGBA / echter Alpha-Kanal
- Dateigröße: ca. 230 KB
- Status: technisch geprüft, visuelle Freigabe offen



- [ ] Einzelmotiv ohne Beschriftung, Rahmen oder UI
- [ ] Transparenter Hintergrund, falls freigestellt benötigt
- [ ] Alpha-Kanal tatsächlich vorhanden und sauber (kein simuliertes Schachbrett)
- [ ] Keine abgeschnittenen Konturen; sinnvoller transparenter Rand
- [ ] Auflösung passend zum konkreten UI-Einsatz
- [ ] Dateiformat und Dateigröße optimiert
- [ ] Keine anatomischen Fehler bei Nico (insbesondere keine Flossen, Beine oder Flügel)
- [ ] Darstellung in hellem und dunklem UI-Kontext geprüft
- [ ] Code-Referenz und Fallback geprüft
- [ ] Asset-Pfad und Verwendung dokumentiert

## 6. Aktuelle Produktionsregel

Konzepttafeln, die mehrere Figuren, Beschriftungen, Panels oder Hintergründe enthalten, werden ausschließlich als visuelle Referenzen geführt. Vor Integration werden die Motive als echte Einzeldateien erstellt, technisch geprüft und erst danach in der Laufzeit verwendet.
