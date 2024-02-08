import { Transform } from '@preload/types/invoke'
import { ipcRenderer } from 'electron'
import { BliveHandleInterface } from '@main/handles/bliveHandle'
import { IPCHandle } from '@main/utils/ipcHandle'

export const winId = new URLSearchParams(window.location.search).get('winId')
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
  invoke<M extends keyof Transform<T>>(name: M, ...args: Parameters<Transform<T>[M]>) {
    if (!this.constructor['prefixName']) throw new Error('prefixName is not defined')
    return ipcRenderer.invoke(
      `IPCHandle:${this.constructor['prefixName']}:${winId}`,
      name,
      ...args
    ) as ReturnType<Transform<T>[M]>
  }
}

@invoke('blive')
export class BliveInvoke
  extends IPCInvoke<BliveHandleInterface>
  implements Transform<BliveHandleInterface>
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

  getRoomInfo() {
    return this.invoke('getRoomInfo')
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

  openContextMenu() {
    return this.invoke('openContextMenu')
  }

  switchMaximize() {
    return this.invoke('switchMaximize')
  }

  setAspectRatio(_value: 'RATIO_16_9' | 'RATIO_9_16'): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
