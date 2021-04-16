import { injectStyleFile } from '../common/utility'
import { staticContentHandler } from '../libs/builders/steam-builder'
import { CONTENT_SCRIPT_T_MESSAGE, CONTENT_SCRIPT_T_MESSAGE_STYLE } from '../common/constants'

console.log(CONTENT_SCRIPT_T_MESSAGE, CONTENT_SCRIPT_T_MESSAGE_STYLE)

const modules = [
  {
    // tabs base
    contentSelector: '#tabs_basebg',
    itemSelector: '.gameListRow',
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
