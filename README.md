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

## File format

Recipe files are stored as yaml in the following structure:

```yaml
---
name: title of dish
source: An optional field containing a reference from where the recipe is taken
items:
  - <amount> <unit> <name of ingredient>
  - ...
  - with <amount a decimal number in english notation (optional decimal point '.')
  - and <unit> one of the known units (see below)
recipe: >-
  Markdown text describing the steps to cook the ingredients to the dish.
images:
  - list of file names, relative to this yaml file. The first file name is taken as the main image
```

## Known units

The units defined in [this list](units.yaml) are currently known.
The list shows alias names for ISO units and an amount (which is mostly '1').
This might not always be optimal (what amount of an ISO unit might a cup be? It surely depends on what is measured).

If you need more, feel free to [open an issue](issues).
