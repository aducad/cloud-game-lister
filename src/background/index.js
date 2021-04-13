import browser from 'webextension-polyfill'
import KEYS from '../common/keys'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const DAY_IN_MILLIISECONDS = 24 * 60 * 60 * 1000
const WEEK_IN_MILLIISECONDS = 7 * DAY_IN_MILLIISECONDS
const GAME_LIST_URL =
  'https://static.nvidiagrid.net/supported-public-game-list/locales/gfnpc-en-US.json?JSON'
const STORES = ['Steam']

let appList = []

// ##### Methods

/**
 *
 * @param {String} url
 * @returns steam application id
 */
const parseSteamAppIdFromUrl = url => {
  const paths = url.split('/')
  let appid = ''
  if (paths.length > 0) {
    appid = paths[paths.length - 1]
  }
  return appid
}

/**
 * Initialization methods for background script
 */
const init = async () => {
  const gamesData = await fetch(GAME_LIST_URL).then(i => i.json())
  const { applications } = await browser.storage.local.get({ applications: [] })
  const currentTime = new Date().getTime()
  appList = gamesData
    .filter(i => STORES.includes(i.store))
    .map(game => {
      const { steamUrl } = game
      const appid = parseSteamAppIdFromUrl(steamUrl)
      const application = applications.find(
        application => application.id === appid
      )
      let time = currentTime
      if (application) {
        time = application.time
      }
      const diff = currentTime - time
      const isNew = WEEK_IN_MILLIISECONDS > diff
      return { ...game, appid, time, isNew }
    })

  const appids = appList.map(i => {
    return {
      id: i.appid,
      time: i.time
    }
  })
  await browser.storage.local.set({ applications: appids })
  setTimeout(() => {
    init()
    // TODO:  Add to settings
  }, DAY_IN_MILLIISECONDS)
}

// ##### Handlers

/**
 * Runtime message handler
 * @param {Object} request
 * @param {Object} sender
 */
const onRuntimeMessageHandler = (request, sender) => {
  const { type, info } = request
  // check for webextension-pollyfill
  if (type === 'SIGN_CONNECT') {
    return true
  }
  if (info && process.env.NODE_ENV === 'development') {
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
    case KEYS.GET_APPS_COUNT: {
      return new Promise(async resolve => {
        resolve({ appsCount: appList.length })
      })
    }
    case KEYS.GET_NEW_APPS: {
      return new Promise(async resolve => {
        let newGames = appList.filter(app => app.isNew)
        // set all games to array if there is no new game
        if (newGames.length === 0) {
          newGames = [...appList]
        }
        // randomize games array
        newGames.sort(() => {
          return Math.random() < 0.5 ? 1 : -1
        })
        const games = newGames.filter((_, index) => index < 5)
        resolve({ games })
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
