# Design System – Luminous Fantasy Adventure

> **Produkt:** Nico's Snake App  
> **Status:** Visuelle Richtung und Designentscheidungen freigegeben. Phase 1 (Designsystem und UI-Grundlagen) ist auf Code-Ebene abgeschlossen und automatisiert geprüft. Die manuelle Browser-/Viewport-Sichtprüfung ist als übergreifende Qualitätssicherung in Phase 5 offen; die vollständige Vereinheitlichung aller Screens gehört zu Phase 3.  
> **Arbeitsstand:** [ROADMAP_DESIGN.md](./ROADMAP_DESIGN.md) · **Ausgangslage:** [PHASE0_INVENTAR.md](./PHASE0_INVENTAR.md)

Dieses Dokument enthält ausschließlich die aktuell gültige visuelle Referenz.

## 1. Leitidee und Markenversprechen

Nico ist zunächst ein niedlicher, neugieriger Begleiter und entwickelt sich mit dem Lernen zu einer mächtigen, gefährlich wirkenden, giftgrün leuchtenden Schlange. Die erwachsene Form orientiert sich exakt am bestehenden Logo. Sie ist stark und geheimnisvoll, aber auf der Seite des Kindes.

**Markenversprechen:** Das Kind lernt, Nico wächst – und die kleine Schlange wird zur Legende.

Das bestehende Logo ist das Key Visual und die Vision der höchsten Entwicklungsstufe. Es wird unverändert verwendet und nicht in jeder Ansicht wiederholt.

## 2. Art Direction

**Luminous Fantasy Adventure** verbindet:
- hochwertige, stilisierte 3D-Fantasy-Spielwelten;
- biolumineszente, giftgrüne Lichtakzente;
- eine warme, hochwertige Mobile-Game-Oberfläche;
- liebevolle, ausdrucksstarke Charaktere;
- eine gemütliche Abenteueratmosphäre.

Die App soll wie ein zusammenhängendes, sorgfältig gestaltetes Adventure-Game wirken – nicht wie ein Standard-Dashboard und nicht wie eine Sammlung unterschiedlicher UI-Stile.

### Verbindliche Stilbausteine

Die Art Direction besteht aus vier zusammengehörigen Elementen:

1. **Stylized 3D Fantasy Game Art:** hochwertige stilisierte 3D-Spielgrafik, plastische Figuren, räumliche Tiefe und liebevoll gestaltete Umgebungen.
2. **Bioluminescent Fantasy:** giftgrüne Leuchteffekte, magische Pflanzen und Kristalle sowie eine geheimnisvolle, aber einladende Atmosphäre.
3. **Premium Mobile Game UI:** runde, haptisch wirkende Bedienelemente, hochwertige Materialanmutung, goldene Akzente und klare Hierarchien.
4. **Stylized 3D Character Design:** ausdrucksstarke Figuren, große Augen, detaillierte Schuppen und eine konsistente Charakterentwicklung.

Diese vier Elemente bilden eine gemeinsame Bild- und Formensprache. Sie sind keine voneinander unabhängigen Stiloptionen.

## 3. Farbpalette

| Token | Wert | Verwendung |
|---|---|---|
| Toxic Lime | `#9DFF00` | Fortschritt, Glow und besondere Akzente |
| Emerald Green | `#00C853` | Markenfarbe und positive Aktionen |
| Deep Forest | `#064D30` | Spielwelt und dunkle Panels |
| Warm Gold | `#FFD329` | Hauptaktionen, Sterne und Belohnungen |
| Amber Orange | `#FF9D16` | sekundäre Belohnungsakzente |
| Midnight Blue | `#071D35` | Tiefe und dunkle Konturen |
| Warm Cream | `#FFF4DE` | Aufgaben, Dialoge und lesbare Inhaltsflächen |

### Farbregeln
- Dunkle Waldtöne bilden die atmosphärische Bühne, nicht eine undifferenzierte Vollbildfläche.
- Creme bündelt Inhalte und sorgt für Lesbarkeit.
- Gold kennzeichnet wichtige Aktionen und Belohnungen.
- Giftgrün bleibt ein gezielter Akzent für Fortschritt, Magie und besondere Momente.
- Nicht jede Komponente erhält Glow, Verlauf oder starken Schatten.
- Kontrast und Bedeutung sind wichtiger als dekorative Effekte.

## 4. Visuelle Ebenen

### A. Spielwelt
Stilisierte 3D-Umgebungen mit Tiefe, Materialität und warmem Licht. Das Terrarium darf besonders reich gestaltet sein. Hintergründe dürfen Inhalte und Bedienelemente nicht überlagern.

### B. Charaktere und Assets
Nico hat fünf Entwicklungsstufen: Baby, Kleinkind, Kind, Teenager und Erwachsen/legendär. Alle Stufen müssen klar dieselbe Figur zeigen. Gesicht, Augen, Silhouette und Farbwelt bleiben verwandt; Haltung, Details und Leuchtkraft entwickeln sich.

