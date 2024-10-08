import fs from 'node:fs'
/**
 * 检测目录是否存在,如果不存在则创建目录
 * @param dir 目录地址
 */
export async function isExists(dir: string) {
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir)
}
