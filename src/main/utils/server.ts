import { BrowserWindow } from 'electron'
import { roomMap, emoticonsMap, userConfig } from './liveRoomWindow'
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

function changeVolume(winId: number, direction: boolean) {
  const win = findWIn(winId)
  win?.webContents.send(EventNames.CHANGE_VOLUME, direction)
}

function postRequestGetWinId(res: Request) {
  if (res.body.winId) return Number(res.body.winId)
  else throw new Error('not find winId')
}

export function serverBootstrap() {
  const app = express()
  const connectToken = getConnectToken()

  app.use(express.urlencoded())
  app.use(express.json())

  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization')
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

  app.get('/check', (_req, res) => res.sendStatus(200))
  app.get('/get', (_req, res) =>
    res.json({
      maxlen: userConfig.maxlen,
      rooms: get()
    })
  )

  app.post('/send/emoji', (req, res) => {
    console.log(req.body)
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

  app.post('/change/volume', (req, res) => {
    const winId = postRequestGetWinId(req)
    const { direction } = req.body

    changeVolume(winId, Number(direction) === 1)

    res.sendStatus(200)
  })

  app.listen(5520, '0.0.0.0')
}
