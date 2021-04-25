#!/usr/bin/env node
/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

const manifestFile = require('../src/manifest.json')
const packageFile = require('../package.json')

const DEST_DIR = path.join(__dirname, '../dist')
const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip')

const makeDestZipDirIfNotExists = () => {
  if (!fs.existsSync(DEST_ZIP_DIR)) {
    fs.mkdirSync(DEST_ZIP_DIR)
  }
}

const checkFileIsExist = (dest, zipFilename) => {
  const filePath = path.join(dest, zipFilename)
  console.info(`Checking file "${filePath}"`)

  if (fs.existsSync(filePath)) {
    throw new Error(`File already exist: ${filePath}`)
  }
}

const buildZip = (src, dist, zipFilename) => {
  console.info(`Building ${zipFilename}...`)
  const output = fs.createWriteStream(path.join(dist, zipFilename))
  const archive = archiver('zip')
  archive.pipe(output)
  archive.directory(src, false)
  archive.finalize()
}

const main = () => {
  const { version, name } = packageFile
  const zipFilename = `${name}-${version}.zip`
  checkFileIsExist(DEST_ZIP_DIR, zipFilename)
  makeDestZipDirIfNotExists()

  buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
  console.info(`Build completed succesfully`)
}

main()
