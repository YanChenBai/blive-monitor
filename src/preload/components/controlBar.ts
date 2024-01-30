import { ref, watch } from '@vue/runtime-core'
import {
  html,
  css,
  Component,
  Tag,
  createComponent,
  Props,
  batchAdd,
  switchElement
} from '../utils/component'
import { ControlBtn } from './controlBtn'
import { BliveService, ipcInvoke } from '../utils/invoke'
import { controlBarStatus, danmuInputStatus, danmuInputIsFocus } from '../utils/status'
import {
  LetsIconsCloseRound,
  CiRemoveMinus,
  LetsIconsChatFill,
  Pin,
  Pined,
  Lock,
  UnLock
} from './icons'

function createBrn(props: Props<ControlBtn>) {
  return createComponent(ControlBtn, props)
}

const btns = {
  closeWin: createBrn({
    color: 'rgb(243, 59, 99)',
    content: LetsIconsCloseRound,
    title: '关闭窗口'
  }),
  minWin: createBrn({
    color: '#00aeec',
    content: CiRemoveMinus,
    title: '窗口最小化'
  }),
  switchDanmuInput: createBrn({
    color: '#f288a6ff',
    content: LetsIconsChatFill,
    title: '弹幕快捷发送,回车可打开'
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
  }),
  aspectRatioLock: createBrn({
    color: '#fbc94b',
    content: UnLock,
    title: '窗口比例锁定'
  }),
  aspectRatioUnlock: createBrn({
    color: '#fbc94b',
    content: Lock,
    title: '窗口比例解锁'
  })
}

@Tag('control-bar')
export class ControlBar extends Component {
  css = css`
    .control-bar {
      padding: 6px;
      border-radius: 10px;
      position: fixed;
      z-index: 98888;
      right: 10px;
      top: 50vh;
      transform: translate(calc(100% + 10px), -50%);
      transition: transform 0.3s;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .show {
      transform: translate(0px, -50%);
    }

    .hide-btn {
      display: none;
    }
  `

  hideDanmuBtn = ref(false)
  bliveService = new BliveService()

  render() {
    return html`<div class="control-bar"></div>`
  }

  connected() {
    const controlBarEl = this.shadowRoot?.querySelector('.control-bar') as HTMLDivElement

    batchAdd(controlBarEl, Object.values(btns))

    switchElement([btns.aspectRatioLock, btns.aspectRatioUnlock], false)
    switchElement([btns.alwaysOnTopLock, btns.alwaysOnTopUnlock], false)

    watch(controlBarStatus, (val) => {
      this.shadowRoot?.querySelector('.control-bar')?.classList.toggle('show', val)
    })

    watch(this.hideDanmuBtn, (val) => btns.switchDanmuInput.classList.toggle('hide-btn', val), {
      immediate: true
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        controlBarStatus.value = false
      }
    })

    document.onmousemove = () => {
      controlBarStatus.value = true
    }

    document.onmouseleave = () => {
      if (!danmuInputIsFocus.value) {
        controlBarStatus.value = false
        danmuInputStatus.value = false
      }
    }

    btns.minWin.onclick = () => {
      ipcInvoke('minWin')
    }

    btns.closeWin.onclick = () => {
      ipcInvoke('closeWin')
    }

    btns.alwaysOnTopLock.onclick = () => {
      this.bliveService.setAlwaysOnTop('', true)
    }
    btns.alwaysOnTopUnlock.onclick = () => {
      this.bliveService.setAlwaysOnTop('', false)
    }

    btns.switchDanmuInput.onclick = () => {
      danmuInputStatus.value = !danmuInputStatus.value
    }
  }
}
