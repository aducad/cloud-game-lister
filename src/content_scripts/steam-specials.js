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
    iconSizeClass: ICON_SIZE_CLASSES.XLARGE
  },
  {
    module: '.carousel_container.paging_capsules.featured_items'
  },
  {
    // friends recently purchased (right panel)
    module: '.carousel_container paging_capsules.featured_items:nth-child(1)'
  },
  {
    // daily deal top
    module: '.contenthub_dailydeal_container', // change selector
    itemsContainerSelector: '',
    itemSelector: '.dailydeal_cap'
  },
  {
    // specials_container
    module: '#specials_container',
    itemsContainerSelector: '.contenthub_specials_grid'
  }
]

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  staticContentHandler({
    contentSelector: '.tab_content_ctn.sub',
    itemSelector: '.tab_item'
  })

  // modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    dynamicContentHandler(module)
  }
}

init()
