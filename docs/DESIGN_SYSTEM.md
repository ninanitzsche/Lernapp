# Design System – Luminous Fantasy Adventure

> **Produkt:** Nico's Snake App  
> **Designrichtung:** Luminous Fantasy Adventure  
> **Status:**
> - Designsystem: dokumentiert (dieses Dokument).
> - Umsetzung: erste Umsetzung am Splash / Willkommensbildschirm vorhanden (Commit `c8d10e2`, Änderungen an `src/App.tsx` und `src/index.css`). Ob diese Umsetzung dem Designsystem vollständig entspricht, ist nicht abgenommen.
> - Übrige Screens, Tokens, Schrift und Assets: vollständige Umsetzung noch offen.
> **Zugehörige Roadmap:** [ROADMAP_DESIGN.md](./ROADMAP_DESIGN.md)

Dieses Dokument ist die gemeinsame Referenz für UI, Illustrationen, Animationen und neue Screens.

## 1. Leitidee und Markengeschichte

Nicos Schlange besitzt zwei bewusst unterschiedliche Erscheinungsformen:

- **Am Anfang:** ein niedlicher, neugieriger, freundlicher Begleiter. Weiche Formen, große ausdrucksstarke Augen und eine einladende Ausstrahlung.
- **Am Ende:** eine mächtige, gefährlich wirkende, giftgrün leuchtende Schlange – die Vision aus dem bestehenden Logo.

Die erwachsene Schlange ist nicht böse. Sie ist stark, geheimnisvoll und auf der Seite des Kindes. Die Entwicklung vom süßen Haustier zur Legende ist ein zentraler Teil der Produktgeschichte.

**Markenversprechen:** Das Kind lernt, Nico wächst – und die kleine Schlange wird zur Legende.

Das vorhandene Logo soll in seiner Gestaltung exakt erhalten bleiben. Es ist das Key Visual und die Vision der höchsten Entwicklungsstufe, nicht eine Vorlage, die in jeder Ansicht wiederholt werden muss.

## 2. Stildefinition

**Luminous Fantasy Adventure** – eine Kombination aus:
- Stylized 3D Fantasy Game Art
- Bioluminescent / Toxic-Green Fantasy
- Premium Mobile Game UI
- Stylized 3D Character Design
- Cozy Adventure

Ziel ist die Anmutung eines hochwertigen, liebevoll gestalteten Adventure-Games: räumliche Illustrationen, plastische Figuren, leuchtende magische Details und eine klare, kindgerechte Bedienoberfläche.

Keine flache Clipart-Optik und kein beliebiger Standard-Dashboard-Look.

## 3. Farbwelt

| Rolle | Farbe | Verwendung |
|---|---|---|
| Toxic Lime | #9DFF00 | Glow, Fortschritt, besondere Akzente |
| Emerald Green | #00C853 | Primäre Markenfarbe, positive Aktionen |
| Deep Forest | #064D30 | Spielwelt, dunkle Panels |
| Warm Gold | #FFD329 | Sterne, Belohnungen, Hauptaktionen |
| Amber Orange | #FF9D16 | Sekundäre Belohnungsakzente |
| Midnight Blue | #071D35 | Tiefe, Konturen, dunkle Kontraste |
| Warm Cream | #FFF4DE | Aufgabenflächen und gut lesbare Inhalte |

### Farbregeln
- Neon-Glow ist ein Akzent für Marke, Magie und besondere Momente.
- Aufgaben und Zahlen bleiben auf hellen, kontrastreichen Flächen.
- Gold signalisiert Belohnung und wichtige Aktionen.
- Dunkle Waldtöne bilden die atmosphärische Bühne.
- Nicht jede Komponente erhält einen Glow, Verlauf oder starken Schatten.

## 4. Visuelle Ebenen

Die Oberfläche wird aus drei getrennt pflegbaren Ebenen aufgebaut.

### Ebene A – Spielwelt und Hintergründe
Hochwertige, stilisierte 3D-Umgebungen, zum Beispiel:
- Terrarium mit Pflanzen, Moos, Wasserfall, Kristallen und warmem Laternenlicht
- Start-/Home-Umgebung
- Ruhigere Lernumgebung für Matheaufgaben

Hintergründe liefern Atmosphäre und Tiefe, dürfen aber Inhalte und Bedienelemente nicht überlagern.

