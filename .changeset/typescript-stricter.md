---
'lighthouse-plugin-ecoindex-courses': patch
'lighthouse-plugin-ecoindex': patch
---

Fix TypeScript type inconsistencies and enable stricter compiler options

- `installMandatoryBrowser`: add default value `Browser.CHROMEHEADLESSSHELL` so it can be called without arguments
- `checkIfMandatoryBrowserInstalled`: correct return type from `InstalledBrowser | ''` to `InstalledBrowser | null`
- Enable `noUnusedLocals` and `noUnusedParameters` in all tsconfigs
