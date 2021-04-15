import { injectStyleFile } from '../common/utility'
import {
  staticContentHandler,
  dynamicContentHandler
} from '../libs/builders/steam-builder'
import { ICON_SIZE_CLASSES } from '../common/constants'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const modules = [
  {
    // bundle package
    contentSelector: '.leftcol.game_description_column',
    itemSelector: '.tab_item'
  }
]

const dynamicModules = [
  {
    module: '#recommended_block',
    itemsContainerSelector: '',
    itemSelector: '.small_cap',
    iconSizeClass: ICON_SIZE_CLASSES.SMALL
  }
]

const init = async () => {
  // inject style file
  await injectStyleFile('./assets/styles/index.css')

  // static modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    staticContentHandler(module)
  }

  // dynamic modules
  for (let i = 0; i < dynamicModules.length; i++) {
    const module = dynamicModules[i]
    dynamicContentHandler(module)
  }
}

init()
