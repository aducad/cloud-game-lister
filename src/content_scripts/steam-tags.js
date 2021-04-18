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
    // recommended creators
    module: '.recommended_creators_ctn'
  },
  {
    // live streams
    module: '.live_streams_ctn'
  }
]

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
    selector: '#TopRatedRows'
  },
  {
    selector: '#ComingSoonRows'
  }
]

const handleTab = (id) => {
  staticContentHandler({
    contentSelector: id,
    itemSelector: '.tab_item'
  })
}

const init = async () => {
  // inject style file
  await injectStyleFile('./assets/styles/index.css')

  // carousel modules
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

  // specials container
  staticContentHandler({
    contentSelector: '#specials_container',
    itemSelector: '.store_capsule'
  })
}

init()
