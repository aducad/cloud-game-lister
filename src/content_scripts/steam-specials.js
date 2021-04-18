import { injectStyleFile } from '../common/utility'
import {
  staticContentHandler,
  dynamicContentHandler,
  runtimeContentHandler
} from '../libs/builders/steam-builder'
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

const handleTab = (id) => {
  staticContentHandler({
    contentSelector: id,
    itemSelector: '.tab_item'
  })
}

const staticObservableModules = [
  {
    selector: '#NewReleasesRows'
  },
  {
    selector: '#TopSellersRows'
  },
  {
    selector: '#ConcurrentUsersRows'
  },
  {
    selector: '#ComingSoonRows'
  }
]
const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  // modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    dynamicContentHandler(module)
  }

  // static observable modules
  for (let i = 0; i < staticObservableModules.length; i++) {
    const staticObservableModule = staticObservableModules[i]
    const { selector } = staticObservableModule
    handleTab(selector)
    runtimeContentHandler(
      selector,
      () => {
        handleTab(selector)
      },
      false,
      {
        childList: true
      }
    )
  }
}

init()