Pflanzen, Kristalle, Steine, Dekoration und Effekte werden als eigenständige Assets geführt.

### C. UI
Texte, Zahlen, Buttons und interaktive Elemente bleiben echte responsive React-/CSS-Komponenten. UI wird nicht in generierte Hintergrundbilder eingebrannt.

## 5. Screen-Prinzipien

### Splash
- Vorhandenes Logo vollständig, unverändert und prominent zeigen.
- Das Original mit seinem eingebrannten dunklen Hintergrund auf einem passenden dunklen Splash-Hintergrund verwenden.
- Kurzer Markenauftritt; kein dauerhaftes Navigationslayout.

### Home
- Nicos aktuelle Entwicklungsstufe ist der emotionale Mittelpunkt.
- Eine klar dominante Hauptaktion.
- Lernfortschritt und weitere Bereiche sind sichtbar, aber nachgeordnet.
- Genügend Ruhe und freie Fläche.

### Lernen
- Lerninhalt hat immer Vorrang vor Dekoration.
- Große, helle Aufgabenfläche und gut unterscheidbare Zahlen.
- Klare Antwortmöglichkeiten und unmittelbare, verständliche Rückmeldung.
- Nico bleibt Begleiter, ohne die Aufgabe zu überlagern.
- Keine ablenkenden Neon-Effekte während des Denkens.

### Feedback und Belohnung
- Richtige Antworten fühlen sich warm und positiv an.
- Falsche Antworten bleiben humorvoll und nicht beschämend.
- Animationen unterstützen die Rückmeldung und blockieren den Lernfluss nicht.

### Terrarium
- Darf die reichhaltigste und atmosphärischste Ansicht sein.
- Nico bleibt Mittelpunkt.
- Dekoration und Platzierung müssen bedienbar bleiben.

### Shop
- Gegenstände klar und hochwertig präsentieren.
- Bild, Name, Preis, Kaufstatus und Kaufaktion bilden eine eindeutige Hierarchie.
- Kartenraster, Abstände, Bildgrößen und Preis-Buttons folgen einem gemeinsamen System.
- Bestehende Kauf- und Terrarium-Mechanik bleibt unverändert.

### Elternbereich
- Gleiche Markenwelt, aber ruhiger und sachlicher.
- Informationshierarchie, Lesbarkeit und Bedienbarkeit vor Spielatmosphäre.
- Keine unnötigen Glow- oder Partikeleffekte.

### Dialoge
- Einheitliche Dialogflächen, Konturen, Rundungen, Schatten, Typografie und Button-Hierarchie.
- Fokus auf eine klare Hauptaktion; sekundäre Aktionen sind sichtbar, aber zurückhaltend.

## 6. Typografie (freigegeben)

| Verwendung | Schrift | Schnitt |
|---|---|---|
| Aufgaben, Zahlen und Fließtext | **Atkinson Hyperlegible Next** | Regular 400, Bold 700 |
| Überschriften und kurze Belohnungstitel | **Nunito** | ExtraBold 800 |

Beide Schriften sind freigegeben und lokal als WOFF2 unter `public/fonts/` eingebunden. Atkinson Hyperlegible Next wird in den Schnitten 400 und 700 jeweils für Latin und Latin Extended ausgeliefert; Nunito als variable WOFF2-Datei für Latin und Latin Extended. Die zugehörigen OFL-Lizenzdateien liegen ebenfalls dort. Die Browserprüfung der konkreten Glyphendarstellung und Ziffern bleibt als manuelle Qualitätssicherung offen.

