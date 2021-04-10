import browser from 'webextension-polyfill'
import { GET_APPS_INFO } from './keys'

const MutationObserver =
  window.MutationObserver || window.WebKitMutationObserver

/**
 * Build geforce now icon
 * @param {Object} game
 * @returns html element
 */
const buildGeForceIcon = game => {
  let imagePath = 'nvidia-128-active'
  const gameData = { ...game }
  if (!game) {
    imagePath = 'nvidia-128-passive'
  } else if (gameData.status !== 'AVAILABLE') {
    imagePath = 'nvidia-128-maintenance'
  }

  const iconPath = browser.runtime.getURL(`assets/icons/${imagePath}.png`)
  const isOptimizedText = gameData.isFullyOptimized ? 'Yes' : 'No'
  const gameStatus = gameData.status || 'Not Avaliable'
  const title = `
  Status: ${gameStatus}\nIs Fully Optimized?: ${isOptimizedText}
  `

  // logo container
  const logoContainer = document.createElement('div')
  logoContainer.title = title
  logoContainer.classList.add('cgl-logo-container')

  // create logo
  const logoImage = document.createElement('img')
  logoImage.src = iconPath
  logoImage.classList.add('cgl-logo')

  logoContainer.appendChild(logoImage)

  return logoContainer
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
 * @param {Array} ids
 * @param {String} module
 * @param {String} itemSelector
 */
const buildIcons = async (ids, module, itemSelector) => {
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

const tabHandler = (contentSelector, itemSelector) => {
  const ids = getAppIdList(`${contentSelector} ${itemSelector}`)
  buildIcons(ids, contentSelector, itemSelector)
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
 * @param {Object} settings
 */
const carouselHandler = async ({
  module,
  carouselItems = '.carousel_items',
  itemSelector = '.store_capsule'
}) => {
  await checkCarouselInitialization()
  const currentSelectors = []
  const selectors = itemSelector.split('|')
  for (let s = 0; s < selectors.length; s++) {
    const selector = selectors[s]
    const currentSelector = `${module} ${carouselItems} ${selector}`
    currentSelectors.push(currentSelector)
  }
  const carouselItemSelector = currentSelectors.join(',')
  const ids = getAppIdList(carouselItemSelector)
  buildIcons(ids, module, itemSelector)
}

/**
 *
 * @param {String} selector
 * @param {Function} callback
 */
const observeCarouselHandler = (selector, callback) => {
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

export {
  buildGeForceIcon,
  buildIcons,
  carouselHandler,
  checkCarouselInitialization,
  getAppIdList,
  getGameInfo,
  observeCarouselHandler,
  tabHandler
}
