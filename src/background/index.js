import browser from 'webextension-polyfill'

import { IS_DEV_MODE } from '../common/config'
import { CONTENT_SCRIPT_LOADED } from '../common/keys'
import { EXAMPLE_PATTERN } from '../common/match.patterns'
import { delay } from '../common/utility'
import logger from '../common/logger-builder'

const onWebRequestCompletedConfig = {
  urls: [
    /* *** Make sure you add the links to your manifest file *** */
    EXAMPLE_PATTERN
  ]
}
// ##### Methods

const init = async () => {
  await delay(1)
  logger.warning(`Running on "${IS_DEV_MODE ? 'DEV' : 'PRODUCTION'}" mode`)
  logger.info('Background script started...')
}

// ##### Handlers

// On Install Handler
const onInstallHandler = async installDetails => {
  await browser.storage.local.set({})
  logger.info(installDetails)
}

// On Web Request Completed Handler
const onWebRequestCompletedHandler = async webRequestDetails => {
  logger.info(webRequestDetails)
}

// On Runtime Message Handler
const onRuntimeMessageHandler = (request, sender) => {
  const { type, info } = request
  if (type === 'SIGN_CONNECT') {
    return true
  }
  if (IS_DEV_MODE && info) {
    logger.info({ sender, type })
  }
  switch (type) {
    case CONTENT_SCRIPT_LOADED: {
      return new Promise(async resolve => {
        logger.info('Content script loaded')
        resolve({ message: 'Are you sure?' })
      })
    }
    default: {
      return new Promise(async resolve => {
        resolve({ message: 'Default resolver' })
      })
    }
  }
}

// ##### Listeners

// On Install Listener
browser.runtime.onInstalled.addListener(onInstallHandler)

// On Web Request Completede Listener
browser.webRequest.onCompleted.addListener(
  onWebRequestCompletedHandler,
  onWebRequestCompletedConfig
)

// On Runtime Message Listener
browser.runtime.onMessage.addListener(onRuntimeMessageHandler)

init()
