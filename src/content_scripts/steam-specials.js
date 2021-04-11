import { injectStyleFile } from '../common/utility'
import { tabHandler, carouselHandler } from '../common/steam-page'
import { ICON_SIZE_CLASSES } from '../common/constants'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const modules = [
  {
    module: '#genre_large_cluster',
    itemSelector: 'a',
    iconSizeClass: ICON_SIZE_CLASSES.XLARGE
  },
  {
    // friends recently purchased
    module: '.carousel_container paging_capsules.featured_items:nth-child(1)'
  },
  {
    // daily deal
    module: '.dailydeal_ctn',
    carouselItems: '',
    itemSelector: '.dailydeal_cap'
  },
  {
    // contenthub_spotlight_ctn
    module: '#spotlight_scroll',
    carouselItems: '',
    itemSelector: '.home_area_spotlight'
  },
  {
    // specials_container
    module: '#specials_container',
    carouselItems: '.contenthub_specials_grid',
    iconSizeClass: ICON_SIZE_CLASSES.SMALL
  }
]

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  tabHandler('.tab_content_ctn.sub', '.tab_item')

  // modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    carouselHandler(module)
  }
}

init()
