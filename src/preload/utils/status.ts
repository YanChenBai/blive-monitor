type StatusWatch<T> = (value: T) => any
export class Status<T> {
  private _rawValue: T
  private _watchList: StatusWatch<T>[] = []

  constructor(initValue: T) {
    this._rawValue = initValue
  }

  set value(value: T) {
    this._rawValue = value
    this._watchList.forEach(func => func(value))
  }

  get value() {
    return this._rawValue
  }

  get watch(): StatusWatch<T>[] {
    return this._watchList
  }

  set watch(func: StatusWatch<T>) {
    this._watchList.push(func)
  }
}

export function watch<T>(
  status: Status<T> | Status<T>[],
  func: (val: T) => void,
  immediate?: boolean,
) {
  if (Array.isArray(status)) {
    status.forEach((item) => {
      if (immediate === true)
        func(item.value)
      item.watch = val => func(val)
    })
  }
  else {
    if (immediate === true)
      func(status.value)
    status.watch = val => func(val)
  }
}

/** 控制栏显示状态 */
export const controlBarStatus = new Status(false)

/** 弹幕快捷发送显示状态 */
export const danmuInputStatus = new Status(false)

/** 弹幕快捷发送输入框是否获得焦点 */
export const danmuInputIsFocus = new Status(false)

let autoCloseTimer: NodeJS.Timeout | undefined

function clearAutoClose() {
  clearTimeout(autoCloseTimer)
}

function autoClose() {
  clearAutoClose()
  autoCloseTimer = setTimeout(() => {
    closeControlBar()
    closeDanmuInput()
  }, 5000)
}
export function openControlBar() {
  controlBarStatus.value = true
  autoClose()
}

/**
 * 关闭控制栏
 * @param forced 是否强制关闭
 */
export function closeControlBar(forced = false) {
  if (!danmuInputIsFocus.value || forced) {
    controlBarStatus.value = false
    clearTimeout(autoCloseTimer)
  }
}

export function switchControlBar() {
  if (controlBarStatus.value) {
    closeControlBar(true)
  }
  else {
    openControlBar()
  }
}

export function openDanmuInput() {
  danmuInputStatus.value = true
  autoClose()
}

/**
 * 关闭输入框
 * @param forced 是否强制关闭
 */
export function closeDanmuInput(forced = false) {
  if (!danmuInputIsFocus.value || forced) {
    danmuInputStatus.value = false
    clearTimeout(autoCloseTimer)
  }
}

export function switchDanmuInput() {
  if (danmuInputStatus.value) {
    closeDanmuInput(true)
  }
  else {
    openDanmuInput()
  }
}
