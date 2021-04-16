// import browser from 'webextension-polyfill'
import { injectStyleFile } from '../common/utility'
import { dynamicContentHandler, staticContentHandler } from '../libs/builders/steam-builder'
import {
  ICON_SIZE_CLASSES,
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE
} from '../common/constants'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

const modules = [
  {
    // new releases
    module: '.top_capsules',
    itemsContainerSelector: '.newonsteam_headercaps',
    itemSelector: '.newonsteam_headercap',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  },
  {
    // new top sellers
    module: `.bucket:nth-child(1)`,
    itemsContainerSelector: '.store_horizontal_autoslider'
  },
  {
    // new top sellers
    module: `.bucket:nth-child(2)`,
    itemsContainerSelector: '.store_horizontal_autoslider'
  },
  {
    // recommended new releases
    module: `.bucket:nth-child(3)`,
    itemsContainerSelector: '.store_horizontal_autoslider'
  }
]

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    dynamicContentHandler(module)
  }

  // under 20
  staticContentHandler({
    contentSelector: '.home_specials_ctn.underten:nth-child(1)',
    itemSelector: '.special'
  })

  // under 10
  staticContentHandler({
    contentSelector: '.home_specials_ctn.underten:nth-child(2)',
    itemSelector: '.special'
  })

  // specials container
  staticContentHandler({
    contentSelector: '.home_tabs_content .tab_content',
    itemSelector: '.tab_item'
  })
}

init()
