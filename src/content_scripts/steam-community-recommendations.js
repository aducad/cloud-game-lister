import { injectStyleFile } from '../common/utility'
import {
  dynamicContentHandler,
  runtimeContentHandler
} from '../libs/builders/steam-builder'
import { ICON_SIZE_CLASSES } from '../common/constants'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const observableModules = [
  {
    // friends recently purchased
    settings: {
      module: '#reviewed_apps',
      itemsContainerSelector: '',
      itemSelector: '.reviewed_app',
      iconSizeClass: ICON_SIZE_CLASSES.XLARGE
    },
    rootSelector: '#reviewed_apps'
  }
]

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css')

  // modules
  for (let i = 0; i < observableModules.length; i++) {
    const { rootSelector, settings } = observableModules[i]
    runtimeContentHandler(rootSelector, () => {
      dynamicContentHandler(settings)
    })
  }
}

init()
