import browser from 'webextension-polyfill'

const buildGeForceIcon = game => {
  let imagePath = 'nvidia-128-active'
  const gameData = { ...game }
  if (!game) {
    imagePath = 'nvidia-128-passive'
  } else if (gameData.status !== 'AVAILABLE') {
    imagePath = 'nvidia-128-maintenance'
  }

  const iconPath = browser.runtime.getURL(`assets/icons/${imagePath}.png`)
  const isOptimizedText = gameData.isFullyOptimized ? 'Yes' : 'No'
  const gameStatus = gameData.status || 'Not Avaliable'
  const title = `
  Status: ${gameStatus}\nIs Fully Optimized?: ${isOptimizedText}
  `

  // logo container
  const logoContainer = document.createElement('div')
  logoContainer.title = title
  logoContainer.classList.add('cgl-logo-container')

  // create logo
  const logoImage = document.createElement('img')
  logoImage.src = iconPath
  logoImage.classList.add('cgl-logo')

  logoContainer.appendChild(logoImage)

  return logoContainer
}

export { buildGeForceIcon }
