// import browser from 'webextension-polyfill'
import { injectStyleFile } from '../common/utility'
import { carouselHandler, tabHandler } from '../common/steam-page'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const modules = [
  {
    // new releases
    module: '.top_capsules',
    carouselItems: '.newonsteam_headercaps',
    itemSelector: '.newonsteam_headercap'
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
  injectStyleFile('./assets/styles/steam-explore-new.css')

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    carouselHandler(module)
  }

  // under 20
  tabHandler('.home_specials_ctn.underten:nth-child(1)', '.special')

  // under 10
  tabHandler('.home_specials_ctn.underten:nth-child(2)', '.special')

  // specials container
  tabHandler('.home_tabs_content .tab_content', '.tab_item')
}

init()
