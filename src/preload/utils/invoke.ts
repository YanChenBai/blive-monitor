import { ipcRenderer } from 'electron'
export const winId = new URLSearchParams(window.location.search).get('winId')
export const ipcInvoke = (name: string, ...args: any[]) =>
  ipcRenderer.invoke(`MessageChannel:${winId}`, name, ...args)
