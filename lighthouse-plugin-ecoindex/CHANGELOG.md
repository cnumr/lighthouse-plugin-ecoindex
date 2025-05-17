# Changelog

## [5.1.2](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/5.1.1...5.1.2) (2025-05-17)


### Bug Fixes

* ajouter le support des modes 'navigation', 'timespan' et 'snapshot' dans l'audit WarnNodesCount ([c9b5de4](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/c9b5de45b4782d0910be7679ef82517bc5d65075))
* ajouter un commentaire pour désactiver l'avertissement ESLint sur une variable non utilisée dans plugins.js ([befaf2f](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/befaf2f1d436ee56b31d3f4f69729d872c453e56))
* mettre à jour les dépendances vers les versions FIXE 12.5.1 de Lighthouse et 24.8.0 de Puppeteer, ainsi que d'autres mises à jour de dépendances dans package-lock.json ([73af918](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/73af9186bbd3cd924b56b31a3c3bfcf444bcf647))

## [5.1.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/5.1.0...5.1.1) (2025-02-16)


### Bug Fixes

* better DX ([d45996b](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/d45996b05c5ae6933755c09de6cec7875fcebeb5))
* hide the readme of the schema ([5ec4339](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/5ec4339e738ff28a0766ced24fa368804addd71b))
* retirer la page d'atterissage d'authentification des la liste des mesures = duplicate hang process in userflow [#65](https://github.com/cnumr/lighthouse-plugin-ecoindex/issues/65) ([4d7b8d3](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/4d7b8d30c912fb3b6c0e8e1c85c497a2d4153715))
* retirer la page d'atterissage d'authentification des la liste des mesures = duplicate hang process in userflow [#65](https://github.com/cnumr/lighthouse-plugin-ecoindex/issues/65) ([4be4724](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/4be4724e75dfd188d101a4cf9b5e36f7a522d896))

# [5.1.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/5.1.0-rc.0...5.1.0) (2025-02-15)


### Bug Fixes

* new gatherMode, ommit "snapshot" and "timestamp" ([cb6ee15](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/cb6ee15edbabddee5f3947c54a248b1be76c362a))
* try to fix path error with `EcoindexApp` ([6cb8f9b](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/6cb8f9ba7885bfabcf9e125959755e9feeb199f1))
* workflow must be updated ([6fdf6d0](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/6fdf6d0941c161ee907b400a1d716e28eb1c22bb))


### Features

* add authenticate process ([68e35c4](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/68e35c444d6aac8225ab19b4625c6a2d24c57d4a))
* add new login form args ([606bb5e](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/606bb5e941d294ac86842ecf5bd7b106be684798))
* add schema ([303823c](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/303823cc19c74d9a2e85f441e81c98d87d7cb72e))
* add schema ([264029d](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/264029d456ec92760ff292d84381bbf2754a763a))
* add schema ([0f1cb37](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/0f1cb37195742be0a227fe8e0cab1691a812e74b))
* add submit and refacto / ajouter la possibilité de se connecter en début de parcours [#60](https://github.com/cnumr/lighthouse-plugin-ecoindex/issues/60) ([f46c3c2](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/f46c3c2f1589509defff83e98548b74a661878c9))
* better error handling ([0aa533f](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/0aa533f15cc38063415c76d50e7bcee44427e1b4))
* continue the auth process (NOT WORKING) ([ddec140](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/ddec140765ea5012a57fbd1a7a7ce4ea2b92ff56))
* init ([97b31e3](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/97b31e334c47636aeb2f7d4d1f68d1685b37847d))
* new test ([0746b39](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/0746b39e2758173c5be80b15b58c13ce67ae8dfc))
* read auth in json-file ([81f3f86](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/81f3f862b2d1517527831248fe8204b632d4d65f))
* update dependencies ([563226c](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/563226c555949d78860bfbd57d056d5aa6a54b8b))

# [5.1.0-rc.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/5.0.7...5.1.0-rc.0) (2024-10-20)


### Bug Fixes

* corriger les erreurs de path pour utiliser le plugin dans EcoindexApp [#59](https://github.com/cnumr/lighthouse-plugin-ecoindex/issues/59) ([fb007ac](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/fb007ac6860224c5fe6a9fc7872fc3951de93c4d))
* missing gramme for GHG ([bae6055](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/bae605583831072de10fe153acbde5b543ad4a0c))


### Features

* add GNU AFFERO GENERAL PUBLIC LICENSE ([f289c45](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/f289c4598a2686efa7bbddca5c9aa554e7b1866d))

## [5.0.7](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/5.0.6...5.0.7) (2024-09-29)


### Features

* begin/index in mjs ([fe24cd8](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/fe24cd819ce99dc8534d51fbd8a0b8ef3df0c1df))

## [5.0.6](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/5.0.5...5.0.6) (2024-09-26)


### Bug Fixes

* #!/usr/bin/env node ([f0cf7bd](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/f0cf7bd6f0d61d30fb5ab334db52c873650654e5))

## [5.0.5](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/5.0.4...5.0.5) (2024-09-25)


### Bug Fixes

* bad export ([b48c342](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/b48c342270eede2253e7d56e5c868bd65c901b14))

## [5.0.4](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/5.0.3...5.0.4) (2024-09-25)


### Features

* runCourses in mjs ([1e4c5e4](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/1e4c5e4479b3cd5532406af73a4dae7d6cf3deef))

## [5.0.3](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/5.0.2...5.0.3) (2024-09-12)


### Features

* add auto intallatoion of the mandatory browser with `postinstall` in package.json ([8bfac00](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/8bfac00dba2762425fb45b18665f03f14aa41534))

## [5.0.2](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/5.0.1...5.0.2) (2024-09-11)


### Features

* better browser install return ([247cbde](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/247cbdedb34b29722025571e8c9735f38559a839))

## [5.0.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/5.0.0...5.0.1) (2024-09-11)


### Features

* better return (with version number `buildId`) ([11b67b9](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/11b67b90377a327d4bba1b93e9450e7cab531fb9))

# [5.0.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/4.2.1...5.0.0) (2024-09-11)


### Features

* **Puppeteer Browser:** use specific version of Puppeteer Brower in mesure process ([e4fe1d6](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/e4fe1d6f754dda828ab3e46584bd21ef55c35ada))


### BREAKING CHANGES

* **Puppeteer Browser:** install browser with `npx lighthouse-plugin-ecoindex browser-install`

## [4.2.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/4.2.0...4.2.1) (2024-09-11)


### Features

* add installer and verify browser ([116e4f5](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/116e4f53df8356b46cc6c1cca9225bebf4984cc0))

# [4.2.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/electron-v1.3.42...4.2.0) (2024-09-06)


### Features

* update all dependencies ([a0ed252](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/a0ed25246de1648bbe3b2e5dcffd19df3c895a6b))
* update because audit was removed from lighthouse 12 ([c8091f4](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/c8091f4da5ff30b93c3cc56dc214112deca4c528))
* update to node 20 ([60cab42](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/60cab4276c37c3e284056bfe32d991bdbe7dad81))

## [4.1.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/4.0.6...4.1.1) (2024-08-11)


### Features

* add ecoindex-js and ecoindex_reference inside the package to rm alert on assert json ([b8dcfe0](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/b8dcfe0e83cf49ef661d2089000ca0fb0a8202bb))

## [4.0.6](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/4.0.5...4.0.6) (2024-08-01)


### Bug Fixes

* typo fix ([ef13635](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/ef136354981728cdba2db5af8ce7fd01a6758119))

## [4.0.5](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/4.0.4...4.0.5) (2024-08-01)


### Bug Fixes

* bad import ([f2b804d](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/f2b804d0096ce7838010253df5310434fa8a9b1a))

## [4.0.4](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/4.0.3...4.0.4) (2024-08-01)


### Bug Fixes

* typofix ([a519357](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/a5193577f627fc652510427851e65a17f1e1e06e))


### Features

* get path compatible with darwin, linux, win32 ([ccc3edf](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/ccc3edf1aeb137108e0186f7d179935c0301e5da))

##

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

Generated by [`auto-changelog`](https://github.com/CookPete/auto-changelog).

#### [4.0.3](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/4.0.2...4.0.3)

- Hrenaud/issue24 [`#25`](https://github.com/cnumr/lighthouse-plugin-ecoindex/pull/25)
- feat: better page size [`4cba2f1`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/4cba2f1193e66ee8bd9367783c22f778e1a7ee7e)
- feat: getDetails to used in table [`906e7e2`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/906e7e2ffbfc8a4832502d983e11a8c06f8dbf1d)

#### [4.0.2](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/4.0.1...4.0.2)

> 27 May 2024

- fix: clé `output-path` non prise en compte dans `input.json` #20 [`#23`](https://github.com/cnumr/lighthouse-plugin-ecoindex/pull/23)
- FIX[#21]: Update ecoindex.fr link [`#22`](https://github.com/cnumr/lighthouse-plugin-ecoindex/pull/22)
- Release 4.0.2 [`b9b5d38`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/b9b5d383d39a597c7701a65b06c57dc66387c6e6)
- fix: old wildcard [`80e9325`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/80e9325c91288a3fa480f38eed01ac9d50819d1c)
- chore: update version [`76b8f54`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/76b8f54ec4d4c5a3f2b920a75dcdf60b077e8299)

#### [4.0.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/4.0.0...4.0.1)

> 13 May 2024

- change version [`#17`](https://github.com/cnumr/lighthouse-plugin-ecoindex/pull/17)
- Github action for issues,  clean and doc [`#16`](https://github.com/cnumr/lighthouse-plugin-ecoindex/pull/16)
- feat: new Gatherer DOMInformations [`#14`](https://github.com/cnumr/lighthouse-plugin-ecoindex/pull/14)
- doc: Add input-file.json and update package.json script [`8c3018f`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/8c3018ff6a7039740c3a50ea147a430684792a2c)
- feat: Add GitHub Actions workflow to close inactive issues [`4abfa55`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/4abfa5526a97f81b55107f56e762b34a1f89c81b)
- Release 4.0.1 [`5d37c5f`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/5d37c5f422aefa49e605352a11d51a7cae229159)

### [4.0.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/4.0.0-beta.0...4.0.0)

> 29 April 2024

- feat: rm patch-package [`17d3bec`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/17d3becb10853f1015844010add688d62f161c28)
- feat: example lichthouse-cli [`7aff927`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/7aff927a62a0cb5f4d9a91104b11c0d7fcfa0954)
- feat: simplify devcontainers launch [`738d153`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/738d153fb26e418b86b04965f12f997abd1e7197)

#### [4.0.0-beta.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/3.3.0...4.0.0-beta.0)

> 9 April 2024

- feat: add tool to patch libs lighthouse and @lhci [`602cf3f`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/602cf3f8b90b25f93a9216301d44ea1f5f41b386)
- feat: add lhci-linked-lib example [`7098ed1`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/7098ed1067f59498accc95f3c80094eb882fe7ff)
- feat: add lighthouse-cli-linked-lib [`81c5f6e`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/81c5f6e823c19a232519de37bc28021d31258fd9)

#### [3.3.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/3.2.0...3.3.0)

> 1 April 2024

- feat: add Delete all warnings and notices in JS console [`b463b67`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/b463b677115d5e8304a8e2bad55b839e5b1a4707)
- feat: add #RWEB_0034 - Do not resize images on the browser side [`7c5c376`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/7c5c376399ee451acd6b26c436ee96f4313db81f)
- feat: add #RWEB_0078 - Compress CSS, JavaScript, HTML and SVG files [`3de82e0`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/3de82e0f518cdabb5b255cd1331f3acde4686efb)

#### [3.2.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/3.1.3...3.2.0)

> 31 March 2024

- doc: add LHCI configuration [`cfe6a5c`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/cfe6a5cbfc68bb1899528ab1651906f1cf1d8011)
- feat: add #RWEB_0077 - Minify CSS and JavaScript file(s) [`a249b05`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/a249b05fb452df071ef8b7f9a00068842b626d68)
- chore: add simple example [`15c5612`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/15c5612c10b6bc0a5ec5801cc2bfa608298743c7)

#### [3.1.3](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/3.1.2...3.1.3)

> 8 February 2024

- feat: add user-agent flag if necessary [`8816c58`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/8816c583c63c804ff24bf0bcf630ebfa71388ffb)
- Release 3.1.3 [`04e62e4`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/04e62e4ff7c4c2fb15672234d27aabde39542ccf)

#### [3.1.2](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/3.1.1...3.1.2)

> 8 February 2024

- Release 3.1.2 [`1a7f94e`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/1a7f94ea2e2649cbae72de0e3c4d3f08a264918a)
- fix: revert ouput-path to `.reports` and update description. [`6c229ee`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/6c229ee437bd48e61f058ec067aaa7c9fa751755)

#### [3.1.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/3.1.0...3.1.1)

> 8 February 2024

- Release 3.1.1 [`6aa1a69`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/6aa1a69371be69232239583fbb057583b90c9c1b)
- fix: json is mandatory for statement files [`7a1e430`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/7a1e430d77e680c202c69797cd21ee26bc25575e)
- feat: fix B_TO_KB in statements #7 [`686d1c7`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/686d1c7f1a189a14d14f717dfccc0a99a6890d26)

#### [3.1.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/3.0.2...3.1.0)

> 31 January 2024

- feat: add summary generation [`e5ba4bf`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/e5ba4bf7291140c5a591212feaaab20d2aab7061)
- Release 3.1.0 [`a2f2f6b`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/a2f2f6b4c20ccff73a64ed081b8f273e490aac07)

#### [3.0.2](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/3.0.1...3.0.2)

> 30 January 2024

- doc: update license [`7f2787d`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/7f2787dd3b226780b3dc04b038a41ecd0e48b84c)
- chore: update licence [`49618e7`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/49618e7134c43a8ed746da24ad45a451fdaa0f72)
- Add input-file.json and update package.json [`f883aff`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/f883aff8d6c810f7bcc3c52ac746affb0d9dfc96)

#### [3.0.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/3.0.0...3.0.1)

> 11 December 2023

- Release 3.0.1 [`38fc7c6`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/38fc7c64f57dc9124b93e4fa9c0a297a1a7326e9)
- doc: update scripts [`2ea68e4`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/2ea68e44b877e44d7a23ef0169ff82eb9f3db6de)
- docs(documentation): Mise à jour [`b1ebb78`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/b1ebb78be4dd7f2c7e3bf1a216444a5fcd298d1d)

### [3.0.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/2.0.4...3.0.0)

> 10 December 2023

- refactor(npx and documentation): change the command to launch the projet [`d3054be`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/d3054bee3a7cfead86b92789b49ba15eec2ebc83)
- Release 3.0.0 [`58d630a`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/58d630a714ddd92fd4b9d916be1711444319759f)
- doc: update documentation [`041a156`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/041a15698d90f2056e0c91e2e31558db38f3544d)

#### [2.0.4](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/2.0.3...2.0.4)

> 7 December 2023

- Release 2.0.4 [`52e8c14`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/52e8c149b7a43ec0380d681044c61486871f0433)
- fix: image url [`ac0b542`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/ac0b5428609625f66fd50990f7829c259524f664)

#### [2.0.3](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/2.0.2...2.0.3)

> 7 December 2023

- chore: hide private files and folders [`25584d7`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/25584d796ac3b3ade8de1c5aebae7363654c6f6b)
- doc: update and add esi page [`c9ac9de`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/c9ac9dec03b224ccf399983727eda227b60f0413)
- doc: update [`2c9d6fe`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/2c9d6fe7c24b1e54caf07e1b25666ca05ad3a186)

#### [2.0.2](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/2.0.1...2.0.2)

> 1 December 2023

- doc: udate Readme to display new doc [`a169f02`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/a169f02684f229140d1af68300c4a78ed7a6ee8b)
- chore: update contribute [`e532110`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/e532110dbce70953cab934ab938cd8453e257acb)
- Release 2.0.2 [`08d2107`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/08d21078f6de11389f74c2d745cbab47f65ca271)

#### [2.0.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/2.0.0...2.0.1)

> 1 December 2023

- doc: add bps [`ad9377e`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/ad9377edf9b7f6675e9672cdf05517c24831b090)
- doc: update [`8d6c2d9`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/8d6c2d9cded2d315613eb78537b4919ac0233a1c)
- doc: update [`c98f882`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/c98f8826bd68e8486318c3f052906f12a3d30303)

### [2.0.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.2.2...2.0.0)

> 30 November 2023

- Feat/new bin [`#1`](https://github.com/cnumr/lighthouse-plugin-ecoindex/pull/1)
- feat: init new bin [`4b75715`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/4b75715172e31a5c4e20a7885f2c196d804c1da6)
- feat: continue [`7c15b9d`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/7c15b9d753adb8edffa0d80a5867bb7fb064beba)
- fix: rm dependecies [`c39442d`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/c39442d2e492133232660891374897079b0cc01e)

#### [1.2.2](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.2.1...1.2.2)

> 24 November 2023

- feat: update plugin audits [`984f0d2`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/984f0d243b8cc805ff9f1e84b393ea600a1ebcb0)
- Release 1.2.2 [`c3a411a`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/c3a411a743d433f5dc61724ea92fb405bd620f55)
- chore: mode repo ref [`49f89a9`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/49f89a9acfe9b26a62e4779cc396ea52a23ca0cf)

#### [1.2.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.2.0...1.2.1)

> 23 November 2023

- fix: error in file [`45cbb17`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/45cbb176f95029e96cbf35c32e94b85c64148d90)
- Release 1.2.1 [`d1bdd7a`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/d1bdd7a3b01775d2484efd338506bb523aa0109f)
- fix: fix test local [`e0dd193`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/e0dd193bb2427d85f1a42596f057c9d7ea378a37)

#### [1.2.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.1.1...1.2.0)

> 19 November 2023

- chore: update [`08fe732`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/08fe732c3814fcef701718f1d9934b6972e4796f)
- feat: new audit TheGreenWebFoundation [`bb3a05e`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/bb3a05ef458a54c68f6b24902f973077e816c514)
- chore: disabled metrics [`ddcc106`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/ddcc106f7d7b95ff99f76dc5580d441e947bff3a)

#### [1.1.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.1.0...1.1.1)

> 18 November 2023

- chore: fix release-it version file [`9c0a942`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/9c0a9420808b18e4e9feb0e3bb49791c7ca5c007)
- test: implements mocha tests [`f0bbc80`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/f0bbc8097796b309073f60188f989518d5da59fb)
- Changed: Update description with url to ecoindex site [`57e023d`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/57e023d33d6b61229e95a1995e58b785199636a6)

#### [1.1.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.0.8...1.1.0)

> 17 November 2023

- feat: test local example [`81597eb`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/81597eb626a86f7dbedb3780927b38c81eda7ea1)
- feat: rm gathered to use plugin with lhci and lightouse [`3b7509c`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/3b7509c523ebb315d646682e53a0d11f06f7bfe6)
- feat: lhci example [`153ab1b`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/153ab1b917f56491365d8200f8c3ddf320d9c1f4)

#### [1.0.8](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.0.7...1.0.8)

> 16 November 2023

- feat: new example WIP [`8ed95e0`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/8ed95e00c9f7347b9d82de73a98ca139adcd6bea)
- chore: refacto [`16f1784`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/16f1784d9c0681d71f5e0c5215d183557243c29e)
- chore: add changelog [`0ee5f62`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/0ee5f623e9d9f1764b65312872d7e8465761ab00)

#### [1.0.7](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.0.6...1.0.7)

> 15 November 2023

- chore: add auto-changelog [`b854232`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/b85423230480a83c31b7b7046c8a2d6354b897d9)
- Release 1.0.7 [`c2ddbc3`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/c2ddbc3165eee885d08c5afd11262270654d21be)
- Lighthouse run [`d8ad090`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/d8ad0906186d6baf683cbbc5283a1579d093efa2)

#### [1.0.6](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.0.5...1.0.6)

> 15 November 2023

- fix: error on audits [`e7ac97a`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/e7ac97a2757761438ec5cd63058423c3cace98fe)
- Release 1.0.6 [`bf2f2ca`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/bf2f2ca5da28aeaa5be3af522d042e139df9be89)
- doc: update TODO list [`0c1e3fe`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/0c1e3fecc5523ce2b6e45a9721fdc3b3349e89eb)

#### [1.0.5](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.0.4...1.0.5)

> 15 November 2023

- chore: change licence [`c63e3c5`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/c63e3c573d00f58b9af6f13a9d46f9ce11f666e7)
- doc: update documentation [`bcf9c2d`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/bcf9c2dabbd3ea95b53d5552c0b0c4b9e6b75f9f)
- Release 1.0.5 [`3350022`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/335002251566d60147d89da847290c4c73327f2e)

#### [1.0.4](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.0.3...1.0.4)

> 14 November 2023

- fix: add missing package [`8f795a6`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/8f795a6ebb75e5b2a4772b54e4e97388c401b456)
- chore: add licence [`e236af4`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/e236af4abc7470340117850dfb99ce32dcc7293c)
- doc: update readme [`a88a20d`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/a88a20d3894ba95cef5fb9b906e64d5f46e3c96d)

#### [1.0.3](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.0.2...1.0.3)

> 14 November 2023

- Release 1.0.3 [`763682e`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/763682e8ecaad9a2b9abd26e563d3d9066537cef)
- fix: package [`9064979`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/90649798f8c6aeeab8ee23419ff19d6a53ec99d8)

#### [1.0.2](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.0.1...1.0.2)

> 14 November 2023

- test: change source ecoindex package [`6caace2`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/6caace2ab29f791216d94f0a052b636c9d78ced3)
- tests: add new test to run lib locally before npm publish [`bd4cae4`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/bd4cae42de01026806481998a7c336bdc3924f6b)
- feat: add new bp print-css [`d5eb55f`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/d5eb55f4fa0b5d42131946f4fb71a7c14a481599)

#### [1.0.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/1.0.0...1.0.1)

> 9 November 2023

- doc: update [`ee59434`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/ee59434c4f289107655fe999a0f685764fc9b900)
- feat: typofix [`41fbc6f`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/41fbc6f0bf31a56a29d869cc351e4e5b1a12f2a9)
- doc: add examples [`d835e52`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/d835e5235b03b87dfd81d3ae9b434eb6fb539fa3)

### [1.0.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.3.2...1.0.0)

> 9 November 2023

- doc: clean [`c6e3c40`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/c6e3c40d065da7368fdf1bc3703819263600ebb1)
- doc: example [`ffaa3ea`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/ffaa3eaebe6205fe3fcebb65b1538ef63f564743)
- feat: update plugin [`94f2142`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/94f2142ce78860803977d2df040dd8434eef04fe)

#### [0.3.2](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.3.1...0.3.2)

> 9 November 2023

- Release 0.3.2 [`ce93aa0`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/ce93aa0b4e6271e4c65247e926e280bc0037e3ac)
- feat: change bin [`77b40f1`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/77b40f1ef481f3ef6f17c5567448121eda25af2b)

#### [0.3.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.3.0...0.3.1)

> 9 November 2023

- fix: add bin [`b88cdd8`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/b88cdd88ccec5ef5da0a712292d41950ab630b21)
- Release 0.3.1 [`3c3c9d8`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/3c3c9d8e92e17c449b177307c8d88ffd343c1b41)

#### [0.3.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.2.6...0.3.0)

> 9 November 2023

- Release 0.3.0 [`871d10a`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/871d10ae97719e444e75ae2929b372eb2394d4c5)
- feat: add bin [`92f00c3`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/92f00c3deaccc173ffbadd51de6be7619e1e1b82)

#### [0.2.6](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.2.5...0.2.6)

> 9 November 2023

- feat: add helper to plugin [`5b3d90d`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/5b3d90d976ee6b79dc2dd85f0cc638bb3eb224aa)
- feat: finished script 🔥 [`edcbb90`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/edcbb904f7a3fdb8cdfdfcd1621f7eed4b943ca8)
- feat: enabled extra-header [`db459d6`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/db459d6a4f67ba17a9bd1dcf128a3718ee5218e2)

#### [0.2.5](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.2.4...0.2.5)

> 7 November 2023

- doc: clean [`40ccbcd`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/40ccbcd3bf144bd327f7fa4da19693a62db6db85)
- Release 0.2.5 [`4d3e51b`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/4d3e51b9b1e983a420061a99ad271d9b8476f6af)

#### [0.2.4](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.2.3...0.2.4)

> 7 November 2023

- chore: upgrade versions of node and lighthouse [`00bdb79`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/00bdb7943ebaea2aba0cb3cb2a7344ac3c1c8bf9)
- feat: fix and document [`3d8a561`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/3d8a5613814eda8fcf923cfeb1c5b2d3c1da4edb)
- Release 0.2.4 [`122180b`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/122180b6beef46f14af8d5d0c478bc2679753600)

#### [0.2.3](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.2.2...0.2.3)

> 6 November 2023

- test: update test and pass to depreceated most of theim [`48410f4`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/48410f44b2b6ecc860f329714f9b9c90191ce798)
- feat: update plugin to use the Ecoindex nodes mesure method 🔥 [`9088217`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/908821770c443a2f0e9322e0756c3bd486573156)
- chore: update conf project [`ba7e871`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/ba7e87172de309619374624b6149214726d300ed)

#### [0.2.2](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.2.1...0.2.2)

> 4 November 2023

- Release 0.2.2 [`3b60ff2`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/3b60ff2355a019cc660fefacb767ae611a2ec70d)
- doc: update images [`a7c7147`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/a7c7147321cb0faeae0826f0c8e07210d9bd34f0)

#### [0.2.1](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.2.0...0.2.1)

> 4 November 2023

- doc: update documentation [`e178eca`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/e178ecae3a773114860e7d55682d1d749556c17c)
- Release 0.2.1 [`2e495e3`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/2e495e377492dace6681cd8b8785a69de3047668)

#### [0.2.0](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.1.5...0.2.0)

> 4 November 2023

- feat: finished tests [`77bb4f1`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/77bb4f1c9268ea4b541128c82fc9aae818d4188e)
- new test [`40d2079`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/40d2079a2e736102121099da4ff9fa888a9af90d)
- Release 0.2.0 [`154de61`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/154de617e00a513ac3bfc7089fddb72c120b265f)

#### [0.1.5](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.1.4...0.1.5)

> 4 November 2023

- chore: better configuration [`20e294f`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/20e294fa216bb7e84f005273ca3d99fa7c649470)
- doc: change images [`0b62de2`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/0b62de207b7b61afe879c0278983cfb30a48fea8)
- Release 0.1.5 [`dde88b2`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/dde88b2e90c13fe62376f81c39447cf519a2f5b1)

#### [0.1.4](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.1.3...0.1.4)

> 4 November 2023

- chore: better configuration [`cfaf460`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/cfaf460ae7c12b031b00c0ca2eadd5deb47106e7)
- feat: better script [`16f63db`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/16f63dba8421eb3cd688aae881522df2ee3fe5a8)
- feat: better puppeteer script [`e1f22e2`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/e1f22e2989144b628983a814f2cbbb9171bf3849)

#### [0.1.3](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.1.2...0.1.3)

> 3 November 2023

- Release 0.1.3 [`e68a256`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/e68a2566ae59497bf71daf5c5798cbd270a24439)
- doc: fix image url [`2f3c653`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/2f3c65352f2e41633a3da477b3a4701604a23ae2)

#### [0.1.2](https://github.com/cnumr/lighthouse-plugin-ecoindex/compare/0.1.1...0.1.2)

> 3 November 2023

- doc: add images and docs [`5b91b90`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/5b91b90630a33db0eb1e5e344ade71a4a4fc528f)
- feat: tune configuration [`d0aa070`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/d0aa07037b1c3b14b3312511e43211834fad849a)
- Release 0.1.2 [`e13a76d`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/e13a76d4fb21dd13518228fa1a1050734e7e1461)

#### 0.1.1

> 3 November 2023

- feat: prep npm release [`2e7ba06`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/2e7ba06ae75aaa380b9fb007e58b42af5dbc4802)
- maniy things are working! [`8ea4e58`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/8ea4e5889b6cf9b2f07312323c3bc2531fffe02e)
- init [`8567747`](https://github.com/cnumr/lighthouse-plugin-ecoindex/commit/8567747036ca21f95db21381ba4bf8042a57fc05)
