# Design System – Luminous Fantasy Adventure

> **Produkt:** Nico's Snake App  
> **Status:** Visuelle Richtung und Designentscheidungen freigegeben. Phase 1 (Designsystem und UI-Grundlagen) ist implementiert, automatisiert geprüft und vom Projektinhaber abgenommen (25.11.2026), mit bekannten Einschränkungen: Token-Benennung (vorerst akzeptiert) und Tablet/Desktop-Sichtprüfung (Phase 5), siehe Roadmap. Die vollständige Vereinheitlichung aller Screens gehört zu Phase 3.  
> **Arbeitsstand:** [ROADMAP_DESIGN.md](./ROADMAP_DESIGN.md) · **Archiv (obsolet):** [PHASE0_INVENTAR.md](./archive/PHASE0_INVENTAR.md)

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
| Task Light Lime | `#9bd93c` | Schuppenband: leicht (Schwierigkeit 1), Token `--color-task-light` |
| Task Medium Amber | `#ffb92e` | Schuppenband: mittel (Schwierigkeit 2), Token `--color-task-medium` |
| Task Difficult Violet | `#6b4bd1` | Schuppenband: knifflig (Schwierigkeit 3), Knobelrunde, Token `--color-task-difficult` |
| Task Difficult Violet auf dunklem Grund | `#b9a4ff` | Variante von knifflig für Deep-Forest-Flächen, Token `--color-task-difficult-on-dark`. `#6b4bd1` erreicht dort nur 1,68:1, die Variante 4,65:1. Auf Creme gilt `#6b4bd1` (5,42:1). |
| Midnight Blue | `#071D35` | Tiefe und dunkle Konturen |
| Warm Cream | `#FFF4DE` | Aufgaben, Dialoge und lesbare Inhaltsflächen |

