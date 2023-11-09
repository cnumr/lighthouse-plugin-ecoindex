# npx-example

## Usage

```bash
npx lighthouse-plugin-ecoindex --help
```

```bash
Options:
      --version       Show version number                              [boolean]
  -d, --demo          Use demo URLs.                  [boolean] [default: false]
  -u, --urls          URLs to process. Comma separated.                  [array]
  -f, --urls-file     Input file path. 1 url per line.                  [string]
  -h, --extra-header  Extra object config for Lighthouse. JSON string or path to
                       a JSON file.                     [string] [default: null]
  -p, --output-path   Output folder.             [string] [default: "./reports"]
  -o, --output        Reporter for the results, supports multiple values. choice
                      s: "json", "html". Ex: json,html. WARN: "csv" is not avala
                      ilable with flow.             [string] [default: ["html"]]
      --help          Show help                                        [boolean]
```
