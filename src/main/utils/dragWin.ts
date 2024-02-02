import { DragEvents } from '@main/types/dragWin'
import { screen } from 'electron'
import { windowMap } from '@main/utils/liveRoomWindow'
import { ipcMain } from 'electron/main'

interface DragWinPrams {
  width: number
  height: number
  mouseX: number
  mouseY: number
  button: number
}

const winConfigMap = new Map<number, DragWinPrams>()

export function dragWin() {
  ipcMain.on(DragEvents.MOVEING, (e) => {
    const { id } = e.sender

    const config = winConfigMap.get(id)

    if (!config) return

    const win = windowMap.get(id)

    if (!win || win.isDestroyed()) return

    const { x, y } = screen.getCursorScreenPoint()

    const [nextX, nextY] = [x - config.mouseX, y - config.mouseY]

    const [oldX, oldY] = win.getPosition()

    if ([x, oldX].includes(nextX) && [y, oldY].includes(nextY)) return

    win.setPosition(nextX, nextY)
    win.setSize(config.width, config.height)
  })

  ipcMain.on(DragEvents.START, function (e, params: Omit<DragWinPrams, 'width' | 'height'>) {
    const { id } = e.sender

    const win = windowMap.get(id)

    if (!win) return console.error('error dont find win by ELECTRON_DRAG_START')

    const [width, height] = win.getSize()

    const { mouseX, mouseY, button } = params

    winConfigMap.set(id, { width, height, mouseX, mouseY, button })
  })

  ipcMain.on(DragEvents.END, (e) => winConfigMap.delete(e.sender.id))
}
