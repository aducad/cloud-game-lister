import { injectStyleFile } from '../common/utility'
import { tabHandler, carouselHandler } from '../common/steam-page'

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
    itemSelector: 'a'
  }
]

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/steam-tags.css')

  // carousel modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    carouselHandler(module)
  }

  // tabs handler
  tabHandler('.tab_content_ctn', '.tab_item')
}

init()
