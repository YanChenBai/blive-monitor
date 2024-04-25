import { BrowserWindow } from 'electron'
import { roomMap, emoticonsMap } from './liveRoomWindow'
import express, { type Request } from 'express'
import { EventNames, SendEmoticonParams } from '@type/monitor'
import { getConnectToken } from './lowdb'

function findWIn(winId: number) {
  return BrowserWindow.getAllWindows().find((item) => item.id === winId)
}

function get() {
  const keys = [...emoticonsMap.keys()]

  return keys.map((key) => ({
    id: key,
    roomInfo: roomMap.get(key),
    emoticons: emoticonsMap.get(key)
  }))
}

function sendText(winId: number, content: string) {
  const win = findWIn(winId)
  win?.webContents.send(EventNames.SEND_TEXT, content)
}

function sendEmoji(winId: number, params: SendEmoticonParams) {
  const win = findWIn(winId)
  win?.webContents.send(EventNames.SEND_EMOTICON, params)
}

function postRequestGetWinId(res: Request) {
  if (res.body.winId) return Number(res.body.winId)
  else throw new Error('not find winId')
}

export function serverBootstrap() {
  const app = express()
  const connectToken = getConnectToken()

  app.use(express.urlencoded())

  app.all('*', function (_req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', '*')
    //允许的header类型
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    //跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'POST,GET')

    next()
  })

  app.use(function (req, res, next) {
    if (req.headers.authorization === connectToken) {
      next()
    } else {
      res.sendStatus(403)
    }
  })

  app.get('/get', (_req, res) => {
    res.json(get())
  })

  app.post('/send/emoji', (req, res) => {
    const winId = postRequestGetWinId(req)
    const { emoticonUnique, pkgId } = req.body

    sendEmoji(winId, { emoticonUnique, pkgId: Number(pkgId) })

    res.sendStatus(200)
  })

  app.post('/send/text', (req, res) => {
    const winId = postRequestGetWinId(req)
    const { content } = req.body

    sendText(winId, content)

    res.sendStatus(200)
  })

  app.listen(5520, () => {
    // console.log('listen to 5520')
  })
}
