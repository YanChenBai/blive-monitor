import path from 'node:path'
import { app } from 'electron'
import { isExists } from './isExists'

/** 日志路径 */
export const LOG_PATH = path.resolve(app.getPath('logs'), 'info.log')

/** 数据json路径 */
export const DB_PATH = path.resolve(app.getPath('appData'), 'db.json')

/** 图标路径 */
export const ICONS_PATH = path.resolve(app.getPath('pictures'), 'icons')

/** 初始化路径 */
export const initPath = () => isExists(ICONS_PATH)
