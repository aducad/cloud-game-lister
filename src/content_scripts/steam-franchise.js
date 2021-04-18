import { injectStyleFile } from '../common/utility'
import {
  buildGeForceIcon,
  checkDynamicContentInitialization,
  dynamicContentHandler,
  getGameInfo,
  runtimeContentHandler
} from '../libs/builders/steam-builder'
import {
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE,
  ICON_SIZE_CLASSES
} from '../common/constants'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

const modules = [
  {
    // featured games
    module: '#featured_list_0'
  },
  {
    // featured games
    module: '#featured_list_1',
    itemSelector: 'a.app_impression_tracked'
  },
  {
    // featured games
    module: '#featured_list_2',
    itemSelector: 'a.app_impression_tracked'
  },
  {
    // featured games
    module: '#featured_list_3',
    itemSelector: 'a.app_impression_tracked'
  },
  {
    // featured games
    module: '#featured_list_4',
    itemSelector: 'a.app_impression_tracked'
  },
  {
    module: '#featured_carousel_2',
    itemSelector: 'a.app_impression_tracked'
  },
  {
    module: '#featured_carousel_0',
    itemSelector: '.app_impression_tracked'
  },
  {
    // top sellers
    module: '#featured_carousel_1'
  },
  {
    module: '#featured_carousel_2'
  },
  {
    module: '#featured_carousel_3'
  },
  {
    module: '#featured_carousel_4'
  }
]

const handleContent = async (contentSelector) => {
  await checkDynamicContentInitialization(contentSelector, 50)
  const itemSelector = '.recommendation_link'
  const appIdList = []
  const rows = document.querySelectorAll(
    `${contentSelector} :not(.cgl-item-added) ${itemSelector}`
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
    const appRowSelector = `.recommendation_link[href*="app/${appid}"]`
    const appRow = document.querySelector(appRowSelector)
    const container = appRow.closest('.recommendation')
    const broadcastIcon = container.querySelector('.broadcast_live_stream_icon')
    const logoContainer = buildGeForceIcon(game, ICON_SIZE_CLASSES.LARGE)
    container.classList.add('cgl-item-added')
    container.classList.add('cgl-left-10')
    container.classList.add('cgl-top-15')
    if (broadcastIcon) {
      container.classList.add('cgl-broadcasting')
      container.classList.add('cgl-broadcasting-large')
    }
    container.appendChild(logoContainer)
  }
}

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    dynamicContentHandler(module)
  }

  const contentSelector = '#RecommendationsRows'
  handleContent(contentSelector)

  runtimeContentHandler(
    contentSelector,
    () => {
      handleContent(contentSelector)
    },
    false,
    {
      childList: true
    }
  )
}

init()
