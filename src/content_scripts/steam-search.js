import browser from 'webextension-polyfill'
import { SEARCH_COMPLETED } from '../common/keys'
import { delay, injectStyleFile } from '../common/utility'
import { buildGeForceIcon, getGameInfo } from '../libs/builders/steam-builder'
import {
  ICON_SIZE_CLASSES,
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE
} from '../common/constants'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

const init = () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css', true)
}

init()

const buildIcons = async () => {
  const appIdList = []
  const appLinks = document.querySelectorAll('.search_result_row:not(.cgl-applied)')
  await delay(500)
  for (let i = 0; i < appLinks.length; i++) {
    const appLink = appLinks[i]
    appLink.classList.add('cgl-applied')
    const { dsAppid } = appLink.dataset
    /// TODO: Handle Packages/Bundles
    if (!dsAppid || dsAppid.indexOf(',') !== -1) {
      continue
    }
    appIdList.push(dsAppid)
  }
  const games = await getGameInfo(appIdList)
  console.log(games)
  for (let index = 0; index < games.length; index++) {
    const game = games[index]
    const { appid } = game
    const appRowSelector = `.search_result_row.cgl-applied[data-ds-appid="${appid}"]`
    const appRow = document.querySelector(appRowSelector)
    const logoContainer = buildGeForceIcon(game, ICON_SIZE_CLASSES.MEDIUM)
    // if (appRow.querySelector('.broadcast_live_stream_icon')) {
    //   appRow.classList.add('cgl-broadcasting')
    // }
    appRow.classList.add('cgl-item-added')
    appRow.appendChild(logoContainer)
  }
}

const onRuntimeMessageHandler = (request, sender) => {
  const { type } = request
  if (type === 'SIGN_CONNECT') {
    return true
  }
  switch (type) {
    case SEARCH_COMPLETED: {
      return new Promise(async (resolve) => {
        console.time('buildIcons')
        buildIcons()
        console.timeEnd('buildIcons')
        resolve()
      })
    }
  }
}

browser.runtime.onMessage.addListener(onRuntimeMessageHandler)
