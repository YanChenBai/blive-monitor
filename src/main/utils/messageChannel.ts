import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron'

type Handler = (event: IpcMainInvokeEvent, ...args: any[]) => void

export class MessageChannel {
  window: BrowserWindow
  handlers: Map<string, Handler>
  channelName: string

  constructor(window: BrowserWindow) {
    this.window = window
    this.handlers = new Map()
    this.channelName = `MessageChannel`
    this.init()
  }

  init() {
    ipcMain.handle(this.channelName, (event, name: string, ...args: any[]) =>
      this.handleEvent(event, name, ...args)
    )
    this.window.addListener('close', () => ipcMain.removeHandler(this.channelName))
  }

  registerHandler(name: string, handler: Handler) {
    this.handlers.set(name, handler)
  }

  handleEvent(event: IpcMainInvokeEvent, name: string, ...args: any[]) {
    const handler = this.handlers.get(name)
    if (handler) {
      handler(event, ...args)
    } else {
      throw new Error(`No handler found for ${name}`)
    }
  }
}
