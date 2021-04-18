import { injectStyleFile } from '../common/utility'
import {
  dynamicContentHandler,
  staticContentHandler,
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
    module: '.store_capsule_frame.highlighted_app',
    itemsContainerSelector: ' > div',
    itemSelector: '.highlighted_app_header',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  },
  {
    // most_recommended
    module: '.most_recommended',
    itemsContainerSelector: ''
  },
  {
    // feature curators block
    module: '#feature_curators_block_0'
  }
]

const getElementIndex = (element) => {
  const children = element.parentNode.childNodes
  for (let i = 0; i < children.length; i++) {
    if (children[i] == element) {
      return i
    }
  }
  return -1
}

const init = async () => {
  // inject style file
  await injectStyleFile('./assets/styles/index.css')

  // carousel modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    dynamicContentHandler(module)
  }
  const curatorSpotlights = document.querySelectorAll('.curator_list_title ~ .curator_spotlight')
  for (let i = 0; i < curatorSpotlights.length; i++) {
    const curatorSpotlight = curatorSpotlights[i]
    const itemIndex = getElementIndex(curatorSpotlight)
    const itemsContainerSelector = `.curator_spotlight:nth-child(${itemIndex})`
    dynamicContentHandler({
      module: '.page_content_ctn .page_content',
      itemsContainerSelector
    })
  }

  // CuratorsRows

  runtimeContentHandler(
    '#CuratorsRows',
    () => {
      console.log('observer worked')
    },
    false,
    { childList: true }
  )

  // const observer = new MutationObserver(async () => {
  //   console.log('MutationObserver')
  //   // await staticContentHandler({
  //   //   contentSelector: '.curator_recommendation_capsule',
  //   //   itemSelector: '.wishlist_row:not(.cgl-applied)',
  //   //   dataAttributeKey: 'data-app-id'
  //   // })
  //   // const rows = document.querySelectorAll('#CuratorsRows .wishlist_row:not(.cgl-applied)')
  //   // for (let index = 0; index < rows.length; index++) {
  //   //   const row = rows[index]
  //   //   row.classList.add('cgl-applied')
  //   // }
  // })
  // const rootElement = document.querySelector('#CuratorsRows')
  // if (rootElement) {
  //   observer.observe(rootElement, {
  //     childList: true
  //   })
  // }
}

init()
