import browser from 'webextension-polyfill'
import { delay, injectStyleFile } from '../common/utility'
import {
  staticContentHandler,
  dynamicContentHandler,
  runtimeContentHandler
} from '../libs/builders/steam-builder'
import {
  ICON_SIZE_CLASSES,
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE
} from '../common/constants'
import { WEB_REQUEST_COMPLETED } from '../common/keys'

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
  }
]

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

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

const onRuntimeMessageHandler = (request, sender) => {
  const { type } = request
  if (type === 'SIGN_CONNECT') {
    return true
  }
  switch (type) {
    case WEB_REQUEST_COMPLETED: {
      return new Promise(async (resolve) => {
        buildScrollIcons()
        resolve()
      })
    }
  }
}

browser.runtime.onMessage.addListener(onRuntimeMessageHandler)

init()
