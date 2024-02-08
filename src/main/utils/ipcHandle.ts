import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron'

type Handler = (event: IpcMainInvokeEvent, ...args: any[]) => void

export class IPCHandle {
  static handlers: Map<string, Handler> = new Map()
  static prefixName: string

  window: BrowserWindow

  constructor(window: BrowserWindow) {
    this.window = window
    this.init()
  }

  getName() {
    if (!this.constructor['prefixName']) throw new Error('prefixName is not defined')
    return ['IPCHandle', this.constructor['prefixName'], this.window.id].join(':')
  }

  private init() {
    /** 监听通道 */
    ipcMain.handle(this.getName(), (event, name: string, ...args: any[]) =>
      this.handleEvent(event, name, ...args)
    )

    // 关闭窗口时移除监听
    this.window.addListener('close', () => ipcMain.removeHandler(this.getName()))
  }

  // 处理事件
  private handleEvent(event: IpcMainInvokeEvent, name: string, ...args: any[]) {
    const handler = IPCHandle.handlers.get(name)

    if (handler) {
      return handler.call(this, event, ...args)
    } else {
      throw new Error(`No handler found for ${name}`)
    }
  }

  /** 注册 Handler */
  registerHandler(this: IPCHandle, name: string, handler: Handler) {
    IPCHandle.handlers.set(name, handler)
  }
}

export function handle(name: string) {
  return (target: typeof IPCHandle) => {
    Reflect.defineProperty(target, 'prefixName', {
      value: name,
      writable: false
    })
  }
}

export function method(target: IPCHandle, propertyKey: string, descriptor: PropertyDescriptor) {
  target.registerHandler(propertyKey, descriptor.value)
}