### Ebene B – Charaktere und Assets
Die Schlange wird als eigenständiges Asset geführt. Geplante Entwicklungsstufen:
1. Baby
2. Kleinkind
3. Kind
4. Teenager
5. Erwachsen / legendär

Alle Stufen müssen klar als dieselbe Figur erkennbar sein. Silhouette, Gesichtsmerkmale, Augen und charakteristische Farbgebung bleiben verwandt; Details, Haltung und Leuchtkraft entwickeln sich schrittweise.

Weitere separate Assets: Pflanzen, Kristalle, Steine, Dekoration, Partikel und optionale Glow-Effekte.

### Ebene C – UI mit React und CSS
Die funktionalen Oberflächen bleiben echte, responsive UI-Komponenten. Illustrationen werden nicht als vollständige Screenshots in die App eingebaut.

UI-Bausteine:
- Runde, klar erkennbare Buttons
- Goldene Hauptaktionen
- Dunkelgrüne Sekundäraktionen
- Helle cremefarbene Aufgaben- und Inhaltskarten
- Limettengrüne Fortschrittsanzeigen
- Goldene Sterne und Belohnungsmarker
- Weiche räumliche Schatten und sparsame Lichtkanten

## 5. Screen-Richtung

### Start / Splash
- Vollständiges vorhandenes Logo prominent und unverändert zeigen.
- Dunkler, atmosphärischer Hintergrund mit giftgrünem Licht.
- Dramatischer, kurzer Markenauftritt; optional dezentes Augen-/Glow-Aufleuchten.
- Danach Übergang in die eigentliche App.
- Der Splash ist ein Markenmoment, kein dauerhaftes Navigationslayout.

