import browser from 'webextension-polyfill'
import { IS_DEV_MODE } from '../common/config'
import { STEAM_GAMEPAGE_SCRIPT_LOADED } from '../common/keys'
import logger from '../common/logger-builder'

const mode = IS_DEV_MODE ? 'dev' : 'production'
logger.info('Steam Extensions-Geforce Now Game Checker worked...')
logger.warning(
  `Steam Extensions-Geforce Now Game Checker running on ${mode} mode`
)

const start = async () => {
  const [, appID] = new URL(window.location.href).pathname
    .split('/')
    .filter(i => i)

  let { game } = await browser.runtime.sendMessage({
    type: STEAM_GAMEPAGE_SCRIPT_LOADED,
    appID
  })
  logger.info(game)
  let imagePath = 'nvidia-128-active'
  if (!game) {
    game = {}
    imagePath = 'nvidia-128-passive'
  } else if (game.status !== 'AVAILABLE') {
    imagePath = 'nvidia-128-maintenance'
  }

  const iconPath = browser.runtime.getURL(`assets/icons/${imagePath}.png`)
  const isOptimizedText = game.isFullyOptimized ? 'Yes' : 'No'
  const gameStatus = game.status || 'Not Avaliable'
  const title = `
  Status: ${gameStatus}\nIs Fully Optimized?: ${isOptimizedText}
`

  // logo container
  const logoContainer = document.createElement('div')
  logoContainer.title = title
  logoContainer.style = 'position:fixed; right:100px; bottom:10px; cursor:help;'

  // create logo
  const logoImage = document.createElement('img')
  logoImage.src = iconPath
  logoImage.style = 'width:64px; height:64px;'

  const body = document.querySelector('body')
  logoContainer.appendChild(logoImage)
  body.appendChild(logoContainer)
}

start()
