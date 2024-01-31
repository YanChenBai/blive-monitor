import { IPCServiceInvoke } from './../types/invoke'
import { ipcRenderer } from 'electron'
export const winId = new URLSearchParams(window.location.search).get('winId')
import { BliveInterface } from '../../main/services/blive.service'

export function ipcInvoke<T = void>(name: keyof BliveInterface, ...args: any[]) {
  return ipcRenderer.invoke(`IPCService:blive:${winId}`, name, ...args) as Promise<T>
}

export class BliveService implements IPCServiceInvoke<BliveInterface> {
  minWin() {
    return ipcInvoke('minWin')
  }
  closeWin() {
    return ipcInvoke('closeWin')
  }
  setAlwaysOnTop(status: boolean) {
    console.log(status)

    return ipcInvoke('setAlwaysOnTop', status)
  }
  getAlwaysOnTop() {
    return ipcInvoke<boolean>('getAlwaysOnTop')
  }
  openContextMenu() {
    return ipcInvoke('openContextMenu')
  }
  switchMaximize() {
    return ipcInvoke('switchMaximize')
  }
  moveWin(x: number, y: number) {
    return ipcInvoke('moveWin', x, y)
  }
}
