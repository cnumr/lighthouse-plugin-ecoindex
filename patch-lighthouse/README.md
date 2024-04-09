# Lighthouse and @lhci/cli patcher

## Installation and update dependencies

- do `npm i` to add `patch-package` and `lighthouse @lhci`

## Add new code

In `src` you'll find templates
- in `core`, you'll find the new Gatherer, `DOMInformations` ;
- in `types` you'll find an updated version of an existing file, `artifacts.d.ts` do not use directely, update the file as described bellow!

> How to update to generate patches?

In updated version of `node_modules/lighthouse` and `node_modules/@lhci/cli/node_modules/lighthouse` the code are not patched, you must do it.

1. `DOMInformations` has to be simply copied in 
- /workspace/patch-lighthouse/node_modules/lighthouse/core/gather/gatherers
- /workspace/patch-lighthouse/node_modules/@lhci/cli/node_modules/lighthouse/core/gather/gatherers
2. `artifacts.d.ts` has to be updated in
- /workspace/patch-lighthouse/node_modules/lighthouse/types
- /workspace/patch-lighthouse/node_modules/@lhci/cli/node_modules/lighthouse/types

In `artifacts.d.ts` you must add in the declaration of the module `Artifact`:

```javascript
// ...
declare module Artifacts {
    // ...
    interface DOMInformations {
        lighthousePluginEcoindex: string;
        nodesBodyCount: number;
        nodesBodySVGChildsCount: number;
        nodesBodyWithoutSVGChildsCount: number;
    }
    // ...
}
// ...
```

> Code update and files must be added in lighthouse AND @lhci/cli, you must update both!

### Create patches

run:
- `npx patch-package lighthouse` or `npm run lighthouse` (script are configured in `package.json`) ;
- `npx patch-package @lhci/cli/lighthouse` or `npm run lhci` (script are configured in `package.json`).

### Use patches

- Create or updates folders where patches must be applied.
- run `npx patch-package` or add this script `"postinstall": "patch-package"` in your `package.json` and they'll be applied when you make some `npm i ...`.