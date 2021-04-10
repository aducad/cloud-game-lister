import browser from 'webextension-polyfill'
import { GET_APPS_INFO } from '../common/keys'
import { buildGeForceIcon } from '../common/icon-builder'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const MutationObserver =
  window.MutationObserver || window.WebKitMutationObserver

/**
 * injecting css styles
 */
const injectStyleFile = () => {
  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.type = 'text/css'
  style.href = browser.extension.getURL('./assets/styles/steam-main.css')
  document.head.append(style)
}

/**
 * This fuction getting a param for
 * @param {String} selector
 */
const checkCarouselInitialization = selector => {
  return new Promise(resolve => {
    let increment = 0
    const interval = setInterval(() => {
      const item = document.querySelector(selector)
      if (item || ++increment > 10) {
        clearInterval(interval)
        resolve()
      }
    }, 100)
  })
}

/**
 *
 * @param {Array} ids
 * @returns list of the games as an object's array
 */
const getGameInfo = async ids => {
  const games = await browser.runtime.sendMessage({ type: GET_APPS_INFO, ids })
  return games
}

/**
 *
 * @param {Array} ids
 * @param {String} module
 * @param {String} itemSelector
 */
const buildIcons = async (ids, module, itemSelector) => {
  // console.log(module, ids)
  const games = await getGameInfo(ids)
  for (let index = 0; index < games.length; index++) {
    const game = games[index]
    const { appid } = game
    const selectors = itemSelector.split('|')
    const currentSelectors = []
    for (let s = 0; s < selectors.length; s++) {
      const selector = selectors[s]
      const currentSelector = `${module} ${selector}[data-ds-appid="${appid}"]`
      currentSelectors.push(currentSelector)
    }
    const carouselItemSelector = currentSelectors.join(',')
    const carouselItems = document.querySelectorAll(carouselItemSelector)
    for (let i = 0; i < carouselItems.length; i++) {
      const logoContainer = buildGeForceIcon(game)
      const carouselItem = carouselItems[i]
      carouselItem.classList.add('cgl-item-added')
      carouselItem.appendChild(logoContainer)
    }
  }
}

/**
 *
 * @param {String} selector
 * @returns An array of collected game ids
 */
const getAppIdList = selector => {
  const ids = []
  const tabItems = document.querySelectorAll(selector)
  for (let index = 0; index < tabItems.length; index++) {
    const tabItem = tabItems[index]
    const { dsAppid } = tabItem.dataset

    if (!dsAppid || dsAppid.indexOf(',') !== -1) {
      continue
    }
    ids.push(dsAppid)
  }
  return ids
}

/**
 *
 * @param {String} selector
 * @param {Function} callback
 */
const observeCarousel = (selector, callback) => {
  const observer = new MutationObserver(() => {
    observer.disconnect()
    callback()
  })
  const rootElement = document.querySelector(selector)
  if (rootElement) {
    observer.observe(rootElement, {
      childList: true,
      subtree: true
    })
  }
}

/**
 *
 * @param {Object} settings
 */
const carouselHandler = async ({
  module,
  carouselItems = '.carousel_items',
  itemSelector = '.store_capsule'
}) => {
  await checkCarouselInitialization()
  const ids = getAppIdList(`${module} ${carouselItems} ${itemSelector}`)
  buildIcons(ids, module, itemSelector)
}

const mainCarouselHandler = async () => {
  await checkCarouselInitialization('#home_maincap_v7 .store_main_capsule')
  const ids = getAppIdList('#home_maincap_v7 .store_main_capsule')
  buildIcons(ids, '#home_maincap_v7', '.store_main_capsule')
}

const spotlightCarouselHandler = async () => {
  const spotlightSelector =
    '#spotlight_carousel .carousel_items .home_area_spotlight,#spotlight_carousel .carousel_items .store_capsule'
  const ids = getAppIdList(spotlightSelector)
  buildIcons(ids, '#spotlight_carousel', '.home_area_spotlight|.store_capsule')
}

const homeTabsHandler = async () => {
  const ids = getAppIdList('.home_tabs_content .tab_item')
  buildIcons(ids, '.home_tabs_content', '.tab_item')
}

const initializeApp = async () => {
  // inject style file
  injectStyleFile()

  // main carousel handler
  mainCarouselHandler()

  // spotlight carousel handler
  spotlightCarouselHandler()

  // community recommendations
  const communityRecommendations = {
    module: '#module_community_recommendations',
    itemSelector: '.community_recommendation_capsule'
  }
  carouselHandler(communityRecommendations)

  // deep dive
  const deepDive = {
    module: '#module_deep_dive'
  }
  carouselHandler(deepDive)

  // module recommender
  const recommender = {
    module: '#module_recommender'
  }
  carouselHandler(recommender)

  // recently updated
  const recentlyUpdatedBlock = {
    module: '.recently_updated_block'
  }
  observeCarousel('.recently_updated_block .carousel_items', () => {
    carouselHandler(recentlyUpdatedBlock)
  })

  // feature curators
  const featureCurators = {
    module: '#feature_curators_block_0'
  }
  observeCarousel('#steam_curators_not_empty', () => {
    carouselHandler(featureCurators)
  })

  // recommended creators
  const recommendedCreators = {
    module: '.recommended_creators_ctn'
  }
  carouselHandler(recommendedCreators)

  // friends recently purchased
  const friendsRecentlyPurchased = {
    module: '.friends_recently_purchased'
  }
  observeCarousel('.friends_recently_purchased .carousel_items', () => {
    carouselHandler(friendsRecentlyPurchased)
  })

  // specials under 10
  const specialsUnder10 = {
    module: '.specials_under10'
  }
  carouselHandler(specialsUnder10)

  // marketing message area
  const marketingmessageArea = {
    module: '.home_ctn.marketingmessage_area',
    carouselItems: '.marketingmessage_container',
    itemSelector: '.home_marketing_message'
  }
  carouselHandler(marketingmessageArea)

  // tabs handler
  homeTabsHandler()
}

initializeApp()
