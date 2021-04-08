import browser from 'webextension-polyfill'
import { STEAM_GAMEPAGE_SCRIPT_LOADED } from '../common/keys'
import { buildGeForceIcon } from '../common/icon-builder'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const start = async () => {
  const [, appID] = new URL(window.location.href).pathname
    .split('/')
    .filter(i => i)

  const { game } = await browser.runtime.sendMessage({
    type: STEAM_GAMEPAGE_SCRIPT_LOADED,
    appID
  })
  const logoContainer = buildGeForceIcon(game)

  const body = document.querySelector('body')
  body.appendChild(logoContainer)
}

start()
