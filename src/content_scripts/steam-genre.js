import browser from 'webextension-polyfill'
import { injectStyleFile } from '../common/utility'
import { WEB_REQUEST_COMPLETED } from '../common/keys'
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

const handleTab = (id) => {
  staticContentHandler({
    contentSelector: id,
    itemSelector: '.tab_item'
  })
}

const getTabId = (url) => {
  const paths = new URL(url).pathname.split('/').filter((i) => i)
  let currentTab = ''
  if (paths.length > 3) {
    currentTab = paths[3]
  }
  return `#${currentTab}Table`
}

const init = async () => {
  // inject style file
  await injectStyleFile('./assets/styles/index.css')

  // carousel modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    dynamicContentHandler(module)
  }

  // New Releases Tab Content
  handleTab('#NewReleasesTable')

  // Top Sellers Tab Content
  handleTab('#TopSellersTable')

  // Concurrent Users Tab Content
  handleTab('#ConcurrentUsersTable')

  // Top Rated Tab Content
  handleTab('#TopRatedTable')

  // Coming Soon Tab Content
  handleTab('#ComingSoonTable')
}

const onRuntimeMessageHandler = (request, sender) => {
  const { type } = request
  if (type === 'SIGN_CONNECT') {
    return true
  }
  switch (type) {
    case WEB_REQUEST_COMPLETED: {
      return new Promise(async (resolve) => {
        const { url } = request
        const tabId = getTabId(url)
        handleTab(tabId)
        resolve()
      })
    }
  }
}

browser.runtime.onMessage.addListener(onRuntimeMessageHandler)

init()
