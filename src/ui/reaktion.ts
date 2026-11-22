// Futter, Sprüche und Reaktionen der Schlange. Alles Kosmetik, keine Spiellogik.

export type Art = 'lecker' | 'bah'

export interface Flug {
  futter: string
  /** 0 bis 3: je eine andere Flugbahn */
  variante: number
  /** Sekunden bis zum Start */
  verzoegerung: number
}

export interface Reaktion {
  art: Art
  text: string
  fluege: Flug[]
  gefuehl: string
  nonce: number
  /** Nach dem ersten Fehler: die Schlange hilft danach mit einem Tipp */
  tipp?: boolean
}

/** Das mag eine Schlange. */
export const LECKERES = ['🐭', '🐸', '🐛', '🦗', '🥚', '🐁', '🦎', '🪱']
/** Falsche Lieferung: Das mag sie nicht. Das macht es lustig, die Schlange schaut nur komisch. */
export const IGITT = ['👟', '🧦', '🥦', '🍕', '🧽', '🥕', '🩴', '🧅', '🎈', '🧸']

// Wichtig für den Ton: Nicht das Kind hat etwas Falsches gemacht, sondern das Futter ist durcheinandergeraten.
// Die Schlange wundert sich und macht Quatsch. Sie lacht nie über das Kind und fragt nie, ob etwas "ernst gemeint" ist.
// Die Schlange sagt nicht "ey".
const SPRUECHE = {
  erster: [
    'Moin, moin! Das war ja fix, mein Freund!',
    'Na also, geht doch! Mampf!',
    'Boah, bist du schlau! Lecker!',
    'Mensch Meier, ist das lecker!',
    'Das flutscht ja wie nix!',
    'Volltreffer! Davon will ich mehr!',
    'Mhhh, genau mein Geschmack!',
    'Das Futter-Lieferdienst-Team ist heute in Topform!',
    'Zack, direkt ins Maul! Perfekt!',
    'Mein Bauch sagt Danke, mein Kopf sagt: Wow!',
    'Klasse! Das war ein Festmahl!',
    'Schnipp, schnapp, mampf! Richtig gut!',
    'Du bist ein Mathe-Zauberer! Und ich bin satt und glücklich.',
    'Hui, das war lecker! Gibt es noch mehr davon?',
    'Genau so! Mein Schwanz wackelt vor Freude!',
    'Fünf Sterne für diese Antwort! Mampf!',
  ],
  zweiter: [
    'Na siehste, mit Köpfchen geht das! Mampf!',
    'Zweiter Versuch, erster Hunger! Lecker!',
    'Geschafft! Das schmeckt!',
    'Dranbleiben lohnt sich! Mampf mampf!',
    'Der Tipp hat geholfen, und das Futter schmeckt!',
    'Erst überlegt, dann geknackt! Das mag ich.',
    'Klasse gemacht! Aufgeben gibt es bei uns nicht.',
    'Das war knifflig, aber du hast es gelöst! Mampf!',
    'Gut, dass du es nochmal probiert hast! Lecker!',
    'Aller guten Dinge sind zwei! Mhhh!',
  ],
  falsch: [
    'Huch! Ein Schuh? Bin ich ein Schuhschrank? Hihi!',
    'Nanu, wer hat die Socke in meine Futterschüssel gelegt? Nochmal!',
    'Ups, falsche Lieferung! Ich hatte was mit Maus bestellt.',
    'Brokkoli? Ich bin doch kein Kaninchen! Probieren wir nochmal.',
    'Hä, ein Luftballon? Den kann ich nicht mal beißen! Nochmal!',
    'Das Futter ist durcheinandergepurzelt! Noch ein Versuch.',
    'Pizza? Die ist ja für Menschen! Gib mir lieber was Schlangiges!',
    'Eine Zwiebel? Da muss ich ja weinen! Schnell eine andere!',
    'Ein Teddy? Der ist zum Kuscheln, nicht zum Essen! Hihi!',
    'Hoppla, ein Schwamm! Der ist ja gar nicht saftig. Nochmal!',
    'Eine Karotte? Da muss wohl ein Hase die Lieferung gepackt haben!',
    'Ein Flip-Flop! Ich habe doch gar keine Füße. Nochmal!',
    'Pfff, wer hat denn das Futter vertauscht? Her mit dem richtigen!',
    'Mein Futterautomat spinnt! Drück nochmal auf den Knopf.',
    'Schmeckt nach Gummi! Schnell ein neuer Versuch!',
    'Das ist ja gar kein Tier! Ich warte auf was Quirliges.',
  ],
  daneben: [
    'Macht nix! Das gucken wir uns zusammen an.',
    'Kein Stress. Wir kriegen das noch hin!',
    'Das war ein harter Brocken. Zusammen knacken wir den!',
    'Nicht schlimm! Gleich kommt die Aufgabe nochmal, dann klappt es.',
    'Auch Schlangen häuten sich mehrmals, bis es passt. Wir üben weiter!',
    'Das ist nur eine Übung. Beim nächsten Mal sitzt es!',
  ],
  start: [
    'Her mit dem Futter!',
    'Ich hab Kohldampf!',
    'Los, ich knurre schon!',
    'Na, was gibt es denn Schönes?',
    'Ich bin bereit. Und hungrig!',
    'Mein Bauch macht schon Musik!',
    'Welche Leckerei kommt als Nächstes?',
    'Ich züngele schon vor Vorfreude!',
    'Ich bin ganz Ohr! Naja, eigentlich ganz Schlange.',
    'Bring mir was Schönes, ich warte!',
    'Auf die Plätze, fertig, mampf!',
    'Mein Löffel ist bereit. Ich hab ja keinen, aber egal!',
  ],
  froh: [
    'Moin! Schön, dass du da bist!',
    'Na, mein Freund? Bereit für Mathe?',
    'Hallo, du! Wollen wir zusammen üben?',
    'Du bist da! Ich habe mich schon gefreut.',
    'Juhu, mein Lieblingsmensch! Lust auf eine Runde?',
    'Hallo! Mir geht es richtig gut im Terrarium.',
  ],
  hungrig: [
    'Mein Bauch knurrt wie ein Traktor! Magst du mit mir üben?',
    'Ich hab so einen Hunger! Hast du Lust auf eine Runde?',
    'Mir läuft das Wasser im Maul zusammen. Üben wir?',
    'Mein Magen spielt Trommel. Hilfst du mir?',
  ],
  schlaeft: [
    'Hä? Wasn los? Ach, du bist es! Moin!',
    'Zzz ... oh, Besuch! Moin!',
    'Gähn ... ich habe von Mäusen geträumt. Schön, dass du da bist!',
    'Mmm, eingenickt! Aber jetzt bin ich hellwach.',
  ],
  anstupsen: [
    'Hihi, das kitzelt!',
    'Hey, ich bin eine Schlange, keine Wurst!',
    'Ich sehe was, was du nicht siehst: Futter!',
    'Boah, nicht schubsen!',
    'Huch, wer klopft denn da an mein Terrarium?',
    'Kitzelkitzel! Das mag ich!',
    'Ssssssuper, nochmal! Ach nein, doch nicht.',
    'Wer stupst mich da an? Ich kenn dich doch!',
    'Pass auf, ich kann auch zischen! Ssss!',
    'Hihi, ich wackle gleich vor Lachen!',
  ],
  gewachsen: [
    'Boah, ich bin gewachsen! Guck mal, wie groß ich bin!',
    'Ich werde größer! Die Schuppen spannen schon.',
    'Wow, ich bin gewachsen, und das hast du geschafft!',
    'Neue Größe, neue Schuppen! Danke dir!',
  ],
  gekauft: [
    'Boah, schick! Das gefällt mir!',
    'Mensch Meier, wie gemütlich!',
    'Na, das nenne ich mal Wohnkomfort!',
    'Das sieht toll aus! Genau mein Geschmack.',
    'Juhu, ein neues Möbelstück! Ich probiere es gleich aus.',
    'Mein Terrarium wird immer schöner!',
    'Ein Traum! So wohnt nur eine Schlange von Welt.',
  ],
  satt: [
    'Puh, ich bin pappsatt!',
    'Mein Bauch ist kugelrund. Für heute reicht es!',
    'Satt und zufrieden. Bis morgen, mein Freund!',
    'Ich kann keinen Bissen mehr! Aber es war lecker.',
  ],
  lecker: [
    'Das war lecker! Danke!',
    'Mampf mampf! Davon könnte ich mehr vertragen.',
    'Mhhh, das hat gut geschmeckt!',
    'Ein Festmahl! Du bist der beste Futtermeister.',
    'Schmatz! Mein Bauch ist ganz warm vor Glück.',
  ],
  abbruch: [
    'Huch, du willst schon gehen? Mein Bauch knurrt doch noch!',
    'Nicht weglaufen! Ich habe noch Platz für drei Mäuse!',
    'Wirklich gehen? Dann muss ich allein essen. Und ich habe keine Hände!',
    'Halt, stopp! Das Futter ist gerade erst losgeflogen!',
    'Oh nein, das Futter wartet doch schon! Bleibst du noch ein bisschen?',
  ],
  mitbringsel: [
    'Guck mal, was ich im Terrarium gefunden habe! Eine Münze für dich!',
    'Ich habe heute früh im Moos gewühlt. Und zack: eine Münze! Die gehört dir.',
    'Ssssurprise! Ein Tagesgeschenk von mir. Für dich!',
    'Die lag unter meinem Stein. Behalte sie, ich kann sie eh nicht ausgeben!',
    'Ein kleines Geschenk, weil du heute da warst. Mampf, äh, danke!',
  ],
  halbzeit: [
    'Fünf geschafft! Ich habe schon Hunger auf die nächsten.',
    'Halbzeit! Ich lege mich kurz in die Sonne.',
    'Mmh, das war lecker. Bereit für Teil zwei?',
    'Die Hälfte ist im Bauch! Der Rest kann kommen.',
    'Zeit für eine Schnaufpause. Ich schnaufe, du bist toll!',
    'Halbzeit! Mein Bauch sagt: weiter so!',
  ],
  serie: [
    'Drei hintereinander! Ich glaub, ich verschlucke mich!',
    'Das Futter fliegt nur so herein! Dreimal Volltreffer!',
    'Dreierpack! Du bist heiß gelaufen!',
    'Hat da jemand einen Lauf? Ja, du! Bonusfutter!',
    'Mampf, mampf, mampf! Drei Treffer, ein Schmaus!',
    'Das war eine Futter-Serie vom Feinsten!',
  ],
  haeutung: [
    'Zeit für eine neue Haut. Die alte war mir eh zu eng!',
    'Raschel, raschel. Schon wieder eine Haut weniger, schon wieder ein Meilenstein mehr!',
    'Meine alte Haut hebe ich für dich auf.',
    'Aus der Haut gefahren, und zwar vor Freude!',
    'Schlüpf, schlüpf! Jetzt bin ich wieder ein Stück weiter.',
    'Ssssuper! Eine Haut für dein Album.',
  ],
  schuppen: [
    'Je mehr Schuppen, desto kniffliger. Dafür gibt es mehr Futter!',
  ],
  intro1: [
    'Hallo! Ich bin eine Schlange und ich liebe Mathe-Aufgaben. Die sind für mich wie Futter!',
  ],
  intro2: [
    'Löst du eine Aufgabe richtig, fliegt leckeres Futter in mein Maul. Bei einer falschen Antwort kommt manchmal ein Schuh. Igitt!',
  ],
  intro3: [
    'Wenn ich genug gefuttert habe, werde ich größer. Und du bekommst Münzen für Pflanzen und Steine in meinem Terrarium!',
  ],
}

export type SpruchArt = keyof typeof SPRUECHE

export function zufall<T>(liste: readonly T[]): T {
  return liste[Math.floor(Math.random() * liste.length)]
}

export function spruch(art: SpruchArt): string {
  return zufall(SPRUECHE[art])
}

/** Die Sprüche in fester Reihenfolge, damit die Bubble beim Aufgabenwechsel abwechselt. */
export function startSpruch(index: number): string {
  return SPRUECHE.start[index % SPRUECHE.start.length]
}

let zaehler = 0

export function neueReaktion(art: Art, text: string, anzahl = 1, tipp = false): Reaktion {
  const liste = art === 'lecker' ? LECKERES : IGITT
  const start = Math.floor(Math.random() * 4)
  const fluege: Flug[] = Array.from({ length: anzahl }, (_, i) => ({
    futter: zufall(liste),
    variante: (start + i) % 4,
    verzoegerung: i * 0.35,
  }))
  zaehler += 1
  return { art, text, fluege, tipp, gefuehl: art === 'lecker' ? zufall(['😋', '😍', '🤩']) : zufall(['🤨', '😵‍💫', '🤪', '😝']), nonce: zaehler }
}
