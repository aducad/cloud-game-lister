import { injectStyleFile } from '../common/utility'
import { CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE } from '../common/constants'
import { staticContentHandler, dynamicContentHandler } from '../libs/builders/steam-builder'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

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
    itemSelector: '.small_cap'
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
