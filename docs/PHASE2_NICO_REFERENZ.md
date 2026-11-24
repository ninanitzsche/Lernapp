# Nico – kanonische Charakterreferenz

 > **Status:** Arbeitsgrundlage nach direktem Bildvergleich; finale Bildfreigabe weiterhin offen.
> **Bildvergleich:** [PHASE2_NICO_BILDVERGLEICH.md](./PHASE2_NICO_BILDVERGLEICH.md)
> **Gültig für:** Phase 2 · Luminous Fantasy Adventure
> **Verbindliche Leitdokumente:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) · [PHASE2_ASSETPLAN.md](./PHASE2_ASSETPLAN.md) · [PHASE2_BESTANDSANALYSE.md](./PHASE2_BESTANDSANALYSE.md)

## 1. Zweck und Grundsatz

Dieses Dokument legt fest, welche vorhandenen Nico-Dateien bis zur visuellen Freigabe als Arbeitsreferenz dienen und welche Lücken vor einer Asset-Serie zu schließen sind. Es führt keine neue Charakteridentität ein.

Nico muss in allen fünf Stufen als dieselbe Schlange erkennbar bleiben. Die Entwicklung erfolgt über Körperproportionen, Haltung, Gesichtsreife, Details und Lichtwirkung – nicht durch einen Wechsel von Art Style oder Spezies.

**Wichtig:** Das vorhandene Logo unter `public/images/logo.webp` ist das unveränderte Key Visual der erwachsenen/legendären Form. Es hat bei der Gestaltung der höchsten Stufe Vorrang vor dem derzeitigen App-Erwachsenenbild.

## 2. Kanonische Arbeitsreferenzen

Bis zur Freigabe gelten folgende Dateien als bevorzugte Bestandsreferenzen:

| Stufe | Kanonische Arbeitsreferenz | Status | Begründung / offene Prüfung |
|---|---|---|---|
| Baby | `public/images/snake/app/baby-standard.webp` | Beibehalten | Stimmiger Ausgangspunkt: kompakt, rund, neugierig und mit klarer Baby-Anmutung. |
| Kleinkind | `public/images/snake/app/smallChild-standard.webp` | Beibehalten | Verständliche Weiterentwicklung mit etwas längerem Hals und weniger übergroßem Kopf. |
| Kind | `public/images/snake/app/child-standard.webp` | Vorläufig beibehalten | Grundform passt; Augenfarbe und Gesichtsform im Übergang zu den jüngeren Stufen prüfen und gegebenenfalls angleichen. |
| Teenager | `public/images/snake/app/teen-standard.webp` | Vorläufig beibehalten | Schlankere, längliche Silhouette vermittelt Reife. Übergang zum Erwachsenen und die vier vorhandenen Zusatzvarianten visuell prüfen. |
| Erwachsen / legendär | `public/images/logo.webp` als Form- und Identitätsreferenz; `public/images/snake/app/adult-standard.webp` nur als Bestandsmaterial | Überarbeiten / abgleichen | Das App-Bild weicht in Kopf, Augen und Silhouette vom Logo ab. Es darf nicht ohne Abgleich als finale höchste Stufe festgeschrieben werden. |

Die Pfade sind Referenzen, keine Aufforderung, Dateien umzubenennen, zu verschieben oder zu löschen. Die historischen Quellenordner bleiben unangetastet.

## 3. Gemeinsame Identitätsmerkmale

Folgende Merkmale müssen über alle Stufen erkennbar verwandt bleiben:

- **Kopf- und Gesichtsidentität:** ähnliche Grundform von Kopf, Schnauze und Augenposition; altersgerechte Veränderung statt vollständigem Redesign.
- **Augen:** große, ausdrucksstarke Augen als wiederkehrendes Erkennungsmerkmal. Farbton und Irisgestaltung müssen über die Übergänge nachvollziehbar bleiben; der aktuelle Sprung von Grün zu Bernstein zwischen Kleinkind und Kind ist gezielt zu prüfen.
- **Schuppen und Oberfläche:** erkennbare Schuppenstruktur, plastische 3D-Materialität und eine gemeinsame grün-gelbe Grundfarbwelt.
- **Silhouette:** dieselbe Grundanatomie und Körperlogik. Der Körper wird mit dem Alter länger und schlanker, ohne dass Nico wie eine andere Schlangenart wirkt.
- **Licht:** warme, weiche Grundbeleuchtung. Giftgrünes Leuchten und magische Akzente nehmen mit der Reife zu, bleiben aber kontrolliert.
- **Ausdruck:** freundlich, neugierig und dem Kind zugewandt. Auch die legendäre Form darf mächtig und geheimnisvoll sein, aber nicht bedrohlich gegenüber dem Kind wirken.

## 4. Entwicklungsbogen

1. **Baby – neugieriger Anfang:** sehr kompakte, runde Form; großer Kopf und große Augen; weiche, freundliche Ausstrahlung.
2. **Kleinkind – erste Eigenständigkeit:** etwas längerer Hals und Körper; weiterhin kompakt und verspielt; Gesicht bleibt klar mit dem Baby verwandt.
3. **Kind – aktiver Begleiter:** sichtbar gestrecktere Proportionen; selbstbewusster, lebendiger Ausdruck; Augen- und Gesichtsübergang zu den jüngeren Stufen harmonisieren.
4. **Teenager – schlank und kraftvoll:** deutlich längere, schlankere Silhouette; reifer, aber weiterhin sympathischer Gesichtsausdruck; keine abrupte Veränderung von Kopf oder Farbidentität.
5. **Erwachsen / legendär – die Ikone:** Ausrichtung auf das bestehende Logo. Mehr Präsenz, Details und kontrolliertes giftgrünes Leuchten; mächtig und geheimnisvoll, zugleich eindeutig Nicos vertraute Identität.

