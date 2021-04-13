import browser from 'webextension-polyfill'
import { GET_APPS_INFO } from '../../common/keys'
import { GEFORCENOW_ICONS, ICON_SIZE_CLASSES } from '../../common/constants'

const isDev = process.env.NODE_ENV === 'development'
const MutationObserver =
  window.MutationObserver || window.WebKitMutationObserver

/**
 * Build geforce now icon
 * @param {Object} game
 * @param {String} iconSizeClass
 * @returns html element
 */
const buildGeForceIcon = (game, iconSizeClass) => {
  let imagePath = GEFORCENOW_ICONS.ACTIVE
  const gameData = { ...game }
  if (!game) {
    imagePath = GEFORCENOW_ICONS.PASSIVE
  } else if (gameData.status !== 'AVAILABLE') {
    imagePath = GEFORCENOW_ICONS.MAINTENANCE
  }

  const iconPath = browser.runtime.getURL(`assets/icons/${imagePath}.png`)
  const isOptimizedText = gameData.isFullyOptimized ? 'Yes' : 'No'
  const gameStatus = gameData.status || 'Not Available'
  const title = `Status: ${gameStatus}\nIs Fully Optimized?: ${isOptimizedText}`

  // logo container
  const logoContainer = document.createElement('div')
  logoContainer.title = title
  logoContainer.classList.add('cgl-logo-container')
  logoContainer.classList.add(`cgl-icon-${iconSizeClass}`)

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

const applyDevelopmentStyles = mainSelector => {
  if (!isDev) {
    return
  }
  const moduleElement = document.querySelector(mainSelector)
  if (moduleElement) {
    moduleElement.style.border = '2px solid red'
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
 * @param {Array} ids
 * @param {String} module
 * @param {String} itemSelector
 */
const buildIcons = async (
  ids,
  module,
  itemSelector,
  iconSizeClass = ICON_SIZE_CLASSES.MEDIUM
) => {
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
    const joinedItemSelector = currentSelectors.join(',')
    const items = document.querySelectorAll(joinedItemSelector)
    for (let i = 0; i < items.length; i++) {
      const logoContainer = buildGeForceIcon(game, iconSizeClass)
      const carouselItem = items[i]
      if (carouselItem.querySelector('.broadcast_live_stream_icon')) {
        carouselItem.classList.add('cgl-broadcasting')
      }
      carouselItem.classList.add('cgl-item-added')
      carouselItem.appendChild(logoContainer)
    }
  }
}

const staticContentHandler = ({
  contentSelector,
  itemSelector,
  iconSizeClass = ICON_SIZE_CLASSES.MEDIUM
}) => {
  applyDevelopmentStyles(contentSelector)
  const ids = getAppIdList(`${contentSelector} ${itemSelector}`)
  buildIcons(ids, contentSelector, itemSelector, iconSizeClass)
}

/**
 * This fuction getting a param for
 * @param {String} selector
 */
const checkDynamicContentInitialization = selector => {
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

// dynamic builder
/**
 *
 * @param {Object} settings
 */
const dynamicContentHandler = async ({
  module,
  itemsContainerSelector = '.carousel_items',
  itemSelector = '.store_capsule',
  iconSizeClass = ICON_SIZE_CLASSES.MEDIUM
}) => {
  await checkDynamicContentInitialization()
  applyDevelopmentStyles(module)
  const currentSelectors = []
  const selectors = itemSelector.split('|')
  for (let s = 0; s < selectors.length; s++) {
    const selector = selectors[s]
    const currentSelector = `${module} ${itemsContainerSelector} ${selector}`
    currentSelectors.push(currentSelector)
  }
  const carouselItemSelector = currentSelectors.join(',')
  const ids = getAppIdList(carouselItemSelector)
  buildIcons(ids, module, itemSelector, iconSizeClass)
}

// runtime builder
/**
 *
 * @param {String} selector
 * @param {Function} callback
 */
const runtimeContentHandler = (selector, callback) => {
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
  dynamicContentHandler,
  runtimeContentHandler,
  staticContentHandler
}
