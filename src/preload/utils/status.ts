type StatusWatch<T> = (value: T) => any
export class Status<T> {
  private _rawValue: T
  private _watchList: StatusWatch<T>[] = []

  constructor(initValue: T) {
    this._rawValue = initValue
  }

  set value(value: T) {
    this._rawValue = value
    this._watchList.forEach((func) => func(value))
  }

  get value() {
    return this._rawValue
  }

  set watch(func: StatusWatch<T>) {
    this._watchList.push(func)
  }
}

export function watch<T>(
  status: Status<T> | Status<T>[],
  func: (val: T) => void,
  immediate?: boolean
) {
  if (Array.isArray(status)) {
    status.forEach((item) => {
      if (immediate === true) func(item.value)
      item.watch = (val) => func(val)
    })
  } else {
    if (immediate === true) func(status.value)
    status.watch = (val) => func(val)
  }
}

/** 控制栏显示状态 */
export const controlBarStatus = new Status(false)

/** 弹幕快捷发送显示状态 */
export const danmuInputStatus = new Status(false)

/** 弹幕快捷发送输入框是否获得焦点*/
export const danmuInputIsFocus = new Status(false)
