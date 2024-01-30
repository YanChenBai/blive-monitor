import log4js from 'log4js'

import { LOG_PATH } from './paths'

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
      type: 'dateFile',
      filename: LOG_PATH,
      maxLogSize: 10485760,
      encoding: 'utf-8',
      backups: 3,
      compress: false,
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true,
      keepFileExt: true
    }
  },
  categories: {
    default: { appenders: ['file', 'console'], level: 'info' }
  }
})

/** 日志 */
export const logger = log4js.getLogger()