- Fonts lokal als WOFF2 ausliefern; keine externen Font-Requests.
- SIL Open Font License (OFL) und zugehörige Lizenzdateien im Repository mitführen.
- Vor Einbindung Umlaute (ÄÖÜäöü) und ß in den konkreten Fontdateien prüfen.
- Ziffern in der tatsächlichen Aufgabenansicht kontrollieren, insbesondere 1, 4, 6, 7 und 9.
- Dateigröße und geeignete Variable-/Static-Font-Auslieferung bei der Implementierung berücksichtigen.
- Offizielle Atkinson-Quelle: [Atkinson Hyperlegible Next – Projekt-README](https://github.com/googlefonts/atkinson-hyperlegible-next/blob/main/README.md).

## 7. Layout und Komponenten

### Implementierte CSS-Grundtokens

`src/index.css` enthält das semantische Token-Grundgerüst für die freigegebene Farbpalette, Inhalts- und Spielweltflächen, Textkontraste, Schatten, Rundungen, Abstände sowie getrennte Schriftrollen für Fließtext und Überschriften. Ergänzend sind typografische Größenrollen für Display-Titel, Seitentitel, Abschnittstitel, Aufgaben, Fließtext und unterstützende Texte definiert und auf zentrale UI-Elemente angewendet. Die lokalen WOFF2-Dateien werden über `@font-face` geladen; Latin und Latin Extended sind getrennt eingebunden. Bestehende Legacy-Variablen bleiben als bewusste Kompatibilitätsschicht erhalten und verweisen zentral auf die freigegebenen semantischen Tokens. So können vorhandene Komponenten schrittweise konsolidiert werden, ohne ihre Klassennamen oder Verhaltenslogik unnötig umzubauen. Die visuelle Prüfung der Glyphen im echten Browser bleibt ein eigener offener Check und ist Teil der manuellen Qualitätssicherung.

- Mobile-first, Smartphone im Hochformat als primäre Referenz.
- Tablet und Desktop bleiben responsiv nutzbar.
- Einheitliche Abstände, Kartenraster, Rundungen, Konturen, Schatten und Button-Höhen.
- Große Touch-Ziele und klare Abstände.
- Pro Ansicht eine dominante Hauptaktion.
- Einheitliche Zustände für Default, Pressed, Disabled, Focus und – wo passend – Hover.
- Eine klare Hierarchie aus Hintergrund, Inhaltsfläche und Aktion.
- Wiederverwendbare Tokens und Komponenten statt screen-spezifischer Einzelwerte.

## 8. Bewegung

- Kurze, sinnvolle Übergänge und Charakterreaktionen.
- Glow und Partikel nur für Start, Wachstum, Freischaltungen und besondere Erfolge.
- Animationen sind nicht blockierend und berücksichtigen Reduced Motion, wo technisch sinnvoll.
- Keine dauerhafte Bewegung, die beim Rechnen ablenkt.

## 9. Asset-Erstellung und Implementierung

### Produktionsablauf

- ChatGPT übernimmt Art Direction, Bildkonzepte und die Erstellung der vereinbarten Bildassets.
- Assets werden einzeln und gezielt für konkrete UI-Einsatzzwecke erstellt – nicht als fertige Screenshots oder in Bilder eingebrannte UI.
- Vor größeren Asset-Serien wird ein kleines Stil-Referenzpaket erstellt und visuell freigegeben.
- Claude Code übernimmt die technische Ablage, Einbindung, responsive Darstellung und Optimierung im React-Projekt.
- Die finale Wirkung wird in der echten App geprüft und bei Bedarf iteriert.

### Asset-Gruppen

- **Charaktere:** Nico in fünf Entwicklungsstufen, benötigte Posen und freigegebene Ausdrucksvarianten.
- **Umgebungen:** Terrarium sowie passende Szenen und Hintergründe für Home und weitere Bereiche.
- **Spielobjekte:** Pflanzen, Äste, Steine, Kristalle, Dekoration und Futter.
- **Belohnungen und Effekte:** Münzen, Pokale/Orden, Relikt-Freischaltungen, Partikel und Glow-Elemente. Das Schuppenband ist eine Schwierigkeitsanzeige für Aufgaben und keine Währung oder Sammelbelohnung (siehe `REWARD_SYSTEM.md`).

### Technische Regeln

- Original-Logo unter `public/images/logo.webp` nicht überschreiben.
- Transparente Logo-Ableitung ist zurückgestellt; keine unsaubere automatische Freistellung verwenden.
- Illustrationen einzeln exportieren und versionieren.
- Hintergründe, Charaktere, UI und Effekte getrennt halten.
- Einheitliche Lichtquelle, Materialqualität, Perspektive und Charakterproportionen beachten.
- Texte, Zahlen, Buttons und andere interaktive UI bleiben echte responsive React-/CSS-Komponenten.
- Bestehende Komponenten zuerst prüfen und wiederverwenden.
- Lernlogik, Datenmodelle, Speicherung, Navigation und Shop-Mechanik bei visueller Arbeit nicht verändern.

## 10. Qualitätskriterien

Ein Screen ist visuell abgenommen, wenn:
- er Farbwelt, Typografie und Komponentenregeln konsistent nutzt;
- die wichtigste Aktion sofort erkennbar ist;
- Texte und mathematische Inhalte sehr gut lesbar sind;
- Touch-Bedienung im Smartphone-Hochformat funktioniert;
- Tablet/Desktop sinnvoll responsiv bleiben;
- Animationen nicht stören;
- vorhandene Funktionen unverändert arbeiten;
- keine interaktiven Elemente in Bildassets eingebrannt sind;
- der Screen in relevanten Viewports praktisch geprüft wurde.

## 11. Bewusste Nicht-Ziele

- Keine vollständige Neuentwicklung der App-Architektur.
- Keine Ersetzung echter UI durch gerenderte Screenshots.
- Keine neuen Spielmechaniken als Voraussetzung für den visuellen Relaunch.
- Keine Veränderung der Lern-, Belohnungs- oder Kauf-Logik im Rahmen visueller Aufgaben.
- Nicht jede Ansicht wird dunkel, neonfarben oder maximal dekorativ.
