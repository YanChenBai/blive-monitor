import path from 'node:path'
import { app } from 'electron'
import { isExists } from './isExists'

const ROAMING_PATH = path.resolve(app.getPath('userData'))

/** 渲染进程路径 */
export const RENDER_PATH = app.isPackaged
  ? path.resolve(app.getAppPath(), 'out', 'renderer', 'index.html')
  : 'http://localhost:5173'

/** 日志路径 */
export const LOG_PATH = app.isPackaged
  ? path.resolve(ROAMING_PATH, 'logs', 'info.log')
  : path.resolve(app.getAppPath(), 'resources', 'logs', 'info.log')

/** 数据json路径 */
export const DB_PATH = app.isPackaged
  ? path.resolve(ROAMING_PATH, 'db.json')
  : path.resolve(app.getAppPath(), 'resources', 'db.json')

/** 图标路径 */
export const ICONS_PATH = app.isPackaged
  ? path.resolve(ROAMING_PATH, 'icons')
  : path.resolve(app.getAppPath(), 'resources', 'icons')

/** 初始化路径 */
export const initPath = () => isExists(ICONS_PATH)
