import browser from 'webextension-polyfill'
import { STEAM_GAMEPAGE_SCRIPT_LOADED } from '../common/keys'
import { buildGeForceIcon } from '../libs/builders/steam-builder'
import {
  ICON_SIZE_CLASSES,
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE
} from '../common/constants'
import { dynamicContentHandler } from '../libs/builders/steam-builder'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

const modules = [
  {
    // franchise block
    module: '#franchise_block',
    itemSelector: '.small_cap',
    itemsContainerSelector: '.block_content'
  },
  {
    // recommended block
    module: '#recommended_block',
    itemSelector: '.small_cap',
    itemsContainerSelector: '.block_content'
  }
]

const start = async () => {
  // https://store.steampowered.com/app/680420/OUTRIDERS/
  const [, appID] = new URL(window.location.href).pathname.split('/').filter((i) => i)

  const { game } = await browser.runtime.sendMessage({
    type: STEAM_GAMEPAGE_SCRIPT_LOADED,
    appID
  })
  if (!game) {
    return
  }
  const logoContainer = buildGeForceIcon(game, ICON_SIZE_CLASSES.XLARGE)

  const leftColumn = document.querySelector('#game_highlights .leftcol')
  leftColumn.classList.add('cgl-item-added')
  leftColumn.appendChild(logoContainer)

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    dynamicContentHandler(module)
  }
}

start()
