import { injectStyleFile } from '../common/utility'
import { staticContentHandler } from '../libs/builders/steam-builder'
import { ICON_SIZE_CLASSES } from '../common/constants'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const modules = [
  {
    // tabs base
    contentSelector: '#tabs_basebg',
    itemSelector: '.gameListRow',
    iconSizeClass: ICON_SIZE_CLASSES.SMALL,
    dataAttributeKey: 'data-appid'
  }
]

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  // static contents
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    staticContentHandler(module)
  }
}

init()
