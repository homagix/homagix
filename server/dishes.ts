import { StoredDish } from "~/types"

export const dishes = [
  {
    id: "5",
    name: "Bandnudeln mit Pilzen und Tomaten",
    source: "",
    alwaysOnList: false,
    items: [
      { id: "808b3158-66e4-4a76-8f91-97397c830c95", amount: 500 },
      { id: "58f7f237-ab90-4553-8780-b922d67ad827", amount: 1 },
      { id: "46925230-ef4c-48e4-a5a9-4178485c74f9", amount: 500 },
      { id: "47de37fd-b707-4572-bc59-34b0ddb67088", amount: 50 },
      { id: "45e674c4-09af-438d-8741-52bd6245606f", amount: 200 },
      { id: "530fe547-74b5-440e-89e6-2a0fe9ad4299", amount: 1 },
    ],
    recipe:
      "Pilze putzen und in mittelgroße Scheiben, Lauchzwiebeln in Ringe schneiden, Zwiebeln klein häckseln.\nNudeln im Topf kochen.\nIn einer Pfanne zunächst die Zwiebeln goldgelb in Butter anschmoren, dann die Pilze dazu geben.<br>\nWenn die Pilze weich sind, die Tomaten ergänzen und heiß werden lassen.<br>\nDann die Temperatur reduzieren und Crème Fraîche hinzu geben. Mit Salz, Pfeffer und Kräutern der Provence würzen.",
    images: [],
    isEditable: false,
  },
  {
    id: "6",
    name: "Spätzle mit geräuchertem Tofu und Zwiebeln",
    source: "",
    alwaysOnList: false,
    items: [
      { id: "a33d6967-f4ff-40b9-b5f4-c4e7185569ac", amount: 800 },
      { id: "221a4115-03c7-4833-b8f9-5305af2b9207", amount: 2 },
      { id: "c57a262f-0c85-4920-ad30-81e4f2a9f2d3", amount: 100 },
      { id: "3aace24e-9f09-4ee7-a736-4f32ec940386", amount: 1 },
      { id: "712a118d-000b-4459-bc51-4bae25fc3a8b", amount: 1 },
      { id: "6e9c48f1-2763-47d2-9680-53337946a67e", amount: 1 },
    ],
    recipe: "",
    images: [],
    isEditable: false,
  },
  {
    id: "49",
    name: "Birnen Crostini",
    source: "Yotam Ottolenghi aus dem Buch „Genussvoll vegetarisch“",
    alwaysOnList: null,
    items: [
      { id: "4af0d383-fff9-4d24-b0e3-3ed567d9a7fa", amount: 20 },
      { id: "51254e12-a16d-4e49-b0e0-480b80c3573e", amount: 0.5 },
      { id: "4e990a30-8349-488b-9b56-6f2d13ff88b6", amount: 2 },
      { id: "18e05a57-7ee8-4c0d-b7e1-bb8439be25d4", amount: 10 },
      { id: "00603560-9605-40e8-8c8b-cbdea718923f", amount: 0.5 },
      { id: "caeb0267-b309-4861-94ba-87acb0ea70a4", amount: 2 },
      { id: "0c409233-055e-4a13-92fc-dba6a59cacf1", amount: 0.5 },
      { id: "188e89f6-7035-4022-97d9-be2bcd6d8de7", amount: 500 },
      { id: "3d09da56-ff94-4841-9e51-7872351d7aa0", amount: 1 },
      { id: "7fd0a6a0-1847-4719-b664-25a0fd841b15", amount: 100 },
    ],
    recipe:
      "Den Backofen auf 200° vorheizen.\nPinienkerne mit 4 EL Olivenöl, Knoblauch, Prise Salz und etwas schwarzem Pfeffer im kleinen Häcksler mixen. Es entsteht eine grobe, feuchte Paste.\nDie Brotscheiben auf einer Seite mit der Paste bestreichen. Auf das Backblech legen und etwa 10 min im Ofen rösten, bis sie etwas Farbe angenommen haben. Herausnehmen und kurz abkühlen lassen.\nMit einem scharfen Messer die Rundungen der Birnen gerade schneiden. Dann die Birnen der Länge nach in jeweils vier dicke Scheiben schneiden. Das Kerngehäuse mit einem spitzen Messer entfernen.\nDie Birnenscheiben in eine Schüssel legen. Das restliche Olivenöl mit dem Zucker, dem Zitronensaft sowie einer Prise Salz verrühren und behutsam mit den Birnen vermischen.\nDie Birnenscheiben auf einer heißen (am besten Grill-) Pfanne erhitzen. Ca. 1 Min bis sie sich bräunen. Ottolenghi schafft es in seiner Grillpfanne, dass sie braune Grillstreifen bekommen. Vorsichtig mit der Zange aus der Pfanne nehmen und sie dabei möglichst nicht beschädigen.\nDie Birnenscheiben auf die Brote geben. Den Käse darauf verteilen. Diese Crostini im Ofen 3-4 min erwärmen, damit der Käse leicht schmilzt.\nMit Kerbel- oder Petersilienblättern garnieren und direkt servieren.",
    images: ["Birnen-Crostini.jpeg"],
    ownedBy: null,
  },
] as StoredDish[]
