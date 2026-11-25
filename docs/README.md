# Dokumentation – Einstieg und Zuständigkeiten

Diese Seite ist der Einstieg in alle Projektdokumente. Sie sagt, **wo eine Information gepflegt wird**. Inhalte sollen nicht parallel in mehreren Dateien neu formuliert werden.

## Wo finde ich was?

| Thema | Maßgebliche Datei | Zweck |
|---|---|---|
| Produkt- und Belohnungsregeln | [REWARD_SYSTEM.md](./REWARD_SYSTEM.md) | Verbindliche Spielregeln für Futter, Wachstum, Sterne, Münzen, Pokale, Relikte, Meilensteine, Album und Terrarium |
| Testbare Anforderungen | [requirements.md](./specs/2026-11-22-feedback-runde-1/requirements.md) | Prüffähige Muss-Anforderungen; darf Produktregeln nicht neu interpretieren |
| Screen- und Interaktionsverhalten | [design.md](./specs/2026-11-22-feedback-runde-1/design.md) | UX, Ansichten und Zustände; keine zweite Quelle für Belohnungslogik |
| Feedback-Runde 1 | [requirements.md](./specs/2026-11-22-feedback-runde-1/requirements.md), [design.md](./specs/2026-11-22-feedback-runde-1/design.md), [tasks.md](./specs/2026-11-22-feedback-runde-1/tasks.md) | Anforderungen, UX-Vorgaben und historischer Aufgabenplan mit aktuellem Statusüberblick |
| Visuelles Grundsystem | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Farben, Typografie, Formen, Komponenten und allgemeine Art Direction |
| Langfristige Fachwelten | [VISUELLES_WELTENKONZEPT.md](./VISUELLES_WELTENKONZEPT.md) | Leitidee für eigenständige Tier- und Themenwelten je Schulfach |
| Produktvision | [product-vision.md](./product-vision.md) | Langfristige Produktidee und fachübergreifende Architekturleitplanken |
| Mathe Klasse 2 und Lernfeld Geometrie (Entwurf) | [MATHE_KLASSE2_THEMEN_UND_GEOMETRIE_IDEEN.md](./MATHE_KLASSE2_THEMEN_UND_GEOMETRIE_IDEEN.md) | Lehrplan-Themenliste Stufe B und gemeinsames Architektur- und Umsetzungskonzept für das Lernfeld D; Entwurf, noch nicht freigegeben |
| Phasen und nächste Schritte | [ROADMAP_DESIGN.md](./ROADMAP_DESIGN.md) | Phasenstatus und Prioritäten |
| Implementierte Funktionen | [../FEATURES.md](../FEATURES.md) | Kompakte Bestandsübersicht; keine neue Produktregel |
| Zusammenarbeit | [AI_COLLABORATION_SPEC.md](./AI_COLLABORATION_SPEC.md) | Rollen, Arbeitsablauf und Konfliktlösung |
| Archiv (obsolet) | [archive/PHASE0_INVENTAR.md](./archive/PHASE0_INVENTAR.md) | Obsoleter Snapshot von Phase 0; keine Vorgabe und keine Quelle für den aktuellen Stand |

## Phase 2 – Nico und Assets

Die folgenden vier Dateien sind die einzigen primären Phase-2-Dokumente und beschreiben die aktuelle Schlangenwelt:

| Datei | Zuständigkeit |
|---|---|
| [PHASE2_ASSETPLAN.md](./PHASE2_ASSETPLAN.md) | Produktionsumfang, Reihenfolge und Prioritäten |
| [PHASE2_ASSETKATALOG.md](./PHASE2_ASSETKATALOG.md) | Vorhandene Assets, Dateipfade und Status |
| [PHASE2_NICO_REFERENZ.md](./PHASE2_NICO_REFERENZ.md) | Kanonische Identität und Proportionen von Nico |
| [PHASE2_NICO_EMOTIONSMATRIX.md](./PHASE2_NICO_EMOTIONSMATRIX.md) | Emotionszustände und ihre Übersetzung über Entwicklungsstufen |

