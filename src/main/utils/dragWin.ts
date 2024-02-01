import { DragEvents } from '@main/types/dragWin'
import { BrowserWindow, screen } from 'electron'
import { ipcMain } from 'electron/main'

interface DragWinPrams {
  width: number
  height: number
  mouseX: number
  mouseY: number
}

const winMap = new Map<number, DragWinPrams>()
const getWindowBywinId = (winId: number) =>
  BrowserWindow.getAllWindows().find((w) => w.id === winId)
export function dragWin() {
  ipcMain.on(DragEvents.MOVEING, (e) => {
    const winId = e.sender.id

    const config = winMap.get(winId)

    if (!config) return

    const win = getWindowBywinId(e.sender.id)

    if (!win || win.isDestroyed()) return

    const { x, y } = screen.getCursorScreenPoint()

    const [nextX, nextY] = [x - config.mouseX, y - config.mouseY]
    const [oldX, oldY] = win.getPosition()

    if ([x, oldX].includes(nextX) && [y, oldY].includes(nextY)) return

    win.setPosition(nextX, nextY)
    win.setSize(config.width, config.height)
  })

  ipcMain.on(DragEvents.START, function (e, params: Omit<DragWinPrams, 'width' | 'height'>) {
    const winId = e.sender.id
    console.log(
      e.processId,
      winId,
      BrowserWindow.getAllWindows().map((w) => w.webContents.getProcessId()),
      BrowserWindow.getAllWindows().map((w) => w.webContents.id)
    )

    const win = getWindowBywinId(winId)

    if (!win || win.isDestroyed())
      return console.error('error dont find win by ELECTRON_DRAG_START')

    const [width, height] = win.getSize()

    const { mouseX, mouseY } = params

    winMap.set(winId, { width, height, mouseX, mouseY })
  })

  ipcMain.on(DragEvents.END, (e) => {
    winMap.delete(e.sender.id)
  })
}
