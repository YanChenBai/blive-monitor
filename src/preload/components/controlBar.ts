// eslint-disable-next-line vue/prefer-import-from-vue
import { ref, watch } from '@vue/runtime-core'
import { html, css, CreateComponent } from '../utils/createComponent'
import { ControlBtn } from './controlBtn'
import { ipcInvoke } from '../utils/invoke'

export class ControlBar extends CreateComponent {
  status = ref(false)
  showDanmuBtn = ref(true)

  constructor() {
    super()
  }

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

  template = () =>
    html`<div class="control-bar">
      <control-btn
        id="closeWin"
        color="rgb(243, 59, 99)"
        content="关闭"
        title="关闭窗口"
      ></control-btn>
      <control-btn id="minWin" color="#00aeec" content="最小" title="窗口最小化"></control-btn>
      <control-btn
        id="switchDanmu"
        color="#f288a6ff"
        content="弹幕"
        title="弹幕快捷发送,回车可打开"
        class="danmu-btn"
      ></control-btn>
      <control-btn id="alwaysOnTop" color="#64d496" content="置顶" title="窗口置顶"></control-btn>
      <control-btn
        id="aspectRatio"
        color="#fbc94b"
        content="比例"
        title="窗口比例锁定"
      ></control-btn>
    </div> `

  connected() {
    const danmuBtnEl = this.shadowRoot?.querySelector('.danmu-btn') as ControlBtn
    const controlBarEl = this.shadowRoot?.querySelector('.control-bar') as HTMLDivElement

    watch(this.status, (val) => {
      this.shadowRoot?.querySelector('.control-bar')?.classList.toggle('show', val)
    })

    watch(this.showDanmuBtn, (val) => danmuBtnEl.classList.toggle('hide-btn', val))

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.status.value = false
      }
    })

    // 单击弹幕切换按钮
    controlBarEl.addEventListener('click', (e) => {
      const target = e.target as ControlBtn
      if (target.tagName === 'CONTROL-BTN') {
        switch (target.id) {
          case 'switchDanmu':
            this.switchDanmu()
            break
          case 'closeWin':
            ipcInvoke('closeWin')
            break
          case 'minWin':
            ipcInvoke('minWin')
            break
        }
      }
    })
  }

  switchDanmu() {
    //
  }
}
