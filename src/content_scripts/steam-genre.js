import { injectStyleFile } from '../common/utility'
import { tabHandler, carouselHandler } from '../common/steam-page'
import { ICON_SIZE_CLASSES } from '../common/constants'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const modules = [
  {
    // new top sellers
    module: `#page_section_container .page_content_ctn:nth-child(1)`
  },
  {
    // new top sellers
    module: `#page_section_container .page_content_ctn:nth-child(2)`
  },
  {
    // main slider
    module: '#genre_large_cluster',
    itemSelector: 'a',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  },
  {
    // live streams
    module: '.live_streams_ctn',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  }
]

const init = async () => {
  // inject style file
  await injectStyleFile('./assets/styles/index.css')

  // carousel modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    carouselHandler(module)
  }

  // tabs handler
  tabHandler('.tab_content_ctn', '.tab_item')
}

init()