## 5. Varianten und Laufzeitverhalten

Der aktuelle Code in `src/ui/Snake.tsx` nutzt Gesichtsausdrucksdateien nur für `baby`, `smallChild` und `child`. Für Teenager sind zwar die Dateien `teen-happy.webp`, `teen-tired.webp`, `teen-eating.webp` und `teen-surprised.webp` vorhanden, sie werden aber derzeit nicht aktiviert. Für Erwachsene existiert im App-Ordner nur `adult-standard.webp`.

**Festlegung für diesen Schritt:**
- Laufzeitverhalten nicht ändern.
- Teenager-Zusatzvarianten zunächst als unbestätigte Bestandsvarianten führen; erst nach Sichtprüfung entscheiden, ob sie aktiviert werden.
- Keine fehlenden Erwachsenenvarianten generieren, bevor die erwachsene Grundform am Logo ausgerichtet und freigegeben ist.
- Emoji-Overlays und bestehende Reaktionslogik bleiben außerhalb dieser visuellen Referenz unverändert.

## 6. Ergebnis des direkten Bildvergleichs

Der direkte Vergleich der fünf Standardbilder und des Logos ist in [PHASE2_NICO_BILDVERGLEICH.md](./PHASE2_NICO_BILDVERGLEICH.md) mit den Bildquellen dokumentiert. Daraus folgen diese verbindlichen Arbeitsentscheidungen:

- Baby und Kleinkind bleiben unverändert die stilistische Basis.
- Beim Kind werden Augenfarbe/Iris und Augenpartie als wichtigste Kontinuitätskorrektur behandelt; Körperstreckung und lebendiger Ausdruck bleiben grundsätzlich erhalten.
- Beim Teenager bleiben Standardpose und schlanke Silhouette erhalten; Augenform und Schnauze werden im Übergang zum Kind geprüft.
- Das bisherige Erwachsenenbild ist keine finale kanonische Referenz. Das Logo definiert die erwachsene Identität, aber die App benötigt daraus eine eigenständige, freundliche Begleiterpose ohne Logo-Schriftzug und fest integrierte Logo-Dekoration.
- Die vorhandenen Teenager-Ausdrucksvarianten werden nicht aktiviert: Herzen, Sterne, „Zzz“ und Futterobjekt sind teilweise in die Bilder eingebrannt. Sie bleiben als Bestand unangetastet.

## 7. Priorisierte Korrekturen vor Serienproduktion

| Priorität | Thema | Nächster Schritt |
|---|---|---|
| P0 | Erwachsene Form | Logo und `adult-standard.webp` direkt gegenüberstellen; erwachsene App-Referenz an das Logo angleichen. |
| P1 | Kontinuität Kleinkind → Kind | Augenfarbe, Iris, Kopf-/Schnauzenform und Schuppenmaterial vergleichen; nur notwendige Abweichungen korrigieren. |
| P1 | Kontinuität Teenager → Erwachsen | Silhouette, Kopfgröße, Halslänge und Farb-/Lichtentwicklung gemeinsam prüfen. |
| P1 | Teenager-Ausdrucksvarianten | Alle vier Zusatzvarianten gegen Standardbild und bestehende Reaktionszustände prüfen; Nutzungsentscheidung dokumentieren. |
| P2 | Variantenabdeckung | Erst nach Freigabe der fünf Standardstufen festlegen, welche zusätzlichen Erwachsenen-Ausdrücke wirklich benötigt werden. |

## 8. Produktionsregeln für neue Charakterbilder

- Bestehende freigegebene Bilder und das Logo als Referenzen verwenden; keine unabhängige neue Schlange entwerfen.
- Gleiche Kameraperspektive, vergleichbare Bildgröße und konsistente Lichtführung für alle fünf Standardstufen.
- Charakter vollständig und mit ausreichendem Rand zeigen; keine abgeschnittenen Körperteile, sofern der konkrete Einsatzzweck das nicht ausdrücklich verlangt.
- Freigestellte Charaktere mit sauberem transparentem Hintergrund exportieren.
- Keine UI, Texte, Rahmen, Buttons, Futterobjekte oder dekorativen Szenen in Charakterdateien einbetten.
- Standardpose zuerst freigeben; Ausdrucks- und Aktionsvarianten erst anschließend ableiten.
- Originale und historische Quellen nicht überschreiben. Neue Fassungen versioniert ablegen und im Asset-Katalog mit Format, Maßen, Alpha-Kanal, Dateigröße und Verwendung erfassen.

## 9. Abnahmecheckliste

- [ ] Alle fünf Standardstufen nebeneinander in vergleichbarer Größe und Perspektive geprüft.
- [ ] Erwachsene/legendäre Form mit dem Original-Logo abgeglichen und ausdrücklich freigegeben.
- [ ] Augenfarbe und Gesichtsidentität über Baby, Kleinkind und Kind harmonisiert.
- [ ] Übergang Kind → Teenager → Erwachsen wirkt wie eine nachvollziehbare Entwicklung derselben Figur.
- [ ] Material, Schuppen, Licht und Detailgrad entsprechen der freigegebenen 3D-Art-Direction.
- [ ] Transparenz, Zuschnitt, Auflösung und Dateigröße technisch geprüft.
- [ ] Laufzeitvarianten und Code-Zuordnung nach visueller Freigabe bewusst entschieden.

## 10. Nicht Bestandteil dieses Schritts

Keine Änderungen an Lernlogik, Entwicklungsgrenzen, Belohnungen, Shop, Speicherung, Navigation oder Laufzeitreaktionen. Keine Bereinigung historischer Dateien. Keine Serienproduktion weiterer Charakterbilder vor der visuellen Freigabe.
