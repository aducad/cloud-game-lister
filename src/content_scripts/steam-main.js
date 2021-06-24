import { injectStyleFile } from '../common/utility'
import {
  staticContentHandler,
  dynamicContentHandler,
  runtimeContentHandler,
  getGameInfo,
  buildGeForceIcon
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
    module: '#home_maincap_v7',
    itemSelector: '.store_main_capsule',
    iconSizeClass: ICON_SIZE_CLASSES.XLARGE
  },
  {
    // spotlight carousel handler
    module: '#spotlight_carousel',
    itemSelector: '.home_area_spotlight|.store_capsule',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  },
  {
    // community recommendations
    module: '#module_community_recommendations',
    itemSelector: '.community_recommendation_capsule',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  },
  {
    // giant single curator capsule
    module: '.giant_curator_capsule',
    itemsContainerSelector: '',
    itemSelector: '.curator_giant_capsule'
  },
  {
    // recommended by curators
    module: '#apps_recommended_by_curators_v2',
    itemsContainerSelector: ' > div'
  },
  {
    // deep dive
    module: '#module_deep_dive'
  },
  {
    // module recommender
    module: '#module_recommender'
  },
  {
    // recommended creators
    module: '.recommended_creators_ctn'
  },
  {
    // specials under 10
    module: '.specials_under10'
  },
  {
    // marketing message area
    module: '.home_ctn.marketingmessage_area',
    itemsContainerSelector: '.marketingmessage_container',
    itemSelector: '.home_marketing_message'
  },
  {
    // top new releases
    module: '#module_top_new_releases'
  },
  // 2021 sale
  // #home_browsemore_carousel2 özel yapılacak
  {
    // #topsellers_tier
    module: '#topsellers_tier',
    itemsContainerSelector: '',
    itemSelector: '.sale_capsule'
  }
]

const observableModules = [
  {
    // recently updated
    settings: { module: '.recently_updated_block' },
    rootSelector: '.recently_updated_block .carousel_items'
  },
  {
    // feature curators
    settings: {
      module: '#feature_curators_block_0'
    },
    rootSelector: '#steam_curators_not_empty'
  },
  {
    // friends recently purchased
    settings: { module: '.friends_recently_purchased' },
    rootSelector: '.friends_recently_purchased .carousel_items'
  },
  {
    // live streams
    settings: { module: '.live_streams_ctn' },
    rootSelector: '.live_streams_ctn .carousel_items'
  },
  // ##### 2021 sale #####
  {
    // #tier1_target
    settings: {
      module: '#tier1_target',
      itemsContainerSelector: '.salerow',
      itemSelector: '.sale_capsule'
    },
    rootSelector: '#tier1_target'
  },
  {
    // #tier2_target
    settings: {
      module: '#tier2_target',
      itemsContainerSelector: '.salerow',
      itemSelector: '.sale_capsule'
    },
    rootSelector: '#tier2_target'
  },
  {
    // #wishlist_tier
    settings: {
      module: '#wishlist_tier',
      itemsContainerSelector: '',
      itemSelector: '.sale_capsule'
    },
    rootSelector: '#wishlist_tier'
  },
  {
    // #sale_discounts_area
    settings: {
      module: '#sale_discounts_area',
      itemsContainerSelector: '.home_discount_games_ctn',
      itemSelector: '.sale_capsule'
    },
    rootSelector: '#sale_discounts_area'
  },
  {
    // #sale_category_blocks
    rootSelector: '#sale_category_blocks',
    settings: {
      module: '.home_category_games_ctn',
      itemsContainerSelector: '.salerow',
      itemSelector: '.sale_capsule'
    }
  },
  {
    // #sale_tag_categories
    rootSelector: '#sale_tag_categories',
    settings: {
      module: '.home_category_games_ctn',
      itemsContainerSelector: '.salerow',
      itemSelector: '.sale_capsule'
    }
  },
  {
    // .home_newupcoming_games_ctn
    rootSelector: '.home_newupcoming_games_ctn',
    settings: {
      module: '.home_newupcoming_games_ctn',
      itemsContainerSelector: '',
      itemSelector: '.sale_capsule'
    }
  }
]

const buildHeroRowsIcons = async () => {
  const appIdList = []
  const appLinks = document.querySelectorAll('.hero_row .hero_capsule a.hero_click_overlay')
  for (let i = 0; i < appLinks.length; i++) {
    const appLink = appLinks[i]
    appLink.classList.add('cgl-applied')
    const url = new URL(appLink.href)
    const appid = url.pathname.split('/').filter((s) => s)[1]
    appIdList.push(appid)
  }
  const games = await getGameInfo(appIdList)
  for (let index = 0; index < games.length; index++) {
    const game = games[index]
    const { appid } = game
    const appSelector = `.hero_row .hero_capsule a.hero_click_overlay[href*="/app/${appid}"]`
    const appRow = document.querySelector(appSelector)
    const logoContainer = buildGeForceIcon(game, ICON_SIZE_CLASSES.MEDIUM)
    appRow.classList.add('cgl-item-added')
    appRow.appendChild(logoContainer)
  }
}

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  // 2021 sale
  buildHeroRowsIcons()
  // 2021 sale

  // runtime contents
  for (let i = 0; i < observableModules.length; i++) {
    const { rootSelector, settings } = observableModules[i]
    runtimeContentHandler(rootSelector, () => {
      dynamicContentHandler(settings)
    })
  }

  // dynamic contents
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    dynamicContentHandler(module)
  }

  // tabs handler
  staticContentHandler({
    contentSelector: '.home_tabs_content',
    itemSelector: '.tab_item'
  })

  // footer scroll load more
  runtimeContentHandler(
    '#content_more',
    async () => {
      buildScrollIcons()
    },
    false,
    {
      childList: true
    }
  )
}

const buildScrollIcons = async () => {
  // Build Two Wide Module
  await staticContentHandler({
    contentSelector: '.home_content.twowide:not(.cgl-applied)',
    itemSelector: '.home_content_item'
  })

  // Build Four Wide Module
  await staticContentHandler({
    contentSelector: '.home_content.fourwide:not(.cgl-applied)',
    itemSelector: '.home_content_item'
  })

  // Build Single Module
  await staticContentHandler({
    contentSelector: '.home_content.single:not(.cgl-applied)',
    itemSelector: '.gamelink'
  })

  const containers = document.querySelectorAll(
    '.home_content:not(.cgl-applied),.home_content.single:not(.cgl-applied)'
  )

  // Apply cgl-applied class
  for (let i = 0; i < containers.length; i++) {
    const container = containers[i]
    container.classList.add('cgl-applied')
  }
}

init()
