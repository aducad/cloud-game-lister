import browser from 'webextension-polyfill'
import KEYS from '../common/keys'
import { delay } from '../common/utility'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const FETCH_INTERVAL_HOURS = 24
const HOUR_IN_MILLISECONDS = 60 * 60 * 1000
const DAY_IN_MILLIISECONDS = FETCH_INTERVAL_HOURS * HOUR_IN_MILLISECONDS
const WEEK_IN_MILLIISECONDS = 7 * DAY_IN_MILLIISECONDS
const GAME_LIST_URL =
  'https://static.nvidiagrid.net/supported-public-game-list/locales/gfnpc-en-US.json?JSON'
const STORES = ['Steam']
const FETCH_ATTEMPT_LIMIT = 3
const FETCH_ATTEMPT_DELAY = 500

let appList = []
let fetchTimeOut

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

const fetchGames = async () => {
  for (let i = 0; i < FETCH_ATTEMPT_LIMIT; i++) {
    try {
      const gamesData = await fetch(GAME_LIST_URL).then(i => i.json())
      return gamesData
    } catch {
      await delay(FETCH_ATTEMPT_DELAY)
    }
  }
}

/**
 * Initialization methods for background script
 */
const init = async () => {
  try {
    // clear timeout before calling again
    clearTimeout(fetchTimeOut)
    const gamesData = await fetchGames()
    if (!gamesData) {
      throw 'FETCH_ERROR'
    }
    const { applications } = await browser.storage.local.get({
      applications: []
    })
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

    const lastRead = new Date().getTime()
    await browser.storage.local.set({ applications: appids, lastRead })
  } catch (error) {
    if (error === 'FETCH_ERROR') {
      browser.notifications.create(null, {
        type: 'basic',
        title: 'Fetch Error',
        message: `An error occurred while fetching the game list, will be retry after ${FETCH_INTERVAL_HOURS} hours or you can try in popup page by clicking "Fetch Games" button`,
        iconUrl: '/assets/icons/128x128-logo.png'
      })
    }
  } finally {
    fetchTimeOut = setTimeout(() => {
      // if attempt successful or fetch error attempt count exceeded we set the default
      init()
      // TODO:  Add to settings
    }, DAY_IN_MILLIISECONDS)
  }
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
        let anyNewGame = true
        let newGames = appList.filter(app => app.isNew)
        // set all games to array if there is no new game
        if (newGames.length === 0) {
          newGames = [...appList]
          anyNewGame = false
        }
        // randomize games array
        newGames.sort(() => {
          return Math.random() < 0.5 ? 1 : -1
        })
        const games = newGames.filter((_, index) => index < 5)
        resolve({ games, anyNewGame })
      })
    }
    case KEYS.FETCH_GAMES: {
      return new Promise(async resolve => {
        init()
        resolve()
      })
    }
    default: {
      return new Promise(async (_, reject) => {
        reject()
      })
    }
  }
}

// On Web Request Complete Handler
const onWebRequestCompleteHandler = async details => {
  if (process.env.NODE_ENV === 'development') {
    console.log(details)
  }
  const { tabId, type } = details
  if (type === 'xmlhttprequest') {
    // wait for the page dom handling (maybe this should check in the content_script)
    await delay(250)
    await browser.tabs.sendMessage(tabId, {
      type: KEYS.SEARCH_COMPLETED
    })
  }
  //
}
// ##### Listeners

// Runtime On Message Listener
browser.runtime.onMessage.addListener(onRuntimeMessageHandler)

// On Web Request Complete Listener
browser.webRequest.onCompleted.addListener(onWebRequestCompleteHandler, {
  urls: ['*://store.steampowered.com/search/results*']
})

init()
