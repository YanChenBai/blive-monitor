import {
  html,
  css,
  Component,
  tag,
  createComponent,
  Props,
  batchAdd,
  switchElement
} from '@preload/utils/component'
import { ControlBtn } from './controlBtn'
import {
  controlBarStatus,
  watch,
  openControlBar,
  closeControlBar,
  closeDanmuInput,
  switchDanmuInput
} from '@preload/utils/status'
import { Close, Minimize, Danmu, Pin, Pined, Refresh } from './icons'
import { BliveInvoke } from '@preload/utils/invoke'
import { awaitLivePlayer } from '@preload/utils/livePlayer'

function createBrn(props: Props<ControlBtn>) {
  return createComponent(ControlBtn, props)
}

const btns = {
  closeWin: createBrn({
    color: 'rgb(243, 59, 99)',
    content: Close,
    title: '关闭窗口'
  }),
  minWin: createBrn({
    color: '#00aeec',
    content: Minimize,
    title: '窗口最小化'
  }),
  switchDanmuInput: createBrn({
    color: '#f288a6ff',
    content: Danmu,
    title: '弹幕快捷发送,回车可打开'
  }),
  refresh: createBrn({
    color: '#feb44d',
    content: Refresh,
    title: '刷新'
  }),
  alwaysOnTopLock: createBrn({
    color: '#64d496',
    content: Pin,
    title: '窗口置顶'
  }),
  alwaysOnTopUnlock: createBrn({
    color: '#64d496',
    content: Pined,
    title: '窗口取消置顶'
  })
}

@tag('control-bar')
export class ControlBar extends Component {
  css = css`
    .control-bar {
      padding: 6px;
      border-radius: 10px;
      position: fixed;
      z-index: 99999999999;
      right: 10px;
      top: 50vh;
      transform: translate(calc(100% + 10px), -50%) scale(0);
      transition: transform 0.3s ease-in-out;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .show {
      transform: translate(0px, -50%) scale(1);
    }

    .hide-btn {
      display: none;
    }
  `

  render() {
    return html`<div class="control-bar"></div>`
  }

  hideDanmuBtn = false
  bliveInvoke = new BliveInvoke()

  set setHideDanmuBtn(value: boolean) {
    this.hideDanmuBtn = value
    btns.switchDanmuInput.classList.toggle('hide-btn', value)
  }

  async connected() {
    const controlBarEl = this.shadowRoot?.querySelector('.control-bar') as HTMLDivElement

    batchAdd(controlBarEl, Object.values(btns))

    switchElement(
      [btns.alwaysOnTopLock, btns.alwaysOnTopUnlock],
      await this.bliveInvoke.getAlwaysOnTop()
    )

    // 监听控制栏显示状态
    watch(
      controlBarStatus,
      (val) => {
        controlBarEl.classList.toggle('show', val)
      },
      true
    )

    document.onmousemove = (event: MouseEvent & { ignore?: boolean }) => {
      if (event.ignore !== true) {
        openControlBar()
      }
    }

    document.onmouseleave = () => {
      closeControlBar()
      closeDanmuInput()
    }

    btns.minWin.onClickBtn = () => {
      this.bliveInvoke.minWin()
    }

    btns.closeWin.onClickBtn = () => {
      this.bliveInvoke.closeWin()
    }

    btns.alwaysOnTopLock.onClickBtn = () => {
      this.bliveInvoke.setAlwaysOnTop(true)
    }

    btns.alwaysOnTopUnlock.onClickBtn = () => {
      this.bliveInvoke.setAlwaysOnTop(false)
    }

    btns.switchDanmuInput.onClickBtn = () => switchDanmuInput()

    btns.refresh.onClickBtn = () => {
      awaitLivePlayer().then((livePlayer) => {
        livePlayer.refresh()
      })
    }
  }
}
