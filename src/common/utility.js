module.exports = {
  delay: timeout => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, timeout)
    })
  },
  clone: obj => {
    return JSON.parse(JSON.stringify(obj))
  },
  getParameterByName: (name, urlValue) => {
    const url = urlValue || window.location.href
    const cleanName = name.replace(/[\[\]]/g, '\\$&')
    const regex = new RegExp(`[?&]${cleanName}(=([^&#]*)|&|#|$)`)
    const results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }
}
