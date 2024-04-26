import { EventNames, SendEmoticonParams } from '@type/monitor'
import { ipcRenderer } from 'electron'

export function onSendText(callback: (content: string) => void) {
  ipcRenderer.on(EventNames.SEND_TEXT, (_event, content: string) => {
    callback(content)
  })
}

export function onSendEmoticon(callback: (emoticon: SendEmoticonParams) => void) {
  ipcRenderer.on(EventNames.SEND_EMOTICON, (_event, params: SendEmoticonParams) => {
    callback(params)
  })
}

export function onChangeVolume(callback: (direction: boolean) => void) {
  ipcRenderer.on(EventNames.CHANGE_VOLUME, (_event, direction: boolean) => {
    callback(direction)
  })
}
