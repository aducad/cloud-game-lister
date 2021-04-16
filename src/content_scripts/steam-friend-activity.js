import { injectStyleFile } from '../common/utility'
import { staticContentHandler, dynamicContentHandler } from '../libs/builders/steam-builder'
import {
  ICON_SIZE_CLASSES,
  CONTENT_SCRIPT_T_MESSAGE,
  CONTENT_SCRIPT_T_MESSAGE_STYLE
} from '../common/constants'

console.log(CONTENT_SCRIPT_T_MESSAGE, CONTENT_SCRIPT_T_MESSAGE_STYLE)

const modules = [
  {
    // friends recently purchased
    module: '#MostPlayed2WeeksRows',
    itemsContainerSelector: '.friendactivity_tab_row',
    itemSelector: '.friendactivity_game_link'
  },
  {
    // recommended by friends
    module: '.recommendation_section.recommended_by_friends',
    itemsContainerSelector: '.recommendation_row',
    itemSelector: '.recommendation_app'
  },
  {
    // friends last purchases
    module: '.block_content.block_content_inner',
    itemsContainerSelector: '.friend_game_block',
    itemSelector: '.app_impression_tracked'
  }
]

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  staticContentHandler({
    contentSelector: '.recommendation_highlight.recommendation_title_offset',
    itemSelector: '.header_image',
    iconSizeClass: ICON_SIZE_CLASSES.LARGE
  })

  // modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    dynamicContentHandler(module)
  }
}

init()
