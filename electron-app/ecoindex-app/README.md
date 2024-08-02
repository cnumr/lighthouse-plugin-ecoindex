# Ecoindex-app

## Informations

-   ElectronJS / Electron Forge with `template=webpack-typescript`
-   React
-   TailwindCSS

## TODO

-   [ ] Set icon
-   [ ] Build on OS
    -   [x] Mac (sign with Apple Dev)
    -   [ ] Windows
    -   [ ] Linux
-   [ ] Auto build with CI/CD
-   [ ] Translate
-   [x] Create simple mesure
-   [ ] ~~Use path /usr/bin and /usr/bin/which to launch node `/usr/bin/which node` and npm `/usr/bin/which npm` action~~
-   [x] Fix not showing buttons to install plugin
    -   [x] handler for install plugin
-   [x] Fix not showing buttons to install Node
    -   [x] handler for install Node
-   [x] Create complex mesure
    -   [x] Save JSON on disk
        -   [x] Fix extra-header not JSON
    -   [x] Read/Reload JSON from disk (doing)
    -   [x] Use JSON to display data
    -   [x] Launch mesure from JSON (save before)

# Help links

-   https://github.com/electron/forge/issues/3558#issuecomment-2163993613
-   https://www.electronforge.io/guides/code-signing/code-signing-macos
-   https://support.apple.com/en-us/102654
-   https://help.apple.com/xcode/mac/current/#/dev3a05256b8
-   https://felixrieseberg.com/codesigning-electron-apps-in-ci/
-   https://github.com/electron/osx-sign
-   https://docs.github.com/en/actions/deployment/deploying-xcode-applications/installing-an-apple-certificate-on-macos-runners-for-xcode-development
-   https://github.com/electron/forge/issues/3315
-   https://github.com/sneljo1/auryo/blob/5180622e43d236feaebd00013f3d78e93f02cac1/internals/scripts/add-osx-cert.sh

# osx package win32

`brew install mono`
`brew install xquartz`
`brew install --cask --no-quarantine wine-stable`

`export PATH=$PATH:/Library/Frameworks/Mono.framework/Versions/Current/bin/mono`
`brew install p7zip`

`npm run make -- --platform=win32`

## wine proxy

`chmod  +x wine_proxy/wine`
