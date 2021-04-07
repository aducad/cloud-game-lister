import browser from 'webextension-polyfill'

import { IS_DEV_MODE } from '../common/config'
import KEYS from '../common/keys'
import logger from '../common/logger-builder'

const mode = IS_DEV_MODE ? 'DEV' : 'PRODUCTION'
const DAY_IN_MILLIISECONDS = 24 * 60 * 60 * 1000
let appList = []
const GAME_LIST_URL =
  'https://static.nvidiagrid.net/supported-public-game-list/locales/gfnpc-en-US.json?JSON'

// ##### Methods

const init = async () => {
  logger.info(`Background script running on "${mode}" mode...`)

  const gamesData = await fetch(GAME_LIST_URL).then(i => i.json())
  appList = gamesData
    .filter(i => i.store === 'Steam')
    .map(game => {
      const paths = game.steamUrl.split('/')
      let appid = ''
      if (paths.length > 0) {
        appid = paths[paths.length - 1]
      }
      return { ...game, appid }
    })
  // console.log(appList)
  setTimeout(() => {
    init()
  }, DAY_IN_MILLIISECONDS)
}

// ##### Handlers

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
    case KEYS.STEAM_GAMEPAGE_SCRIPT_LOADED: {
      return new Promise(async resolve => {
        const { appID } = request
        const game = appList.find(app => app.appid === appID)
        resolve({ game })
      })
    }
    case KEYS.GET_APPS: {
      return new Promise(async resolve => {
        resolve({ appList })
      })
    }
    default: {
      return new Promise(async (_, reject) => {
        reject()
      })
    }
  }
}

// ##### Listeners

// On Runtime Message Listener
browser.runtime.onMessage.addListener(onRuntimeMessageHandler)

init()
