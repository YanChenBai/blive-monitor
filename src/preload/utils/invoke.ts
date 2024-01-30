import { ipcRenderer } from 'electron'
export const winId = new URLSearchParams(window.location.search).get('winId')
import { BliveInterface } from '../../main/services/blive.service'

type Promisify<T> = T extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : T

type PromisifyProperties<T> = {
  [K in keyof T]: Promisify<T[K]>
}
export function ipcInvoke<T = void>(name: string, ...args: any[]) {
  return ipcRenderer.invoke(`IPCService:blive:${winId}`, name, ...args) as Promise<T>
}

export class BliveService implements PromisifyProperties<BliveInterface> {
  name: string = '1'
  minWin() {
    return ipcInvoke('minWin')
  }
  closeWin() {
    return ipcInvoke('closeWin')
  }
  setAlwaysOnTop(status: boolean) {
    return ipcInvoke('setAlwaysOnTop', status)
  }
  getAlwaysOnTop() {
    return ipcInvoke<boolean>('getAlwaysOnTop')
  }
}
