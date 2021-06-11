import { injectStyleFile } from '../common/utility'
import { buildGeForceIcon, getGameInfo } from '../libs/builders/steam-builder'
import {
  ICON_SIZE_CLASSES,
  CONTENT_SCRIPT_MESSAGE,
  CONTENT_SCRIPT_MESSAGE_STYLE
} from '../common/constants'

console.log(CONTENT_SCRIPT_MESSAGE, CONTENT_SCRIPT_MESSAGE_STYLE)

const buildIcons = async () => {
  const appIdList = []
  const appLinks = document.querySelectorAll('.gameListRow')
  for (let i = 0; i < appLinks.length; i++) {
    const appLink = appLinks[i]
    appLink.classList.add('cgl-applied')
    const { id } = appLink
    const idValue = id.replace('game_', '')
    appIdList.push(idValue)
  }
  const games = await getGameInfo(appIdList)
  for (let index = 0; index < games.length; index++) {
    const game = games[index]
    const { appid } = game
    const appRow = document.querySelector(`#game_${appid}`)
    const logoContainer = buildGeForceIcon(game, ICON_SIZE_CLASSES.MEDIUM)
    appRow.classList.add('cgl-item-added')
    appRow.appendChild(logoContainer)
  }
}

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/index.css', true)

  await buildIcons()
}

init()
