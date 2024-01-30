import fs from 'fs'
/**
 * 检测目录是否存在,如果不存在则创建目录
 * @param dir 目录地址
 * @returns
 */
export async function isExists(dir: string) {
  if (!fs.existsSync(dir)) {
    return await fs.promises.mkdir(dir)
  }
}
