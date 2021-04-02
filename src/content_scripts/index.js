import browser from 'webextension-polyfill'

import { IS_DEV_MODE } from '../common/config'
import { CONTENT_SCRIPT_LOADED } from '../common/keys'
import { delay } from '../common/utility'
import logger from '../common/logger-builder'

const start = async () => {
  await delay()
  logger.info('Content script started...')
  logger.warning(`running on ${IS_DEV_MODE ? 'dev' : 'production'} mode`)
  const { message } = await browser.runtime.sendMessage({
    type: CONTENT_SCRIPT_LOADED
  })
  logger.info(`Background script response: ${message}`)
}

start()
