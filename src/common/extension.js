import browser from 'webextension-polyfill'

const createPageUrl = pageUrl => {
  return browser.extension.getURL(pageUrl)
}

const getExtensionPageTabIdByUrl = pageUrl => {
  return new Promise(async resolve => {
    const url = createPageUrl(pageUrl)
    const tabs = await browser.tabs.query({ url })
    if (tabs.length > 0) {
      resolve(tabs[0].id)
    } else {
      resolve(-1)
    }
  })
}

const getPageTabIdByUrl = url => {
  return new Promise(async (resolve, reject) => {
    try {
      const tabs = await browser.tabs.query({ url })
      if (tabs.length > 0) {
        resolve(tabs[0].id)
      } else {
        resolve(-1)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export { createPageUrl, getExtensionPageTabIdByUrl, getPageTabIdByUrl }
