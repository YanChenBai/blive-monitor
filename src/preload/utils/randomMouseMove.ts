/**
 * 随机生成鼠标移动事件的坐标
 * @returns
 */
function getRandomCoord() {
  const maxX = window.innerWidth
  const maxY = window.innerHeight

  const randomX = Math.floor(Math.random() * maxX)
  const randomY = Math.floor(Math.random() * maxY)

  return { x: randomX, y: randomY }
}

/**
 * 随机触发鼠标移动事件
 */
export function randomMouseMove() {
  const { x, y } = getRandomCoord()

  const moveEvent: MouseEvent & { ignore?: boolean } = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y
  })

  moveEvent.ignore = true

  document.dispatchEvent(moveEvent)
}
