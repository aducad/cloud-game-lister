import browser from 'webextension-polyfill'
import KEYS from '../common/keys'
import { delay } from '../common/utility'
import { CHANGELOG_URL } from '../common/config'
import { CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE } from '../common/constants'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

const MANIFEST_FILE = browser.runtime.getManifest()
const HOUR_IN_MILLISECONDS = 60 * 60 * 1000
const DAY_IN_MILLIISECONDS = 24 * HOUR_IN_MILLISECONDS
const WEEK_IN_MILLIISECONDS = 7 * DAY_IN_MILLIISECONDS
const GAME_LIST_URL =
  'https://static.nvidiagrid.net/supported-public-game-list/locales/gfnpc-en-US.json?JSON'
const ON_WEB_REQUEST_COMPLETE_SETTINGS = {
  urls: ['*://store.steampowered.com/search/results*']
}
const STORES = ['Steam']
const FETCH_ATTEMPT_LIMIT = 3
const FETCH_ATTEMPT_DELAY = 5000

let appList = []
let fetchTimeOutId
let settings = {
  notifyOnFetchError: true,
  notifyOnUpdate: true,
  openChangelogOnUpdate: true,
  gameUpdateInterval: 2
}

// ##### Methods

/**
 * @param {String} title
 * @param {String} message
 */
const createNotification = async (title, message) => {
  await browser.notifications.create(null, {
    type: 'basic',
    title,
    message,
    iconUrl: '/assets/icons/128x128-logo.png'
  })
}

/**
 * Gets user settings from storage
 */
const getSettings = async () => {
  settings = await browser.storage.local.get({
    notifyOnFetchError: true,
    notifyOnUpdate: true,
    openChangelogOnUpdate: true,
    gameUpdateInterval: 2
  })
}

/**
 * @param {String} url
 * @returns steam application id
 */
const parseSteamAppIdFromUrl = (url) => {
  const paths = url.split('/')
  let appid = ''
  if (paths.length > 0) {
    appid = paths[paths.length - 1]
  }
  return appid
}

/**
 * @param {String} previousVersion
 * @param {String} reason
 */
const notifyUserForUpdate = async (previousVersion, reason) => {
  let showNotification = true
  let openChangelog = true
  if (reason === 'update') {
    await getSettings()
    showNotification = settings.notifyOnUpdate
    openChangelog = settings.openChangelogOnUpdate
  }
  if (showNotification) {
    const { version, name } = MANIFEST_FILE
    createNotification(
      'Extension Updated',
      `${name} has been updated from version ${previousVersion} to version ${version}`
    )
  }
  if (openChangelog) {
    browser.tabs.create({
      url: CHANGELOG_URL
    })
  }
}

/**
 * @returns Array of applications
 */
const fetchGames = async () => {
  for (let i = 0; i < FETCH_ATTEMPT_LIMIT; i++) {
    try {
      const gamesData = await fetch(GAME_LIST_URL).then((i) => i.json())
      return gamesData
    } catch (err) {
      await delay(FETCH_ATTEMPT_DELAY)
    }
  }
}

/**
 * @param {Array} rawData array of applications raw data
 * @param {Array} applications array of normalized old applications data
 * @returns Array of normalized applications
 */
const normalizeGamesData = (rawData, applications) => {
  const currentTime = new Date().getTime()
  const filteredApplications = rawData.filter((i) => STORES.includes(i.store))
  const applicationList = filteredApplications.map((game) => {
    const currentGame = game
    const { steamUrl: url, id } = currentGame
    delete currentGame.steamUrl
    const application = applications.find((application) => application.id === id)
    let time = currentTime
    if (application) {
      time = application.time
    }
    const diff = currentTime - time
    const isNew = WEEK_IN_MILLIISECONDS > diff
    const appid = parseSteamAppIdFromUrl(url)
    return { ...game, url, appid, time, isNew }
  })
  return applicationList
}

/**
 * Initialization methods for background script
 */
const init = async () => {
  try {
    // clear timeout before calling again
    clearTimeout(fetchTimeOutId)
    const { applications: previousApplications } = await browser.storage.local.get({
      applications: []
    })
    appList = [...previousApplications]

    const gamesData = await fetchGames()
    if (!gamesData) {
      throw 'FETCH_ERROR'
    }

    const applications = normalizeGamesData(gamesData, previousApplications)
    appList = [...applications]

    const lastRead = new Date().getTime()
    await browser.storage.local.set({
      applications,
      lastRead
    })
  } catch (error) {
    if (error === 'FETCH_ERROR' && settings.notifyOnFetchError) {
      const errorMessage = `An error occurred while fetching the game list, will be retry after ${settings.gameUpdateInterval} hours or you can try in popup page by clicking "Fetch Games" button`
      createNotification('Fetch Error', errorMessage)
    }
  } finally {
    fetchTimeOutId = setTimeout(() => {
      // if attempt successful or fetch error attempt count exceeded we set the default
      init()
    }, settings.gameUpdateInterval * HOUR_IN_MILLISECONDS)
  }
}

// ##### Handlers

/**
 * Storage changed handler
 */
const onStorageChangedHandler = async () => {
  getSettings()
}

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
      return new Promise(async (resolve) => {
        const { appID } = request
        const game = appList.find((app) => app.appid === appID)
        resolve({ game })
      })
    }
    case KEYS.GET_APPS_INFO: {
      return new Promise(async (resolve) => {
        const { ids } = request
        const games = appList.filter((app) => ids.includes(app.appid))
        resolve(games)
      })
    }
    case KEYS.GET_APPS: {
      return new Promise(async (resolve) => {
        resolve({ appList })
      })
    }
    case KEYS.GET_APPS_COUNT: {
      return new Promise(async (resolve) => {
        resolve({ appsCount: appList.length })
      })
    }
    case KEYS.GET_NEW_APPS: {
      return new Promise(async (resolve) => {
        let anyNewGame = true
        let newGames = appList.filter((app) => app.isNew)
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
      return new Promise(async (resolve) => {
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

/**
 * Web request complete handler
 * @param {Object} details
 */
const onWebRequestCompleteHandler = async (details) => {
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

/**
 * Install Handler
 * @param {Object} details
 */
const onInstalledHandler = async (details) => {
  const { previousVersion, reason } = details
  notifyUserForUpdate(previousVersion, reason)
}

// ##### Listeners

// On Storage Changed Listener
browser.storage.onChanged.addListener(onStorageChangedHandler)

// Runtime On Message Listener
browser.runtime.onMessage.addListener(onRuntimeMessageHandler)

// On Web Request Complete Listener

browser.webRequest.onCompleted.addListener(
  onWebRequestCompleteHandler,
  ON_WEB_REQUEST_COMPLETE_SETTINGS
)

// On Installed Listener
browser.runtime.onInstalled.addListener(onInstalledHandler)

init()
