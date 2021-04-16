import { injectStyleFile } from '../common/utility'
import { staticContentHandler, dynamicContentHandler } from '../libs/builders/steam-builder'
import {
  ICON_SIZE_CLASSES,
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE
} from '../common/constants'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

const modules = [
  {
    // main slider
    module: '#genre_large_cluster',
    itemSelector: 'a',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  },
  {
    // new top sellers
    module: `#page_section_container .page_content_ctn:nth-child(1)`
  },
  {
    // new top sellers
    module: `#page_section_container .page_content_ctn:nth-child(2)`
  },
  {
    // recommended special offers
    itemsContainerSelector: '.contenthub_specials_grid_cell',
    module: '.contenthub_specials_ctn'
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
    dynamicContentHandler(module)
  }

  // tabs handler
  staticContentHandler({
    contentSelector: '.tab_content_ctn',
    itemSelector: '.tab_item'
  })
}

init()
