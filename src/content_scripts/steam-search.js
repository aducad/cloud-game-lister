import { delay, injectStyleFile } from '../common/utility'
import {
  buildGeForceIcon,
  checkDynamicContentInitialization,
  getGameInfo,
  runtimeContentHandler
} from '../libs/builders/steam-builder'
import {
  ICON_SIZE_CLASSES,
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE
} from '../common/constants'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

const observeRows = () => {
  const searchRowsSelector = '#search_resultsRows'
  runtimeContentHandler(
    searchRowsSelector,
    () => {
      buildIcons()
    },
    false,
    { childList: true }
  )
}

const buildIcons = async () => {
  await delay(500)
  const appIdList = []
  const appLinks = document.querySelectorAll('.search_result_row:not(.cgl-applied)')
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
  for (let index = 0; index < games.length; index++) {
    const game = games[index]
    const { appid } = game
    const appRowSelector = `.search_result_row.cgl-applied[data-ds-appid="${appid}"]`
    const appRow = document.querySelector(appRowSelector)
    const logoContainer = buildGeForceIcon(game, ICON_SIZE_CLASSES.MEDIUM)
    appRow.classList.add('cgl-item-added')
    appRow.appendChild(logoContainer)
  }
}

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css', true)

  // build icons for static items
  await buildIcons()
  observeRows()

  const searchResultsSelector = '#search_results'
  await checkDynamicContentInitialization(searchResultsSelector, 50)
  runtimeContentHandler(
    searchResultsSelector,
    async () => {
      buildIcons()
      observeRows()
    },
    false,
    { childList: true }
  )
}

init()
