# Homagix

Food shopping isn't fun. Especially if you have children and need or want to cook every day and those children aren't very interested in experimenting with new dishes. So, sonner or later, you will do the same few dishes again and again. I don't like this.

Sometimes, we _find_ some new dishes which are accepted by the children. I want to remember these. Unless then, I want to use all known dishes in a way that variety is maximized.

To do this in a more digital way, we created this repository to remember dishes, get more variety as well as simplify food shopping by having a list of ingredients which are needed for the dishes.

## Install a development version

If you want to install a development version, use the following commands:

    git clone https://github.com/homagix/homagix
    npm install

After that, copy the `config.template.ts` file to `config.ts` and edit it to contain a secure secret to sign authentication tokens.
Then run the application:

    npm run dev
    open http://localhost:3000/

## Adding recipes

Dishes are stored in [a separate repository](https://github.com/homagix/recipes).
You can create a repository with your own recipes as well.
Just put some recipes in yaml format into it (see the format of these files below), go to your user settings and enter your repository's URL.

To make Homagix be aware of changes in your repository, you need to configure a Webhook in your repository's settings.
GitHub will call this Webhook every time a change is made to your repository.
Remember to use the `webhookSecret` value from your `config.ts` file.

The Webhook's URL is https://<your-homagix-server>/api/webhooks

## Recipe file structure

Each dish's recipe file has a similar structure like in the following example:

```yaml
---
name: Birnen Crostini
source: Yotam Ottolenghi aus dem Buch „Genussvoll vegetarisch“
items:
  - 20 L Olivenöl
  - 0.5 TL Salz
  - 2 Zehen Knoblauch
  - 10 TL Zucker
  - 0.5 Bund Petersilie
  - 2 Stk Birnen
  - 0.5 Stk Pfeffer
  - 500 g Sauerteigbrot
  - 1 Stk Zitronen
  - 100 g Ziegenfrischkäse
recipe: >-
  Den Backofen auf 200° vorheizen.

  Pinienkerne mit 4 EL Olivenöl, Knoblauch, Prise Salz und etwas schwarzem Pfeffer im kleinen Häcksler mixen. Es entsteht eine grobe, feuchte Paste.

  Die Brotscheiben auf einer Seite mit der Paste bestreichen. Auf das Backblech legen und etwa 10 min im Ofen rösten, bis sie etwas Farbe angenommen haben. Herausnehmen und kurz abkühlen lassen.

  Mit einem scharfen Messer die Rundungen der Birnen gerade schneiden. Dann die Birnen der Länge nach in jeweils vier dicke Scheiben schneiden. Das Kerngehäuse mit einem spitzen Messer entfernen.

  Die Birnenscheiben in eine Schüssel legen. Das restliche Olivenöl mit dem Zucker, dem Zitronensaft sowie einer Prise Salz verrühren und behutsam mit den Birnen vermischen.

  Die Birnenscheiben auf einer heißen (am besten Grill-) Pfanne erhitzen. Ca. 1 Min bis sie sich bräunen. Ottolenghi schafft es in seiner Grillpfanne, dass sie braune Grillstreifen bekommen. Vorsichtig mit der Zange aus der Pfanne nehmen und sie dabei möglichst nicht beschädigen.

  Die Birnenscheiben auf die Brote geben. Den Käse darauf verteilen. Diese Crostini im Ofen 3-4 min erwärmen, damit der Käse leicht schmilzt.

  Mit Kerbel- oder Petersilienblättern garnieren und direkt servieren.
images:
  - Birnen-Crostini.jpeg
```

The images can be placed besides these recipe files, but can also be placed in a separate folder.
Just make sure that a relative path is specified.
The first picture will be used as the main picture and be displayed in the top of the recipe page. All other images (if they exist) will be shown below.
