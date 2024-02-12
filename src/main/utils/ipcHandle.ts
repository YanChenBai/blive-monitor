import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron'
import { logger } from './logger'

type Handler = (windwo: BrowserWindow, ...args: any[]) => void

export class IPCHandle {
  static handlers: Map<string, Handler> = new Map()
  static prefixName: string

  constructor() {
    this.init()
  }

  getName() {
    if (!this.constructor['prefixName']) throw new Error('prefixName is not defined')
    return ['IPCHandle', this.constructor['prefixName']].join(':')
  }

  private init() {
    /** 监听通道 */
    ipcMain.handle(this.getName(), (event, name: string, ...args: any[]) =>
      this.handleEvent(event, name, ...args)
    )
  }

  // 处理事件
  private handleEvent(event: IpcMainInvokeEvent, name: string, ...args: any[]) {
    const handler = IPCHandle.handlers.get(name)

    if (handler) {
      const window = BrowserWindow.getAllWindows().find((item) => item.id === event.sender.id)
      if (window) {
        try {
          return handler.call(this, window, ...args)
        } catch (error) {
          logger.error(error, event, name)
          throw error
        }
      } else {
        const msg = `No found window`
        logger.error(msg, event, name)
        throw new Error(msg)
      }
    } else {
      const msg = `No handler found for ${name}`
      logger.error(msg, event)
      throw new Error(msg)
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
