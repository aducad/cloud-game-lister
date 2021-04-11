import { injectStyleFile } from '../common/utility'
import { tabHandler, carouselHandler } from '../common/steam-page'
import { ICON_SIZE_CLASSES } from '../common/constants'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const modules = [
  {
    // friends recently purchased
    module: '#MostPlayed2WeeksRows',
    carouselItems: '.friendactivity_tab_row',
    itemSelector: '.friendactivity_game_link',
    iconSizeClass: ICON_SIZE_CLASSES.XSMALL
  },
  {
    // recommended by friends
    module: '.recommendation_section.recommended_by_friends',
    carouselItems: '.recommendation_row',
    itemSelector: '.recommendation_app',
    iconSizeClass: ICON_SIZE_CLASSES.SMALL
  },
  {
    // friends last purchases
    module: '.block_content.block_content_inner',
    carouselItems: '.friend_game_block',
    itemSelector: '.app_impression_tracked',
    iconSizeClass: ICON_SIZE_CLASSES.XSMALL
  }
]

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  tabHandler(
    '.recommendation_highlight.recommendation_title_offset',
    '.header_image',
    ICON_SIZE_CLASSES.LARGE
  )

  // modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    carouselHandler(module)
  }
}

init()
