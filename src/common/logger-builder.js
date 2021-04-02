import Logger from '../libs/consoleLogger'

const infoLogger = new Logger('Info')
infoLogger.setBodyStyle({})

const errorLogger = new Logger('Error')
errorLogger.setBodyStyle({ color: 'red' })

const warningLogger = new Logger('Warning')
warningLogger.setBodyStyle({ color: 'orange' })

const info = body => {
  infoLogger.log(body)
}

const error = body => {
  errorLogger.log(body)
}

const warning = body => {
  warningLogger.log(body)
}

export default {
  info,
  error,
  warning
}
