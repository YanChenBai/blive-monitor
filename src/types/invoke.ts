import type { BrowserWindow } from 'electron'

/** 函数返回值转Promise */
export type MethodToPromise<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => R extends Promise<any> ? R : Promise<R> // 如果返回值就是Promise则直接返回
    : T[K]
}

/** 排除非函数成员 */
type FunctionOnlyInterface<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never
}

/** 排除函数下的 BrowserWindow 参数 */
type WithoutInvokeEvent<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K] extends (event: BrowserWindow, ...rest: infer Rest) => infer Return
      ? (...args: Rest) => Return
      : T[K]
    : T[K]
}

/** 转变接口 */
export type InvokeTransform<T> = MethodToPromise<WithoutInvokeEvent<FunctionOnlyInterface<T>>>
