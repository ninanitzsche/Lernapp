# Home-Interview – Umsetzungs- und Selbstprüfcheckliste

> Branch: `design/phase2-visual-foundation` (niemals `main`)
> Quelle: Home-Interview und bestätigte Entscheidungen vom 26.11.2026; siehe `HOME_SCREEN_CONCEPT.md`.
> Regel: Ein Punkt wird erst auf erledigt gesetzt, wenn Code/Asset vorhanden und der jeweilige Nachweis erbracht ist. Ein grüner Build ersetzt keine visuelle Prüfung.

## 1. Bildwelt und Produktionsassets
- [x] Generierten, detailreichen 3D-Wald als echten Home-Hintergrund integrieren; zurückgewiesenes SVG nicht mehr als Hauptmotiv verwenden.
- [ ] Bildausschnitt für Smartphone, Tablet und Desktop festlegen; Motiv darf nicht unvorteilhaft abgeschnitten werden.
- [ ] Nico bleibt ein separates, transparentes Charakterasset und wird passend zur Laufzeit-Entwicklungsstufe geladen.
- [ ] Nicos Habitat/Terrarium bleibt als geschützter Lebensraum erkennbar; er darf nicht wie eine losgelöste Figur über dem Bild schweben.
- [ ] Plattform, Wurzeln, Höhlen, Äste, Farne, Moose, Pilze, Ranken, Kristalle, Wasser und natürliche Verstecke bilden eine schlangenspezifische Welt.
- [ ] Shop-Bestand und bestehende 44 Shop-Gegenstände wiederverwenden; keine unnötige Neuproduktion vorhandener Motive.
- [ ] Lernschilder und sekundäre Weltobjekte als wiederverwendbare Einzelassets führen; keine fertigen Screenshots mit eingebrannter UI.
- [ ] Dateinamen, Formate, Transparenz, Zuschnitt, Abmessungen, Dateigröße und Asset-Katalog pflegen.

## 2. Home-Hierarchie
- [ ] Nico ist groß und zentral der emotionale Mittelpunkt.
- [ ] Nico ruht neugierig und ruhig auf einer natürlichen, moosbewachsenen Plattform.
- [x] Der echte Button „Runde starten“ sitzt unmittelbar unter der Plattform.
 - [x] Bei pausierter Runde bleibt der vorhandene dynamische Fortsetzen-Zustand erhalten.
- [ ] Gemütlicher, heller Heimatbereich im Vordergrund; geheimnisvolle Abenteuerwelt öffnet sich dahinter.
- [ ] Mittlere Naturdichte mit genügend ruhigen Flächen für lesbare UI.
 - [x] Begrüßung „Bei {Kindername}“ / persönliche Ansprache bleibt erhalten.
- [ ] Keine eingebrannten Texte, Sterne, Buttons oder Zustände im Hintergrundbild.

## 3. Lernpfad und Kompetenz
- [ ] Home zeigt nur die kleine, individuell relevante Auswahl aktuell bearbeiteter/nächster Themen; vollständige Übersicht über „Alle Themen“.
- [ ] Drei bis fünf Schilder gleichzeitig in kleinen Gruppen entlang eines Weges.
- [ ] Lernschilder sind hochwertige Holzobjekte mit magischen Details; Titel bleiben dynamischer UI-Text.
 - [x] Genau fünf Kompetenzsterne je Lernfeld, horizontal angeordnet.
 - [x] Erreichte Sterne gold, nicht erreichte als dezente Umrisse.
 - [x] Reihenfolge nach individueller Lernpriorität: Bereiche mit geringerem Kompetenzstand zuerst.
- [ ] Sterne messen nachgewiesene Kompetenz, nicht Anzahl der Übungsrunden.
- [ ] Keine globale Home-Fortschrittsanzeige.
 - [x] Tippen auf ein Schild startet unmittelbar die nächste passende Runde dieses Themas, ohne Vorschau.
- [ ] Gesperrte Themen werden nicht als graue Vorschau gezeigt. Solange das Datenmodell keine Freischaltung je Thema enthält, keine Sperrung erfinden.

