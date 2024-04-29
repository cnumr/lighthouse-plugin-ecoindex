# How to contribute to this project

We'd love to accept your patches and contributions to this project. There are just a few small guidelines you need to follow.

# Development environment setup

Use VSCODE as your IDE with Docker and devcontainer extension installed.

The decontainer will setup the development environment for you. It will install all the necessary tools and dependencies (recommanded plugins, lighthouse server aka lhci preconfigured w/ bdd embed, etc).

Two versions of the devcontainer are available:
- `silicon/devcontainer.json` for Apple silicon M* processors — linux/amd64
- `intel/devcontainer.json` for Intel processors (NOT TESTED)

After you launched the devcontainer, you **NEED** to run the following commands to finish the setup of the development server:

```bash
sh /workspace/.devcontainer/commons/updateContentCommand/updateContentCommand.sh
```

# Elements
- `lighthouse-plugin-ecoindex/` folder contains the plugin code
- `examples-developpement-test/` folder contains the developpements to test the plugin for `lhci`, `lighthouse` and `npx lighthouse-plugin-ecoindex` commands
- `examples/` folder contains the examples of the plugin for `lhci`, `lighthouse` and `npx lighthouse-plugin-ecoindex` commands, for the documentation
- `docs` folder contains the documentation of the plugin

> Don't forget to sync the `examples-developpement-test/` folder with the `examples/` folder before pushing your changes and to update the documentation in the `docs` folder. If you change the devcontainer, don't forget to sync your updates to the `silicon` and `intel` folders.