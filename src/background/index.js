import browser from 'webextension-polyfill'

import { IS_DEV_MODE } from '../common/config'
import KEYS from '../common/keys'

const DAY_IN_MILLIISECONDS = 24 * 60 * 60 * 1000
let appList = []
const GAME_LIST_URL =
  'https://static.nvidiagrid.net/supported-public-game-list/locales/gfnpc-en-US.json?JSON'

// ##### Methods

const init = async () => {
  console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

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
  setTimeout(() => {
    init()
  }, DAY_IN_MILLIISECONDS)
}

// ##### Handlers

// Runtime On Message Handler
const onRuntimeMessageHandler = (request, sender) => {
  const { type, info } = request
  if (type === 'SIGN_CONNECT') {
    return true
  }
  if (IS_DEV_MODE && info) {
    console.log({ sender, type })
  }
  switch (type) {
    case KEYS.STEAM_GAMEPAGE_SCRIPT_LOADED: {
      return new Promise(async resolve => {
        const { appID } = request
        const game = appList.find(app => app.appid === appID)
        resolve({ game })
      })
    }
    case KEYS.GET_APPS_INFO: {
      return new Promise(async resolve => {
        const { ids } = request
        const games = appList.filter(app => ids.includes(app.appid))
        resolve(games)
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

// Runtime On Message Listener
browser.runtime.onMessage.addListener(onRuntimeMessageHandler)

init()
