import { injectStyleFile } from '../common/utility'
import { dynamicContentHandler, runtimeContentHandler } from '../libs/builders/steam-builder'
import {
  ICON_SIZE_CLASSES,
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE
} from '../common/constants'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

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
