# Quality Engineering Showcase

The source of my portfolio site: a Playwright + TypeScript quality template, presented with a configurator that creates a ready project in the browser.

**[Open the portfolio site →](https://szabihudak.github.io/quality-engineering-showcase/)** · **[Configure a project →](https://szabihudak.github.io/quality-engineering-showcase/configure.html)**

## What Is Here

| Path | Content |
| --- | --- |
| `docs/index.html` | The portfolio homepage |
| `docs/configure.html` | The configurator: choices, live preview, project download (.zip) |
| `docs/database.html` | The database validation layer |
| `docs/configurator/` | The configurator's generator (`generator.js`) and template files (`template.json`), built from the template repository |
| `docs/showcases/` | Published reports: API, UI, accessibility, visual regression (Playwright) and performance (k6) |
| `.github/workflows/update-configurator.yml` | Keeps `docs/configurator/` up to date |

GitHub Pages publishes the `docs/` folder. The configurator runs entirely in the browser: it sends nothing anywhere and asks for no secrets.

## Configurator Updates

`docs/configurator/` comes from the template repository through `.github/workflows/update-configurator.yml`:

```text
every hour, or by hand (Actions → Update configurator)
→ the template's main commit, or the branch, tag or commit given
→ skip when docs/configurator already has that commit
→ continue only when its quality and template-selftest jobs passed
→ npm run qa:configurator in the template
→ commit docs/configurator and request a Pages build
```

The template-selftest job checks that the browser generator creates the same project as the template's setup, so a commit that passed it is safe to publish.

### Private Template

A private template repository needs one secret here, `TEMPLATE_READ_TOKEN`:

1. Create a fine-grained personal access token (Settings → Developer settings → Fine-grained tokens) for the template repository only, with **Contents: read** and **Actions: read**.
2. Add it under **Settings → Secrets and variables → Actions** of this repository as `TEMPLATE_READ_TOKEN`.
3. Renew it before it expires.

A public template works without it.
