import { injectStyleFile } from '../common/utility'
import {
  staticContentHandler,
  dynamicContentHandler
} from '../libs/builders/steam-builder'
import { ICON_SIZE_CLASSES } from '../common/constants'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const modules = [
  {
    // new top sellers
    module: `.carousel_container.paging_capsules.featured_items:nth-child(1)`
  },
  {
    // new top sellers
    module: `.carousel_container.paging_capsules.featured_items:nth-child(2)`
  },
  {
    // main slider
    module: '#genre_large_cluster',
    itemSelector: 'a',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  },
  {
    // live streams
    module: '.live_streams_ctn'
  }
]

const init = async () => {
  // inject style file
  await injectStyleFile('./assets/styles/index.css')

  // carousel modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    dynamicContentHandler(module)
  }

  // tabs handler
  staticContentHandler({
    contentSelector: '.tab_content_ctn',
    itemSelector: '.tab_item'
  })

  // specials container
  staticContentHandler({
    contentSelector: '#specials_container',
    itemSelector: '.store_capsule',
    iconSizeClass: ICON_SIZE_CLASSES.SMALL
  })
}

init()