### Farbregeln
- Dunkle Waldtöne bilden die atmosphärische Bühne, nicht eine undifferenzierte Vollbildfläche.
- Creme bündelt Inhalte und sorgt für Lesbarkeit.
- Gold kennzeichnet wichtige Aktionen und Belohnungen.
- Giftgrün bleibt ein gezielter Akzent für Fortschritt, Magie und besondere Momente.
- Die drei Task-Farben Lime, Amber und Lila sind semantische Schwierigkeitsfarben ausschließlich für das Schuppenband. Sie ersetzen weder die Markenpalette noch die Gold-/Münzfarbe. Die genaue Bedeutung steht in `REWARD_SYSTEM.md`.
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
- Grundkonzept: **Mischung aus gemütlichem Zuhause und großer Abenteuerwelt** (Entscheidung vom 26.11.2026).
- Die Startseite fühlt sich wie Nicos eigener, vertrauter Lebensraum an und öffnet sich zugleich sichtbar in eine fantastische Abenteuerwelt.
- Schlangenspezifische Umgebung: z. B. Wurzeln, Höhlen, Äste, Moos, Farne, Wasser und Kristalle. Keine generische Fantasy-Bühne mit bloßen Schlangen-Icons.
- Nicos aktuelle Entwicklungsstufe ist der emotionale Mittelpunkt.
- Eine klar dominante Hauptaktion zum Fortsetzen/Starten des Lernens.
- Lernfortschritt und weitere Bereiche sind sichtbar, aber nachgeordnet und als Elemente der Welt gestaltet.
- Genügend Ruhe und freie Fläche; die Spielwelt darf die Orientierung und Bedienbarkeit nicht überlagern.
- Räumlicher Aufbau: **Übergang zwischen Zuhause und Welt** (Auswahl 3, 26.11.2026): Im Vordergrund liegt Nicos geschützter, gemütlicher Platz; dahinter öffnet sich die größere Abenteuerlandschaft. Der Übergang soll visuell klar und einladend sein, nicht wie zwei getrennte Screens wirken.
- Nicos Position: **als kleiner Entdecker auf einer Wurzel oder einem Ast**, mit Blick in die sich öffnende Welt (Auswahl C, 26.11.2026). Seine Haltung soll Neugier und Aufbruch vermitteln; er bleibt dabei erkennbar im vertrauten Zuhause verankert.
- Größe und Präsenz Nicos auf Home: **groß und klarer Mittelpunkt** (Auswahl A, 26.11.2026). Nico soll emotional im Zentrum stehen; Lernschilder und weitere Elemente ordnen sich ihm visuell unter, ohne ihre Bedienbarkeit oder Lesbarkeit zu verlieren.
- Präsenz der Abenteuerwelt: **ausgewogen** (Auswahl B, 26.11.2026). Die Landschaft ist deutlich erkennbar und macht Lust aufs Entdecken, bleibt aber visuell hinter Nico und der zentralen Lernaktion.
- Darstellung der Hauptaktion „Runde starten“: **deutlich erkennbarer Button auf einer natürlichen Plattform vor Nico** (Auswahl C, 26.11.2026). Die Aktion verbindet die Spielwelt mit einer jederzeit verständlichen, gut bedienbaren Oberfläche.
- Weitere Bereiche (Themen, Album, Shop und Relikte): **Kombination aus wenigen Elementen in der Spielwelt und einer schmalen, klaren Navigation** (Auswahl C, 26.11.2026). Welt-Elemente dürfen Atmosphäre und Entdeckung unterstützen; die Navigation stellt sicher, dass alle Bereiche direkt auffindbar und bedienbar bleiben.
- Navigationsform: **schmale Leiste am unteren Bildschirmrand mit Icons und kurzen Beschriftungen** (Auswahl A, 26.11.2026). Die Beschriftungen unterstützen die Verständlichkeit für Kinder; die Leiste bleibt gegenüber der Hauptaktion visuell zurückhaltend.
- Nicos Verhalten auf Home: **ruhige Grundpose mit kleinen gelegentlichen Bewegungen und passenden Reaktionen auf Aktionen des Kindes** (Auswahl C, 26.11.2026). Nico wirkt lebendig und ansprechbar, ohne durch dauernde Animation vom Lernen abzulenken.
- Direkte Ansprache durch Nico: **gelegentlich und situationsbezogen** (Auswahl C, 26.11.2026), z. B. bei der Rückkehr, beim Beginn eines neuen Lernabschnitts oder nach einem besonderen Erfolg. Keine dauerhaften Begrüßungs- oder Motivationsmeldungen auf Home.
- Lernfortschritt auf Home wird **je Lernfeld getrennt** dargestellt, nicht als ein gemeinsamer Gesamtfortschritt. Bei den jeweiligen Themenfeldern (z. B. Zahlenstrahl, Geometrie) kann direkt unter dem Welt-Element bzw. Schild eine kompakte Anzeige der fünf Kompetenzsterne dieses Lernfelds stehen. So bleibt auf einen Blick erkennbar, woran das Kind bereits arbeitet und welches Können es dort nachgewiesen hat.
- Nicos Wachstum bleibt davon klar getrennt: Für gelöste Aufgaben erhält Nico Futter und wächst dadurch. Futter bzw. Nicos Entwicklungsstufe sind keine Anzeige des Kompetenzfortschritts eines einzelnen Lernfelds. Die verbindlichen Regeln zu Futter, Wachstum und Kompetenzsternen stehen in `REWARD_SYSTEM.md`.
- Die Home-Übersicht hält diese Anzeigen bewusst klein und übersichtlich. Keine zusätzliche globale Fortschrittsanzeige und kein einzelnes Welt-Element, das einen vermeintlichen Gesamtfortschritt aller Lernfelder darstellt.
- Darstellung der Lernfelder auf Home: **als Schilder entlang eines Weges** (Auswahl A, 26.11.2026), z. B. mit den Bezeichnungen „Zahlenstrahl“ oder „Geometrie“. Direkt unter dem jeweiligen Schild kann der zugehörige Kompetenzfortschritt mit bis zu fünf Sternen kompakt angezeigt werden. Die Schilder müssen auch bei später hinzukommenden Lernfeldern erweiterbar und gut lesbar bleiben.
- Umfang der Lernfeld-Schilder auf Home: **kleine Auswahl auf der Startseite plus eigener Zugang „Alle Themen“ zur vollständigen Übersicht** (Auswahl C, 26.11.2026). Home bleibt dadurch ruhig und übersichtlich; die vollständige Themenübersicht kann unabhängig davon wachsen.
- Anzahl der gleichzeitig sichtbaren Lernfeld-Schilder auf Home: **variabel drei bis fünf** (Festlegung 26.11.2026). Die konkrete Anzahl darf sich innerhalb dieses Rahmens nach Bildschirmgröße und individuellem Lernstand richten; die Startseite soll dabei übersichtlich bleiben.
- Technische Anordnung der Lernfeld-Schilder: **einfaches responsives Raster** (Auswahl A, 26.11.2026). Die Schilder werden in einem anpassungsfähigen Raster angeordnet, das bei schmalen Viewports passend umbrechen kann. Aufwendige räumliche Positionierungs- oder Scroll-Logik ist dafür nicht vorgesehen.
- Auswahl der auf Home sichtbaren Lernfelder: **Themen, an denen das Kind gerade arbeitet bzw. die als Nächstes anstehen** (Auswahl B, 26.11.2026). Die konkrete Priorisierungs- und Auswahlregel richtet sich nach dem vorhandenen Lernstand und wird nicht durch eine feste, für alle Kinder gleiche Themenliste ersetzt.
- Gestaltung der Lernfeld-Schilder: **Holzschilder mit magischen Details** (Auswahl C, 26.11.2026), z. B. leuchtende Symbole oder kleine Kristalle. Die Schilder gehören sichtbar zur natürlichen Umgebung und greifen zugleich die magische Bildsprache auf; Text und Kompetenzsterne müssen gut lesbar bleiben.
- Darstellung der fünf Kompetenzsterne: **verdiente Kompetenzsterne in Gold, noch offene Sterne als dezente Umrisse** (Auswahl C, 26.11.2026). Die Anzeige bleibt klein und auf jedem Lernfeld-Schild eindeutig dem jeweiligen Lernfeld zugeordnet.
- Interaktion mit einem Lernfeld-Schild: **Tippen startet direkt die nächste passende Lernrunde** (Auswahl A, 26.11.2026). Der Einstieg bleibt dadurch unmittelbar und ohne zusätzliche Vorschau oder Zwischenseite; die Auswahl der passenden Runde folgt dem individuellen Lernstand.
- Noch nicht freigeschaltete Lernfelder: **auf Home zunächst nicht anzeigen** (Auswahl C, 26.11.2026). Die Startseite zeigt nur aktuell relevante und verfügbare Lernfelder; es erscheinen dort keine ausgegrauten oder gesperrten Vorschau-Schilder.
- Die konkrete Komposition, Navigation und Asset-Liste werden im schrittweisen Home-Interview festgelegt.

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
