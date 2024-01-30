import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { LiveRoomWindow } from './liveRoomWindow'

type Handler = (event: IpcMainInvokeEvent, ...args: any[]) => void

export class IPCService {
  static handlers: Map<string, Handler> = new Map()
  private prefixName: string

  window: LiveRoomWindow

  constructor(prefixName: string, window: LiveRoomWindow) {
    this.window = window
    this.prefixName = prefixName
    this.init()
  }

  // 获取
  private getChannelName() {
    return ['IPCService', this.prefixName, this.window.id].join(':')
  }

  private init() {
    // 监听通道
    ipcMain.handle(this.getChannelName(), (event, name: string, ...args: any[]) =>
      this.handleEvent(event, name, ...args)
    )

    // 关闭窗口时移除监听
    this.window.addListener('close', () => ipcMain.removeHandler(this.getChannelName()))
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

  // 注册事件
  registerHandler(this: IPCService, name: string, handler: Handler) {
    IPCService.handlers.set(name, handler)
  }
}

export function method(target: IPCService, propertyKey: string, descriptor: PropertyDescriptor) {
  target.registerHandler(propertyKey, descriptor.value)
}
