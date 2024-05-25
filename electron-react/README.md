### electron-react-starter

This is a starter template that I made for myself while learning electron. It is a modified version of the [Vite + Typescript](https://www.electronforge.io/templates/vite-+-typescript) template from electron-forge.

In addition to the template, React has been added to the renderer. TailwindCSS and shadcn-ui have also been set up.

To install the depencies and run the app in dev mode:

```
yarn
yarn start
```

To package and distribute the app:

```
yarn package
yarn make
yarn publish
```

This corresponds to the 3 build commands available via electron-forge CLI. For more information, see electron-forge's [documentation](https://www.electronforge.io/core-concepts/build-lifecycle).
