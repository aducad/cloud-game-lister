import browser from 'webextension-polyfill'
import { GET_APPS_INFO } from '../../common/keys'
import { GEFORCENOW_ICONS, ICON_SIZE_CLASSES } from '../../common/constants'

const isDev = process.env.NODE_ENV === 'development'
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver

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

  // logo container
  const logoContainer = document.createElement('div')
  logoContainer.classList.add('cgl-logo-container')
  logoContainer.classList.add(`cgl-icon-${iconSizeClass}`)
  logoContainer.addEventListener('mouseover', (e) => {
    // Tooltip Container Element
    let tooltipContainer = document.querySelector('#clg-tooltip-container')
    if (!tooltipContainer) {
      tooltipContainer = document.createElement('div')
      tooltipContainer.id = 'clg-tooltip-container'
      document.body.appendChild(tooltipContainer)
    }
    const clientRectangle = e.currentTarget.getBoundingClientRect()
    const { x, y } = clientRectangle
    tooltipContainer.style.top = `${y}px`
    tooltipContainer.style.left = `${x}px`
    tooltipContainer.style.marginTop = '-40px'
    const tooltipContent = e.currentTarget.querySelector('.clg-tooltip-content')
    tooltipContainer.appendChild(tooltipContent.cloneNode(true))
  })

  logoContainer.addEventListener('mouseleave', (e) => {
    // Tooltip Container Element
    let tooltipContainer = document.querySelector('#clg-tooltip-container')
    if (!tooltipContainer) {
      return
    }
    if (tooltipContainer.childNodes.length > 0) {
      tooltipContainer.innerHTML = ''
    }
  })

  // create logo
  const iconPath = browser.runtime.getURL(`assets/icons/${imagePath}.png`)
  const logoImage = document.createElement('img')
  logoImage.src = iconPath
  logoImage.classList.add('cgl-logo')

  logoContainer.appendChild(logoImage)

  const isOptimizedText = gameData.isFullyOptimized ? 'Yes' : 'No'
  const gameStatus = gameData.status || 'Not Available'

  // Tooltip Content Element
  const tooltipContent = document.createElement('div')
  tooltipContent.classList.add('clg-tooltip-content')

  // Tooltip Status Element
  const tooltipStatus = document.createElement('div')
  tooltipStatus.innerHTML = `Status: <strong>${gameStatus}</strong>`

  // Tooltip Optimization Element
  const tooltipOptimization = document.createElement('div')
  tooltipOptimization.innerHTML = `Is Fully Optimized?: <strong>${isOptimizedText}</strong>`

  tooltipContent.appendChild(tooltipStatus)
  tooltipContent.appendChild(tooltipOptimization)

  logoContainer.appendChild(tooltipContent)
  return logoContainer
}

/**
 *
 * @param {Array} ids
 * @returns list of the games as an object's array
 */
const getGameInfo = async (ids) => {
  const games = await browser.runtime.sendMessage({ type: GET_APPS_INFO, ids })
  return games
}

const applyDevelopmentStyles = (mainSelector) => {
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
const getAppIdList = (selector, dataAttributeKey = 'data-ds-appid') => {
  const ids = []
  const tabItems = document.querySelectorAll(selector)
  for (let index = 0; index < tabItems.length; index++) {
    const tabItem = tabItems[index]
    const appIdAttribute = tabItem.attributes[dataAttributeKey]
    if (!appIdAttribute) {
      continue
    }
    const appid = appIdAttribute.value
    if (!appid || appid.indexOf(',') !== -1) {
      continue
    }
    ids.push(appid)
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
  iconSizeClass = ICON_SIZE_CLASSES.MEDIUM,
  dataAppID = 'ds-appid'
) => {
  const games = await getGameInfo(ids)
  for (let index = 0; index < games.length; index++) {
    const game = games[index]
    const { appid } = game
    const selectors = itemSelector.split('|')
    const currentSelectors = []
    for (let s = 0; s < selectors.length; s++) {
      const selector = selectors[s]
      const currentSelector = `${module} ${selector}[${dataAppID}="${appid}"]`
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
  iconSizeClass = ICON_SIZE_CLASSES.MEDIUM,
  dataAttributeKey = 'data-ds-appid'
}) => {
  applyDevelopmentStyles(contentSelector)
  const ids = getAppIdList(`${contentSelector} ${itemSelector}`, dataAttributeKey)

  buildIcons(ids, contentSelector, itemSelector, iconSizeClass, dataAttributeKey)
}

/**
 * This fuction getting a param for
 * @param {String} selector
 */
const checkDynamicContentInitialization = (selector) => {
  return new Promise((resolve) => {
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
  iconSizeClass = ICON_SIZE_CLASSES.MEDIUM,
  dataAttributeKey = 'data-ds-appid'
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
  const ids = getAppIdList(carouselItemSelector, dataAttributeKey)
  buildIcons(ids, module, itemSelector, iconSizeClass, dataAttributeKey)
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
  getGameInfo,
  dynamicContentHandler,
  runtimeContentHandler,
  staticContentHandler
}
