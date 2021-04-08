import browser from 'webextension-polyfill'
import { GET_APPS_INFO } from '../common/keys'
import { buildGeForceIcon } from '../common/icon-builder'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const injectStyleFile = () => {
  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.type = 'text/css'
  style.href = browser.extension.getURL('./assets/styles/steam-main.css')
  document.head.append(style)
}

const getApplicationInfo = async ids => {
  const games = await browser.runtime.sendMessage({ type: GET_APPS_INFO, ids })
  return games
}

const checkMainCarouselInitialization = () => {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const carouselItems = document.querySelectorAll(
        '#home_maincap_v7 .store_main_capsule'
      )
      if (carouselItems.length > 0) {
        clearInterval(interval)
        resolve(carouselItems)
      }
    }, 100)
  })
}

const mainCarouselHandler = async () => {
  const carouselItems = await checkMainCarouselInitialization()
  const ids = []
  for (let index = 0; index < carouselItems.length; index++) {
    const carouselItem = carouselItems[index]
    const { dsAppid } = carouselItem.dataset
    // no need to check packages
    if (!dsAppid || dsAppid.indexOf(',') !== -1) {
      continue
    }
    ids.push(dsAppid)
  }
  const games = await getApplicationInfo(ids)
  for (let index = 0; index < games.length; index++) {
    const game = games[index]
    const logoContainer = buildGeForceIcon(game)
    const carouselItem = document.querySelector(
      `#home_maincap_v7 .carousel_items [data-ds-appid="${game.appid}"]`
    )
    if (carouselItem) {
      carouselItem.classList.add('cgl-item-added')
      carouselItem.appendChild(logoContainer)
    }
  }
}

const spotlightCarouselHandler = async () => {
  const items = document.querySelectorAll(
    '#spotlight_carousel .carousel_items .home_area_spotlight, #spotlight_carousel .carousel_items .store_capsule'
  )
  const ids = []
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    const { dsAppid } = item.dataset

    if (!dsAppid || dsAppid.indexOf(',') !== -1) {
      continue
    }
    ids.push(dsAppid)
  }
  const games = await getApplicationInfo(ids)
  for (let index = 0; index < games.length; index++) {
    const game = games[index]

    const logoContainer = buildGeForceIcon(game)
    const carouselItem = document.querySelector(
      `#spotlight_carousel .carousel_items [data-ds-appid="${game.appid}"]`
    )
    if (carouselItem) {
      carouselItem.classList.add('cgl-item-added')
      carouselItem.appendChild(logoContainer)
    }
  }
}

const homeTabsHandler = async () => {
  const ids = []
  const tabItems = document.querySelectorAll('.home_tabs_content .tab_item')
  for (let index = 0; index < tabItems.length; index++) {
    const tabItem = tabItems[index]
    const { dsAppid } = tabItem.dataset

    if (!dsAppid || dsAppid.indexOf(',') !== -1) {
      continue
    }
    ids.push(dsAppid)
  }
  const games = await getApplicationInfo(ids)

  for (let index = 0; index < games.length; index++) {
    const game = games[index]

    const carouselItems = document.querySelectorAll(
      `.home_tabs_content .tab_item[data-ds-appid="${game.appid}"]`
    )
    for (let i = 0; i < carouselItems.length; i++) {
      const logoContainer = buildGeForceIcon(game)
      const carouselItem = carouselItems[i]
      carouselItem.classList.add('cgl-item-added')
      carouselItem.appendChild(logoContainer)
    }
  }
}

const start = async () => {
  injectStyleFile()

  // main carousel handler
  mainCarouselHandler()

  // spotlight carousel handler
  spotlightCarouselHandler()

  // tabs handler
  homeTabsHandler()
}

start()