## 4. Nico-Verhalten
- [ ] Dieselbe Nico-Identität in allen fünf Entwicklungsstufen (Baby, Kleinkind, Kind, Teenager, Erwachsen/legendär).
- [ ] Vorhandene kanonische Charakterdateien wiederverwenden; Logo bleibt unverändert.
- [ ] Ruhige Grundpose; nur gelegentliche subtile Bewegung/Reaktion.
- [ ] Kontextbezogene Ansprache, nicht permanente Sprechblasen.
- [ ] Futter/Wachstum bleibt getrennt von Kompetenzsternen.
- [ ] Emotionsmatrix und bestehende Laufzeit-Zustände abgleichen; keine neue Emotion ohne dokumentierten Bedarf.

## 5. Weltzugänge und Navigation
 - [x] „Alle Themen“ als gut erkennbarer Wegweiser/Portal-Zugang.
 - [x] Album als Buch/Buchstation, öffnet das bestehende Album.
 - [x] Shop als Truhe/Marktstand; Münzestand bleibt lesbar und dynamisch.
 - [x] Relikte als Portal/Tür nur dann sichtbar, wenn `reliktBereichSichtbar(state)` wahr ist (nach Themenabschluss).
- [ ] Weltobjekte sind echte Buttons mit getrennten Interaktionsflächen; Dekoration sieht nicht fälschlich klickbar aus.
 - [x] „Wie geht das?“ und „Für Erwachsene“ bleiben als ruhige, gut lesbare Hilfszugänge sichtbar.
- [ ] Sicherungshinweis bleibt am Erwachsenen-Zugang erkennbar.

## 6. Responsive, Accessibility und Technik
 - [x] Smartphone-first; danach Tablet/Desktop mit derselben Informationsarchitektur.
- [ ] Kurze Smartphone-Displays ohne abgeschnittene Hauptaktion oder unzugängliche Navigation.
- [ ] 48-px-Touch-Targets einhalten; keine wichtige Aktion nur per Hover.
- [ ] Tastaturbedienung und sichtbare Fokuszustände prüfen.
 - [x] `prefers-reduced-motion` respektieren; Ansicht ohne Animation vollständig verständlich.
- [ ] Bestehende Lern-, Belohnungs-, Shop-, Terrarium- und Speicherlogik unverändert lassen.
- [ ] Bildgrößen und Ladeverhalten prüfen.
- [ ] Tests, TypeScript und Produktionsbuild erfolgreich.
- [ ] Sichtprüfung auf Smartphone, Tablet und Desktop tatsächlich durchführen.

## 7. Dokumentation und Branch-Schutz
- [ ] Asset-Katalog und Home-Konzept nur anhand realer Dateien/Implementierung aktualisieren.
- [ ] Statusbegriffe korrekt verwenden: Entworfen, Implementiert, Verifiziert, Offen, Blockiert.
- [ ] Ausschließlich auf `design/phase2-visual-foundation` arbeiten.
- [ ] `main` bleibt unangetastet.
- [ ] Preview-Deployment und Branch-Status prüfen; keine nicht erfolgte Sichtprüfung behaupten.

## Aktueller Befund am 26.11.2026
- **Bereits im Code vorhanden:** React-Home-Struktur, dynamisches Nico-Rendering, Start-/Fortsetzen-Aktion, vier Lernfeld-Schilder mit je fünf Kompetenzsternen, Themenübersicht, Album, Shop, bedingter Relikte-Zugang, Hilfslinks.
- **Hintergrund integriert:** generierter 3D-Wald als AVIF in `public/images/home/home-forest.avif`; CSS referenziert das neue Bild statt des SVG.
- **Noch nicht belegt:** visuelle QA über Smartphone/Tablet/Desktop; finale Einzelassets für Lernschilder und sekundäre Weltobjekte.
- **Zurückgewiesen:** bisheriges `public/images/home/home-world.svg` als finale Hintergrundgrafik.
- **Integriert:** `public/images/home/home-forest.avif` (generierter 3D-Wald, AVIF, 512 px Breite; Hintergrundreferenz in `src/index.css`).
- **Integriert:** detailreiche 3D-Waldszene `public/images/home/home-forest.avif`, optimiert als AVIF für den Hintergrund. Das hochauflösende Original bleibt außerhalb des Repositories.
- **Wichtige Datenmodellgrenze:** pro Lernfeld existiert aktuell keine eigene Freischaltinformation; daher werden die vier definierten Themen nicht fälschlich als gesperrt markiert.