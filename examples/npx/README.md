# npx-example

## Usage

```bash
npx lighthouse-plugin-ecoindex --help
```

## More documentation and examples of usage.

- https://github.com/NovaGaia/lighthouse-plugin-ecoindex#readme

## Examples

- help: `npx lighthouse-plugin-ecoindex --help`
- demo: `npx lighthouse-plugin-ecoindex -d`
- urls: `npx lighthouse-plugin-ecoindex -u https://www.ecoindex.fr`
- urls: `npx lighthouse-plugin-ecoindex -u https://www.ecoindex.fr -u https://www.ecoindex.fr/comment-ca-marche/`
- urls-file: `npx lighthouse-plugin-ecoindex -f ./example-urls-list`
- urls-file + extra-header: `npx lighthouse-plugin-ecoindex -f ./example-urls-list -h ./example-extra-header.json`
- urls-file + extra-header + output-path: `npx lighthouse-plugin-ecoindex -f ./example-urls-list -h ./example-extra-header.json -p ./example-output-path`
- urls-file + extra-header + output-path + output: `npx lighthouse-plugin-ecoindex -f ./example-urls-list -h ./example-extra-header.json -p ./example-output-path -o json -o html`
