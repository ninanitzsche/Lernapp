# Dokumentation – Einstieg und Zuständigkeiten

Diese Seite ist der Einstieg in alle Projektdokumente. Sie sagt, **wo eine Information gepflegt wird**. Inhalte sollen nicht parallel in mehreren Dateien neu formuliert werden.

## Wo finde ich was?

| Thema | Maßgebliche Datei | Zweck |
|---|---|---|
| Produkt- und Belohnungsregeln | [REWARD_SYSTEM.md](./REWARD_SYSTEM.md) | Verbindliche Spielregeln für Futter, Wachstum, Sterne, Münzen, Pokale, Relikte, Meilensteine, Album und Terrarium |
| Testbare Anforderungen | [requirements.md](./specs/2026-11-22-feedback-runde-1/requirements.md) | Prüffähige Muss-Anforderungen; darf Produktregeln nicht neu interpretieren |
| Screen- und Interaktionsverhalten | [design.md](./specs/2026-11-22-feedback-runde-1/design.md) | UX, Ansichten und Zustände; keine zweite Quelle für Belohnungslogik |
| Umsetzungsaufgaben aus Feedback-Runde 1 | [tasks.md](./specs/2026-11-22-feedback-runde-1/tasks.md) | Ursprüngliche Aufgabenliste; Status muss mit dem aktuellen Code abgeglichen werden |
| Visuelles Grundsystem | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Farben, Typografie, Formen, Komponenten und allgemeine Art Direction |
| Langfristige Fachwelten | [VISUELLES_WELTENKONZEPT.md](./VISUELLES_WELTENKONZEPT.md) | Leitidee für eigenständige Tier- und Themenwelten je Schulfach |
| Produktvision | [product-vision.md](./product-vision.md) | Langfristige Produktidee und fachübergreifende Architekturleitplanken |
| Phasen und nächste Schritte | [ROADMAP_DESIGN.md](./ROADMAP_DESIGN.md) | Phasenstatus und Prioritäten |
| Implementierte Funktionen | [../FEATURES.md](../FEATURES.md) | Kompakte Bestandsübersicht; keine neue Produktregel |
| Zusammenarbeit | [AI_COLLABORATION_SPEC.md](./AI_COLLABORATION_SPEC.md) | Rollen, Arbeitsablauf und Konfliktlösung |
| Historischer Ausgangsstand | [PHASE0_INVENTAR.md](./PHASE0_INVENTAR.md) | Archivierter Snapshot von Phase 0; keine aktuelle Vorgabe |

## Phase 2 – Nico und Assets

Die folgenden Dateien gehören zusammen und beschreiben die aktuelle Schlangenwelt:

| Datei | Zuständigkeit |
|---|---|
| [PHASE2_ASSETPLAN.md](./PHASE2_ASSETPLAN.md) | Produktionsumfang, Reihenfolge und Prioritäten |
| [PHASE2_ASSETKATALOG.md](./PHASE2_ASSETKATALOG.md) | Vorhandene Assets, Dateipfade und Status |
| [PHASE2_NICO_REFERENZ.md](./PHASE2_NICO_REFERENZ.md) | Kanonische Identität und Proportionen von Nico |
| [PHASE2_NICO_EMOTIONSMATRIX.md](./PHASE2_NICO_EMOTIONSMATRIX.md) | Emotionszustände und ihre Übersetzung über Entwicklungsstufen |
| [PHASE2_BESTANDSANALYSE.md](./PHASE2_BESTANDSANALYSE.md) | Analyse des vorhandenen Asset-Bestands |
| [PHASE2_NICO_BILDVERGLEICH.md](./PHASE2_NICO_BILDVERGLEICH.md) | Visueller Vergleich der fünf Entwicklungsstufen |
| [PHASE2_REFERENZENTWURF_A.md](./PHASE2_REFERENZENTWURF_A.md) | Früher Stil-Referenzentwurf |
| [PHASE2_ARBEITSPROTOKOLL.md](./PHASE2_ARBEITSPROTOKOLL.md) | Chronologisches Arbeitsprotokoll |

Die letzten vier Dokumente sind Prüf- bzw. Verlaufsmaterial. Sie sollen nicht dauerhaft parallel dieselben Entscheidungen wiederholen. Im laufenden Aufräumgang werden ihre bleibenden Erkenntnisse in die vier primären Phase-2-Dokumente übernommen; danach werden redundante Texte zusammengeführt oder als klar gekennzeichnete Historie abgelegt. Keine freigegebene Gestaltungsentscheidung und keine Asset-Referenz geht dabei verloren.

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
- [x] Denkimpuls-Münzabzug anhand von `src/logic/game.ts` geklärt und dokumentiert.
- [x] Widersprüchliche Aussagen im zentralen Belohnungsdokument und im Lernfelder-/Reliktplan korrigiert.
- [x] Veralteten README-Verweis und fest eingetragene Testanzahl entfernt.
- [x] Einstieg und Zuständigkeiten dieser Dokumentation angelegt.
- [ ] Alle Dokumente auf widersprüchliche, überholte oder doppelte Regeln prüfen.
- [ ] Phase-2-Dokumente auf vier primäre Quellen konsolidieren, ohne Referenzen oder Entscheidungen zu verlieren.
- [ ] Aufgabenlisten und Roadmap mit tatsächlichem Implementierungsstand abgleichen.
- [ ] Alle internen Markdown-Links prüfen und tote Verweise entfernen.
- [ ] Abschließenden Dokumentations-Review und CI-Prüfung durchführen.

## Technische Quellen

Für konkrete Spielwerte und Laufzeitverhalten sind insbesondere `src/logic/config.ts`, `src/logic/game.ts`, `src/logic/kompetenz.ts` und die zugehörigen Tests relevant. Die Dokumentation beschreibt die gewollte Regel und den geprüften Stand; Änderungen an der Logik müssen beide Seiten konsistent halten.
