import { InvokeTransform } from '@type/invoke'
import { ipcRenderer } from 'electron'
import { IPCHandle } from '@main/utils/ipcHandle'
import type { Room } from '@type/room'
import { BliveHandleInterface } from '@type/handle'
import { MainHandleInterface } from '@type/handle'
import { EmoticonsMap } from '@type/emoji'

export function invoke(prefixName: string) {
  return (target: typeof IPCInvoke) => {
    Reflect.defineProperty(target, 'prefixName', {
      value: prefixName,
      writable: false
    })
  }
}

class IPCInvoke<T> {
  static prefixName: IPCHandle
  winId = new URLSearchParams(window.location.search).get('winId')
  group = true

  invoke<M extends keyof InvokeTransform<T>>(name: M, ...args: Parameters<InvokeTransform<T>[M]>) {
    if (!this.constructor['prefixName']) throw new Error('prefixName is not defined')

    return ipcRenderer.invoke(
      ['IPCHandle', this.constructor['prefixName']].join(':'),
      name,
      ...args
    ) as ReturnType<InvokeTransform<T>[M]>
  }
}

@invoke('blive')
export class BliveInvoke
  extends IPCInvoke<BliveHandleInterface>
  implements InvokeTransform<BliveHandleInterface>
{
  minWin() {
    return this.invoke('minWin')
  }

  closeWin() {
    return this.invoke('closeWin')
  }

  setAlwaysOnTop(status: boolean) {
    return this.invoke('setAlwaysOnTop', status)
  }

  getRoom() {
    return this.invoke('getRoom')
  }

  getAlwaysOnTop() {
    return this.invoke('getAlwaysOnTop')
  }

  setVolume(value: number) {
    return this.invoke('setVolume', value)
  }

  getVolume() {
    return this.invoke('getVolume')
  }

  log(message: string, ...args: any[]) {
    return this.invoke('log', message, args)
  }

  setAspectRatio(_value: 'RATIO_16_9' | 'RATIO_9_16'): Promise<void> {
    throw new Error('Method not implemented.')
  }

  addEmoticons(emoticons: EmoticonsMap[]): Promise<void> {
    return this.invoke('addEmoticons', emoticons)
  }

  setMaxlen(maxlen: number) {
    return this.invoke('setMaxlen', maxlen)
  }
}

@invoke('main')
export class MainInvoke
  extends IPCInvoke<MainHandleInterface>
  implements InvokeTransform<MainHandleInterface>
{
  winCount() {
    return this.invoke('winCount')
  }

  minWin() {
    return this.invoke('minWin')
  }

  closeWin() {
    return this.invoke('closeWin')
  }

  openBiliHome() {
    return this.invoke('openBiliHome')
  }

  getRoomInfo(roomId: string) {
    return this.invoke('getRoomInfo', roomId)
  }

  getManyRoomInfo(uids: string[]) {
    return this.invoke('getManyRoomInfo', uids)
  }

  openLiveRoom(room: Room) {
    return this.invoke('openLiveRoom', room)
  }

  getConnectInfo() {
    return this.invoke('getConnectInfo')
  }
}
