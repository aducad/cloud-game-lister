import { injectStyleFile } from '../common/utility'
import {
  buildGeForceIcon,
  checkDynamicContentInitialization,
  runtimeContentHandler,
  getGameInfo
} from '../libs/builders/steam-builder'
import {
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE,
  ICON_SIZE_CLASSES
} from '../common/constants'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  // class names created dynamically
  const contentSelector =
    '[class^="interactiverecommender_RecommendationList"] [class^="interactiverecommender_List"]'
  await checkDynamicContentInitialization(contentSelector, 50)

  runtimeContentHandler(
    contentSelector,
    async () => {
      const itemSelector = '[class^="interactiverecommender_RecommendationEntry"]'
      const appIdList = []
      const rows = document.querySelectorAll(
        `${contentSelector} ${itemSelector}:not([data-cgl-applied="true"])`
      )
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index]
        const paths = new URL(row.attributes.href.value).pathname.split('/').filter((i) => i)
        row.dataset.cglApplied = true
        if (paths.length > 1) {
          appIdList.push(paths[1])
        }
      }
      const games = await getGameInfo(appIdList)
      for (let index = 0; index < games.length; index++) {
        const game = games[index]
        const { appid } = game
        const appRowSelector = `[class^="interactiverecommender_RecommendationEntry"][href*="app/${appid}"]`
        const appRow = document.querySelector(appRowSelector)
        const logoContainer = buildGeForceIcon(game, ICON_SIZE_CLASSES.LARGE)
        appRow.dataset.cglItemAdded = true
        appRow.appendChild(logoContainer)
      }
    },
    false,
    {
      childList: true
    }
  )
}

init()
