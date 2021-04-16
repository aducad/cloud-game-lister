class Logger {
  constructor(title) {
    this.title = {
      body: title || '---',
      color: 'darkgrey',
      size: '1rem'
    }
    this.body = {
      color: '#4f71d2',
      size: '0.75rem'
    }
  }

  setTitleStyle({ color, size }) {
    if (color !== undefined) {
      this.title.color = color
    }
    if (size !== undefined) {
      this.title.size = size
    }
  }

  setBodyStyle({ color, size }) {
    if (color !== undefined) {
      this.body.color = color
    }
    if (size !== undefined) {
      this.body.size = size
    }
  }

  log(body = '') {
    const bodyValue = typeof body === 'string' ? body : JSON.stringify(body, null, 2)
    const { color: titleColor, body: titleBody } = this.title
    const { color: bodyColor, size } = this.body
    console.log(
      `%c${titleBody}: %c${bodyValue}`,
      `color: ${titleColor}; font-weight: bold; font-size: ${this.title.size};`,
      `color: ${bodyColor}; font-weight: bold; font-size: ${size};`
    )
  }
}

export default Logger
