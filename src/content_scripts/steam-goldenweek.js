import { injectStyleFile } from '../common/utility'
import {
  buildGeForceIcon,
  getGameInfo,
  runtimeContentHandler,
  steamAppIdExtractorFromUrl
} from '../libs/builders/steam-builder'
import {
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE,
  ICON_SIZE_CLASSES
} from '../common/constants'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

const observeRows = () => {
  runtimeContentHandler(
    'body',
    async () => {
      const ids = []
      const appLinks = document.querySelectorAll('[href*="/app/"]:not(.cgl-applied)')
      for (let i = 0; i < appLinks.length; i++) {
        const appLink = appLinks[i]
        const url = appLink.attributes.href.value
        const appid = steamAppIdExtractorFromUrl(url)
        if (appid) {
          ids.push(appid)
        }
        appLink.classList.add('cgl-applied')
      }
      const appIdList = [...new Set(ids)]
      if (appIdList.length > 0) {
        const games = await getGameInfo(appIdList)
        for (let index = 0; index < games.length; index++) {
          const game = games[index]
          const { appid } = game
          const appRowSelector = `[href*="/app/${appid}"].cgl-applied`
          const appRows = document.querySelectorAll(appRowSelector)
          for (let i = 0; i < appRows.length; i++) {
            const appRow = appRows[i]
            const parent = appRow.closest(
              '[class*="salepreviewwidgets_SaleItemBrowserRow"],[class*="salepreviewwidgets_OuterCapsuleContainer"]'
            )
            if (!parent || parent.querySelector('.cgl-logo-container')) {
              continue
            }
            parent.classList.add('cgl-item-added')
            const logoContainer = buildGeForceIcon(game, ICON_SIZE_CLASSES.MEDIUM)
            parent.appendChild(logoContainer)
          }
        }
      }
    },
    false,
    { childList: true, subtree: true }
  )
}

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  // build icons for static items
  observeRows()
}

init()
