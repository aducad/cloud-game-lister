import { injectStyleFile } from '../common/utility'
import {
  staticContentHandler,
  dynamicContentHandler
} from '../libs/builders/steam-builder'
import { ICON_SIZE_CLASSES } from '../common/constants'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

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
  // {
  //   // daily deal bottom
  //   module: '.dailydeal_ctn:nth-child(4)', // change selector
  //   itemsContainerSelector: '',
  //   itemSelector: '.dailydeal_cap'
  // },
  // {
  //   // contenthub_spotlight_ctn
  //   module: '#spotlight_scroll',
  //   itemsContainerSelector: '',
  //   itemSelector: '.home_area_spotlight'
  // },
  {
    // specials_container
    module: '#specials_container',
    itemsContainerSelector: '.contenthub_specials_grid',
    iconSizeClass: ICON_SIZE_CLASSES.SMALL
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
