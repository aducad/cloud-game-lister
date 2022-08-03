import { injectStyleFile } from '../common/utility'
import {
  staticContentHandler,
  dynamicContentHandler,
  runtimeContentHandler,
  buildGeForceIcon,
  getGameInfo,
  steamAppIdExtractorFromUrl
} from '../libs/builders/steam-builder'
import {
  ICON_SIZE_CLASSES,
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE
} from '../common/constants'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

const modules = [
  {
    // main slider
    module: '#genre_large_cluster',
    itemSelector: 'a',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  },
  {
    // new top sellers
    module: `#page_section_container .page_content_ctn:nth-child(1)`
  },
  {
    // new top sellers
    module: `#page_section_container .page_content_ctn:nth-child(2)`
  },
  {
    // recommended special offers
    itemsContainerSelector: '.contenthub_specials_grid_cell',
    module: '.contenthub_specials_ctn'
  },
  {
    // live streams
    module: '.live_streams_ctn',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  }
]

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
              '[class*="animated_featured_capsule_FeatureCtn"],[class*="salepreviewwidgets_SaleItemBrowserRow"],[class*="salepreviewwidgets_OuterCapsuleContainer"]'
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

const handleTab = (id) => {
  staticContentHandler({
    contentSelector: id,
    itemSelector: '.tab_item'
  })
}

const staticObservableModules = [
  {
    selector: '#NewReleasesRows'
  },
  {
    selector: '#TopSellersRows'
  },
  {
    selector: '#ConcurrentUsersRows'
  },
  {
    selector: '#ComingSoonRows'
  }
]

const init = async () => {
  // inject style file
  await injectStyleFile('./assets/styles/index.css')

  // build icons for static items
  observeRows()

  // carousel modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    dynamicContentHandler(module)
  }

  // static observable modules
  for (let i = 0; i < staticObservableModules.length; i++) {
    const staticObservableModule = staticObservableModules[i]
    const { selector } = staticObservableModule
    handleTab(selector)
    runtimeContentHandler(
      selector,
      () => {
        handleTab(selector)
      },
      false,
      {
        childList: true
      }
    )
  }
}

init()