### Home / Begleiter
- Die aktuelle Entwicklungsstufe der niedlichen Schlange steht im Mittelpunkt.
- Eine eindeutige primäre Aktion (z. B. „Los geht's“).
- Lernfortschritt und Terrarium sind klar erkennbare sekundäre Ziele.
- Genügend Ruhe und freie Fläche; keine Ansammlung gleich gewichteter Kacheln.

### Matheaufgaben
- Lerninhalt hat immer Vorrang vor Dekoration.
- Große, helle Aufgabenfläche und gut lesbare Zahlen.
- Klare Eingabemöglichkeiten und eindeutige Rückmeldungen.
- Schlange und Fantasy-Umgebung bleiben als dezente Begleiter sichtbar.
- Keine ablenkenden Neon-Effekte während des Denkens.

### Feedback und Belohnung
- Richtige Antworten erhalten ein warmes, positives Erfolgserlebnis.
- Falsche Antworten bleiben humorvoll, freundlich und nicht beschämend.
- Animationen unterstützen die Rückmeldung, blockieren aber nicht den Lernfluss.

### Terrarium
- Darf die visuell reichste und atmosphärischste Ansicht sein.
- Die Schlange bleibt der emotionale Mittelpunkt.
- Dekoration und Platzierung müssen trotz reichhaltiger Umgebung gut bedienbar bleiben.

### Shop
- Gegenstände hochwertig und klar erkennbar präsentieren.
- Preis, Kaufstatus und Kaufaktion eindeutig darstellen.
- Bestehende Shop- und Terrarium-Mechanik erhalten; die Überarbeitung ist zunächst visuell.

### Elternbereich
- Gleiche Markenwelt, aber deutlich ruhiger und sachlicher.
- Lesbarkeit, Informationshierarchie und Bedienbarkeit vor Spielatmosphäre.
- Keine unnötigen Glow- oder Partikeleffekte.

## 6. Typografie, Layout und Bewegung

### Typografie

**Entscheidungsvorschlag zur Freigabe (Empfehlung des Creative Directors, 2026-11-24, noch nicht implementiert):**
- Aufgaben, Zahlen und Fließtext: Atkinson Hyperlegible Next (2025), Regular 400 und Bold 700.
- Überschriften und kurze Belohnungstitel: Nunito, ExtraBold 800.
- Beide Schriften lokal ausliefern, keine externen Font-Requests. SIL-OFL-Lizenzdateien im Repository mitführen.
- Details und offene technische Prüfpunkte: [PHASE0_INVENTAR.md](./PHASE0_INVENTAR.md), Abschnitt 9.

Allgemeine Regeln:- Freundliche, gut lesbare Schrift mit klarer Unterscheidung von Überschrift, Fließtext und Zahlen.
- Zahlen und Aufgabeninhalte müssen auch auf Tablets aus normalem Betrachtungsabstand eindeutig erkennbar sein.
- Dekorative Display-Schrift nur für kurze Titel oder besondere Belohnungsmomente.
- Keine verspielte Schrift für längere Erklärungen oder mathematische Inhalte.

### Layout
- Mobile-first und tablet-tauglich.
- Große Touch-Ziele und klare Abstände.
- Pro Ansicht eine dominante Hauptaktion.
- Einheitliche Rundungen, Kartenabstände, Schatten und Button-Höhen.
- Responsive UI-Komponenten statt fest eingebrannter Texte in Bildassets.

### Bewegung
- Motion für kurze, sinnvolle Übergänge und Charakterreaktionen.
- Glow und Partikel für Start, Wachstum, Freischaltungen und besondere Erfolge.
- Animationen müssen kurz, unterbrechbar und nicht störend sein.
- Reduced-motion-Verhalten berücksichtigen, wo technisch sinnvoll.
- Keine dauerhafte Bewegung, die beim Rechnen ablenkt.

## 7. Asset- und Implementierungsregeln
- Illustrationen als einzelne Assets exportieren und versionieren.
- Transparente Hintergründe für Figuren und Dekoration verwenden, wo Komposition dies erfordert.
- Hintergründe, Charaktere, UI und Effekte getrennt halten.
- Keine vollständigen generierten App-Screens als UI-Hintergrund verwenden: Texte, Zahlen, Buttons und Zustände bleiben echte React-Komponenten.
- Einheitliche Lichtquelle, Materialqualität, Perspektive und Charakterproportionen über alle Assets hinweg.
- Vorhandene App-Mechanik, Datenmodelle und Lernlogik bei einer visuellen Überarbeitung nicht unbeabsichtigt verändern.
- Bestehende Komponenten zuerst inventarisieren und wiederverwenden; keine parallele zweite UI-Architektur aufbauen.

## 8. Master Art Direction Prompt

Premium stylized 3D fantasy adventure game art, high-end mobile game visual quality, beautifully detailed environments, expressive and lovable characters, rich emerald green color palette, bioluminescent toxic lime-green accents, magical glowing crystals, lush enchanted forest atmosphere, cinematic lighting, beautiful depth and ambient occlusion, polished materials, soft volumetric light, vibrant but carefully balanced colors, detailed textures, rounded friendly shapes, premium family-friendly game aesthetic.

Consistent visual identity across all assets. The snake character is the central hero and evolves from an adorable baby snake into a powerful, intimidating, glowing emerald serpent.

Dark emerald, vibrant lime, warm gold and midnight blue as the signature colors.

No flat vector art, no generic clipart, no cheap mobile game graphics.

Der Master-Prompt ist eine Stilbasis, kein Ersatz für konkrete Asset-Spezifikationen. Für jedes Asset werden Motiv, Perspektive, Pose, Hintergrund/Transparenz, Seitenverhältnis und Verwendung zusätzlich festgelegt.

## 9. Qualitätskriterien / Definition of Done
Ein Screen gilt erst dann als fertig, wenn:
- er zur definierten Farb- und Bildwelt passt;
- die Schlange in ihrer aktuellen Entwicklungsstufe konsistent dargestellt wird;
- die wichtigste Aktion sofort erkennbar ist;
- Texte und mathematische Inhalte sehr gut lesbar sind;
- Touch-Bedienung auf Smartphone und Tablet funktioniert;
- Animationen die Bedienung nicht verzögern;
- vorhandene Funktionen unverändert funktionieren;
- keine UI-Texte oder interaktiven Elemente in ein Hintergrundbild eingebrannt sind;
- der Screen in relevanten Viewport-Größen geprüft wurde.

## 10. Bewusste Nicht-Ziele
- Nicht jede Ansicht soll dunkel und neonfarben sein.
- Keine komplette Neuentwicklung der App-Architektur.
- Keine Ersetzung echter UI durch gerenderte Mockup-Bilder.
- Keine zusätzlichen Spielmechaniken als Voraussetzung für den visuellen Relaunch.
- Keine Veränderung der Lern- oder Belohnungslogik im Rahmen rein visueller Aufgaben, außer sie wird separat vereinbart.
