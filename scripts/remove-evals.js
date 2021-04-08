#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const BUNDLE_DIR = path.join(__dirname, '../dist')
const bundles = [
  'background.js',
  'options.js',
  'popup.js',
  'list.js',
  'content_scripts/steam-main.js',
  'content_scripts/steam-game-detail.js'
]

const evalRegexForProduction = /;([a-z])=function\(\){return this}\(\);try{\1=\1\|\|Function\("return this"\)\(\)\|\|\(0,eval\)\("this"\)}catch\(t\){"object"==typeof window&&\(\1=window\)}/g
const evalRegexForDevelopment = /;\s*\/\/ This works in non-strict mode\s*([a-z])\s*=\s*\(\s*function\(\)\s*\{\s*return this;\s*}\)\(\);\s*try\s*{\s*\/\/\s*This works if eval is allowed(?:\s*|.+){1,14}/g

const removeEvals = file =>
  new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }

      const regex =
        process.env.NODE_ENV === 'production'
          ? evalRegexForProduction
          : evalRegexForDevelopment

      if (!regex.test(data)) {
        // reject(`No CSP specific code found in ${file}.`)
        return
      }

      // eslint-disable-next-line
      data = data.replace(regex, '=window;')
      // eslint-disable-next-line
      fs.writeFile(file, data, err => {
        if (err) {
          reject(err)
          return
        }

        resolve()
      })
    })
  })

const main = () => {
  bundles.forEach(bundle => {
    removeEvals(path.join(BUNDLE_DIR, bundle))
      .then(() => console.info(`Bundle ${bundle}: OK`))
      .catch(console.error)
  })
}

main()
