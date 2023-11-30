---
marp: true
theme: uncover
_class: invert
size: 16:9
header: 'ECOINDEX + WEB PERF = PLUGIN LIGHTHOUSE'
footer: 'Association Green IT @2023'
---

# <!-- fit --> Ecoindex + Web Perf

A suite of tools to mesure the environnemetal performance, inside the web development workflow.

---

<!-- _class: invert -->

## What it is?

- a cli that can be used as a standalone tool ;
- a lighthouse plugin that can be used with the lighthouse cli and lighthouse CI;
- a workflow standardize the actions of an user on page the mesure ;
  - with lighthouse (and )

---

## What it do?

- mesure with ecoindex runner and display GHG and water consumption
- generate lighthouse reports (html or json) with ecoindex audits
- genereate lighthouse CI reports with ecoindex audits that can be used with github actions or other CI tools and in Lighthouse server
- generate the standardized Environmental Impact Statement (EIS) from Green IT®

---

| feature                 | cli | CI  |
| ----------------------- | --- | --- |
| ecoindex audits         | ✅  | ✅  |
| Green IT Best-practices | ✅  | ✅  |
| lighthouse report       | ✅  | ✅  |

---

## What's in the box?

- `lighthouse-ecoindex` cli
- `lighthouse-plugin-ecoindex` plugin
- Puppeteer script to mesure the page as a user
- Lightouse config to mesure and add the ecoindex audits

---

## Usage with lighthouse CI
