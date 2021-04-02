#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const BUNDLE_DIR = path.join(__dirname, '../dist')
const bundles = [
    'background.js',
    'options.js',
    'popup.js',
    'list.js',
    'content_scripts/index.js',
]

const makeProduction = file =>
    new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err)
                return
            }
            const regex = /IS_DEV_MODE:!0/
            if (!regex.test(data)) {
                return
            }
            const newData = data.replace(regex, 'IS_DEV_MODE:false')
            fs.writeFile(file, newData, error => {
                if (error) {
                    reject(error)
                    return
                }
                resolve()
            })
        })
    })

const main = () => {
    bundles.forEach(bundle => {
        makeProduction(path.join(BUNDLE_DIR, bundle))
            .then(() => console.info(`Production bundle ${bundle}: OK`))
            .catch(console.error)
    })
}

main()
