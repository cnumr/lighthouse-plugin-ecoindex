# npx-example

## Usage

```bash
npx lighthouse-plugin-ecoindex --help
```

## More documentation and examples of usage.

- https://github.com/NovaGaia/lighthouse-plugin-ecoindex#readme

## Examples

- help: `npx lighthouse-ecoindex --help`
- demo: `npx lighthouse-ecoindex -d`
- urls: `npx lighthouse-ecoindex -u https://www.ecoindex.fr`
- urls: `npx lighthouse-ecoindex -u https://www.ecoindex.fr -u https://www.ecoindex.fr/comment-ca-marche/`
- urls-file: `npx lighthouse-ecoindex -f ./example-urls-list`
- urls-file + extra-header: `npx lighthouse-ecoindex -f ./example-urls-list -h ./example-extra-header.json`
- urls-file + extra-header + output-path: `npx lighthouse-ecoindex -f ./example-urls-list -h ./example-extra-header.json -p ./example-output-path`
- urls-file + extra-header + output-path + output: `npx lighthouse-ecoindex -f ./example-urls-list -h ./example-extra-header.json -p ./example-output-path -o json -o html`
