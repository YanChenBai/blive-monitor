function isNotEmpty<T>(data: T | undefined | null) {
  if (data !== null && data !== undefined) {
    return data
  } else {
    return null
  }
}

/** 等待某个函数返回部位空的值 */
export function awaitThing<T>(func: () => T | undefined | null) {
  return new Promise<T>((res, rej) => {
    const data = isNotEmpty(func())
    if (data) {
      res(data)
    } else {
      const timer = setInterval(() => {
        const data = isNotEmpty(func())
        if (data) {
          clearInterval(timer)
          res(data)
        }
      }, 100)

      setTimeout(() => {
        clearInterval(timer)
        rej(new Error('awaitThing timeout'))
      }, 10000)
    }
  })
}

/** 等待livePlayer创建 */
export const awaitLivePlayer = () => awaitThing(() => window.livePlayer)

/** 等待b站video element创建 */
export const awaitVideoEl = () =>
  awaitThing(() => (window.livePlayer ? window.livePlayer.getVideoEl() : null))
