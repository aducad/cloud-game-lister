import browser from 'webextension-polyfill'
import { injectStyleFile } from '../common/utility'
import { staticContentHandler, dynamicContentHandler } from '../libs/builders/steam-builder'
import { WEB_REQUEST_COMPLETED } from '../common/keys'
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

  // specials container
  staticContentHandler({
    contentSelector: '#specials_container',
    itemSelector: '.store_capsule'
  })
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
