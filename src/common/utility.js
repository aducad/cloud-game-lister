import browser from 'webextension-polyfill'

const delay = timeout => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

/**
 * Injects style file to head tag
 * @param {string} filePath
 */
const injectStyleFile = async (filePath, checkInitialize = false) => {
  if (checkInitialize) {
    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (document.head) {
          clearInterval(interval)
          resolve()
        }
      }, 10)
    })
  }
  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.type = 'text/css'
  style.href = browser.extension.getURL(filePath)
  await document.head.append(style)
}

export { injectStyleFile, delay }
