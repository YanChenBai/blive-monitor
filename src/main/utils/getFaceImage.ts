import path from 'path'
import { ICONS_PATH } from './paths'
import { logger } from './logger'
import axios from 'axios'
import crypto from 'crypto'
import fs from 'fs'

const md5 = (str: string) => crypto.createHash('md5').update(str).digest('hex')

/**
 * 查看图片是否缓存
 * @param url 图片地址
 */
function isCached(url: string) {
  const imgPath = path.join(ICONS_PATH, `${md5(url)}.png`)
  if (fs.existsSync(imgPath)) {
    return true
  } else {
    return false
  }
}

/**
 * 保存图片
 * @param url 图片地址
 */
async function saveImg(url: string, savePath: string) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    fs.writeFileSync(savePath, response.data)
    return true
  } catch (error) {
    logger.error(error)
    return false
  }
}

/**
 * 获取图片 - 不存在会缓存,存在就会走缓存
 * @param url 图片地址
 */
export async function getFace(url: string) {
  const imgPath = path.join(ICONS_PATH, `${md5(url)}.png`)
  const status = isCached(url)
  if (status) {
    return imgPath
  } else {
    return (await saveImg(url, imgPath)) ? imgPath : ''
  }
}
