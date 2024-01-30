import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { LiveRoomWindow } from './liveRoomWindow'

type Handler = (event: IpcMainInvokeEvent, ...args: any[]) => void

export class IPCService {
  static handlers: Map<string, Handler> = new Map()
  static prefixName: string

  window: LiveRoomWindow

  constructor(window: LiveRoomWindow) {
    this.window = window
    this.init()
  }

  getServiceName() {
    return ['IPCService', this.constructor['prefixName'], this.window.id].join(':')
  }

  private init() {
    /** 监听通道 */
    ipcMain.handle(this.getServiceName(), (event, name: string, ...args: any[]) =>
      this.handleEvent(event, name, ...args)
    )

    // 关闭窗口时移除监听
    this.window.addListener('close', () => ipcMain.removeHandler(this.getServiceName()))
  }

  // 处理事件
  private handleEvent(event: IpcMainInvokeEvent, name: string, ...args: any[]) {
    const handler = IPCService.handlers.get(name)

    if (handler) {
      handler.call(this, event, ...args)
    } else {
      throw new Error(`No handler found for ${name}`)
    }
  }

  /** 注册 Handler */
  registerHandler(this: IPCService, name: string, handler: Handler) {
    IPCService.handlers.set(name, handler)
  }
}

export function service(name: string) {
  return (target: typeof IPCService) => {
    Reflect.defineProperty(target, 'prefixName', {
      value: name,
      writable: false
    })
  }
}

/** 注册 Handler 装饰器 */
export function method(target: IPCService, propertyKey: string, descriptor: PropertyDescriptor) {
  target.registerHandler(propertyKey, descriptor.value)
}

export function event(target: object, propertyKey: string, parameterIndex: number) {
  console.log(target, propertyKey, parameterIndex)
}