Die früher getrennten Bestandsanalysen, Bildvergleiche, Konzeptnotizen und das chronologische Arbeitsprotokoll wurden in diese vier Primärdokumente überführt. Ihre redundanten Einzeldateien werden aus der aktiven Dokumentation entfernt; die Git-Historie bleibt erhalten. Keine relevante Asset-Referenz oder bestätigte Gestaltungsentscheidung geht dadurch verloren.

## Verbindliche Pflege-Regeln

1. Eine Regel hat genau eine maßgebliche Quelle. Andere Dokumente verlinken darauf.
2. Produktregeln stehen in `REWARD_SYSTEM.md`; `FEATURES.md` beschreibt nur den Umsetzungsstatus.
3. UX-Dokumente beschreiben Darstellung und Interaktion, nicht abweichende Spielregeln.
4. Die Implementierung ist der Beleg für den aktuellen Ist-Zustand. Bei einer Abweichung von einer Produktregel wird sie sichtbar gemacht, nicht stillschweigend umgedeutet.
5. Ausdrückliche aktuelle Entscheidungen des Projektinhabers haben Vorrang. Bereits bestätigte Implementierungen werden in der Produktquelle dokumentiert.
6. Historische Inventare und abgeschlossene Arbeitspläne werden als historisch gekennzeichnet und nicht als aktuelle Arbeitsanweisung verwendet.
7. Statusbegriffe sind eindeutig: **Entworfen**, **Implementiert**, **Verifiziert**, **Offen** oder **Blockiert**.

## Aufräumgang – iterativer Stand

- [x] Tagesmitbringsel als gewollte Regel dokumentiert.
- [x] Denkimpuls auf Futterminderung statt Münzabzug umgestellt (Code, Tests und Doku, 25.11.2026).
- [x] Widersprüchliche Aussagen in Belohnungsregeln, Funktionsübersicht und Feedback-Anforderungen korrigiert.
- [x] Veralteten README-Verweis und fest eingetragene Testanzahl entfernt.
- [x] Einstieg und Zuständigkeiten dieser Dokumentation angelegt.
- [x] Alle aktiven Dokumente auf widersprüchliche, überholte oder doppelte Regeln geprüft; historische Ausgangsbefunde und Aufgabenpläne eindeutig gekennzeichnet.
- [x] Phase-2-Dokumente auf vier primäre Quellen konsolidieren; relevante Referenzen und Entscheidungen übernommen, Git-Historie bleibt erhalten.
- [x] Aufgabenlisten und Roadmap mit tatsächlichem Implementierungsstand abgeglichen; manuelle Prüfungen bleiben separat offen.
- [x] Alle internen Markdown-Links prüfen und tote Verweise entfernen (keine defekten Links gefunden).
- [x] Abschließenden Dokumentations-Review und CI-Prüfung durchführen (Tests, TypeScript-Prüfung und Produktionsbuild erfolgreich, GitHub Actions Lauf 146; Testanzahl bewusst nicht festgeschrieben).
- [x] Abweichungsregel vereinheitlicht: melden, Projektinhaber entscheidet, unterlegene Seite wird angeglichen (25.11.2026).
- [x] Farbpalette vereinheitlicht: `DESIGN_SYSTEM.md` ist die einzige Markenpalette; Schwierigkeitsfarben als eigene Tokens (25.11.2026).
- [x] Statusbegriffe in `FEATURES.md` und Roadmap auf das Vokabular aus Regel 7 umgestellt; Begriffe Schwierigkeit, Lernstand, Kompetenzstern und Entwicklungsstufe in `REWARD_SYSTEM.md` definiert (25.11.2026).
- [x] `PHASE0_INVENTAR.md` als obsolet gekennzeichnet und nach `docs/archive/` verschoben; Verweise angepasst (25.11.2026).

## Technische Quellen

Für konkrete Spielwerte und Laufzeitverhalten sind insbesondere `src/logic/config.ts`, `src/logic/game.ts`, `src/logic/kompetenz.ts` und die zugehörigen Tests relevant. Die Dokumentation beschreibt die gewollte Regel und den geprüften Stand; Änderungen an der Logik müssen beide Seiten konsistent halten.
