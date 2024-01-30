import { shell, app } from 'electron'
import { join } from 'path'
import icon from '../../../resources/icon.png?asset'
import { BliveService } from '../services/blive.service'
import { Room } from '../types/window'
import { LiveRoomWindow } from '../utils/liveRoomWindow'

const css = String.raw
const insertCSS = css`
  /** 关闭礼物栏 */
  #full-screen-interactive-wrap {
    display: none !important;
  }
  #fullscreen-danmaku-vm .fullscreen-danmaku {
    bottom: 5px !important;
  }

  .web-live-player-gift-icon-wrap {
    display: none;
  }

  /** 添加黑色底，让切换时不会突然闪白色 */
  body {
    overflow: hidden !important;
    background: black;
  }

  html {
    background: black;
  }

  /** 去掉水印 */
  .web-player-icon-roomStatus {
    display: none;
  }

  /* 去掉反馈按钮 */
  .web-player-icon-feedback {
    display: none;
  }

  /** 全屏播放器 */
  .live-room-app .app-content .app-body .player-and-aside-area .left-container {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw !important;
    height: 100vh;
    display: flex;
  }

  /** 移除下播后的推荐 */
  #live-player > div.web-player-ending-panel > div > div.web-player-ending-panel-recommendList {
    display: none !important;
  }

  /** 移除一下杂七杂八的东西 */
  .shop-popover,
  #link-footer-vm,
  #sections-vm,
  #sidebar-vm,
  #room-ssr-vm,
  #head-info-vm,
  #pk-vm,
  #awesome-pk-vm,
  #gift-control-vm {
    display: none !important;
  }

  body:hover::after {
    opacity: 1;
  }

  /** 拖拽栏 */
  body::after {
    color: rgb(241, 241, 241);
    opacity: 0;
    content: ' - 拖拽 - ';
    background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
    transition: all 0.3s;
    /* -webkit-app-region: drag; */
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999999;
    width: 100vw;
    height: 40px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /** 幻星派对互动按钮 */
  #game-id {
    display: none !important;
  }

  @media screen and (max-height: 560px) {
    #anchor-guest-box-id {
      transform: translate(-50%, 0) scale(0.8) !important;
      bottom: 0;
      top: 0 !important;
    }
  }
`

export async function mainWindow(room: Room) {
  const window = new LiveRoomWindow(room, {
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon,
    frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  window.webContents.insertCSS(insertCSS)

  window.on('ready-to-show', () => window.show())

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (app.isPackaged) {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    window.loadURL(`https://live.bilibili.com/732?winId=${window.id}`)
  }

  console.log(new BliveService(window))

  return window
}
