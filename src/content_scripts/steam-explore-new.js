// import browser from 'webextension-polyfill'
import { injectStyleFile } from '../common/utility'
import { carouselHandler, tabHandler } from '../common/steam-page'
import { ICON_SIZE_CLASSES } from '../common/constants'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const modules = [
  {
    // new releases
    module: '.top_capsules',
    carouselItems: '.newonsteam_headercaps',
    itemSelector: '.newonsteam_headercap',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  },
  {
    // new top sellers
    module: `.bucket:nth-child(1)`,
    carouselItems: '.store_horizontal_autoslider'
  },
  {
    // new top sellers
    module: `.bucket:nth-child(2)`,
    carouselItems: '.store_horizontal_autoslider'
  },
  {
    // recommended new releases
    module: `.bucket:nth-child(3)`,
    carouselItems: '.store_horizontal_autoslider'
  }
]

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    carouselHandler(module)
  }

  // under 20
  tabHandler(
    '.home_specials_ctn.underten:nth-child(1)',
    '.special',
    ICON_SIZE_CLASSES.SMALL
  )

  // under 10
  tabHandler(
    '.home_specials_ctn.underten:nth-child(2)',
    '.special',
    ICON_SIZE_CLASSES.SMALL
  )

  // specials container
  tabHandler('.home_tabs_content .tab_content', '.tab_item')
}

init()
