import type { IpcMainInvokeEvent } from 'electron'

// 函数返回值转Promise
type MethodToPromise<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : T[K]
}

// 排除函数下的 IpcMainInvokeEvent 参数
type WithoutInvokeEvent<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K] extends (event: IpcMainInvokeEvent, ...rest: infer Rest) => infer Return
      ? (...args: Rest) => Return
      : T[K]
    : T[K]
}

export type IPCServiceInvoke<T> = MethodToPromise<WithoutInvokeEvent<T>>
