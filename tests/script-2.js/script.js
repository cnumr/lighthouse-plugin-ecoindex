// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const fs = require('fs')
const path = require('path')

/**
 * Runs lighthouse cli with custom config.
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('urls-file', {
      alias: 'f',
      type: 'string',
      description: 'Input Urls file path',
    })
    .option('urls', {
      alias: 'u',
      type: 'string',
      description: 'URLs to process',
    })
    .describe(
      '??',
      'You can use all the options from Lighthouse CLI, see https://github.com/GoogleChrome/lighthouse',
    )
    .help().argv

  const filePath = argv['urls-file']
  const urls = argv['urls'] ? argv['urls'].split(',') : null

  if (!filePath && !urls) {
    console.error(
      'Please provide a file path (--urls-file=) or URLs (--urls=https://www.example.com,https://www.example1.com) as an argument',
    )
    process.exit(1)
  }

  if (!yargs.argv.configPath) {
    // Avoid duplicating the option
    const configPath = require.resolve('./config.mjs')
    process.argv.push(`--config-path=${configPath}`)
  }

  if (!yargs.argv.throttlingMethod) {
    // Enable simulation.
    process.argv.push('--throttling-method=simulate')
  }

  if (!yargs.argv.chromeFlags) {
    // TODO: merge if extra flags are specified
    process.argv.push('--chrome-flags=--headless')
  }
  // if (!yargs.argv.output) {
  //   process.argv.push('--output=json')
  // }

  // @ts-ignore let LH handle the CLI
  const { begin } = await import('lighthouse/cli/bin.js')

  if (filePath) {
    const resolvedPath = path.resolve(filePath)

    fs.readFile(resolvedPath, 'utf8', async (err, data) => {
      // Make this function async
      if (err) {
        console.error(`Error reading file from disk: ${err}`)
      } else {
        const fileUrls = data.split('\n')

        for (let index = 0; index < fileUrls.length; index++) {
          const url = fileUrls[index]
          if (url.trim() !== '') {
            console.log(`URL ${index + 1}: ${url}`)
            process.argv.push(url)
            console.log('process.argv', process.argv)
            await begin()
            process.argv.pop()
          }
        }
      }
    })
  } else {
    for (let index = 0; index < urls.length; index++) {
      const url = urls[index]
      if (url.trim() !== '') {
        console.log(`URL ${index + 1}: ${url}`)
        process.argv.push(url)
        console.log('process.argv', process.argv)
        await begin()
        process.argv.pop()
      }
    }
  }
}

if (require.main == module) {
  main()
}
