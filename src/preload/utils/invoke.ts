import { ipcRenderer } from 'electron'
export const winId = new URLSearchParams(window.location.search).get('winId')
import { BliveInterface } from '../../main/services/blive.service'

type ToPromise<T> = T extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : T

type MethodToPromise<T> = {
  [K in keyof T]: ToPromise<T[K]>
}

export function ipcInvoke<T = void>(name: string, ...args: any[]) {
  return ipcRenderer.invoke(`IPCService:blive:${winId}`, name, ...args) as Promise<T>
}

export class BliveService implements MethodToPromise<BliveInterface> {
  minWin() {
    return ipcInvoke('minWin')
  }
  closeWin() {
    return ipcInvoke('closeWin')
  }
  setAlwaysOnTop(e: any, status: boolean) {
    console.log(status)

    return ipcInvoke('setAlwaysOnTop', status)
  }
  getAlwaysOnTop() {
    return ipcInvoke<boolean>('getAlwaysOnTop')
  }
}
