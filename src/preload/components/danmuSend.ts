import { ref, watch } from '@vue/runtime-core'
import { Component, tag, css, html } from '@preload/utils/component'
import { EmojiTabs } from './emoji'
import { controlBarStatus, danmuInputStatus, danmuInputIsFocus } from '@preload/utils/status'
import { BliveService } from '@preload/utils/invoke'
import { Emoticons } from '@preload/types/emoji'

@tag('danmu-send')
export class DanmuSend extends Component {
  css = css`
    .wrap {
      width: 240px;
      position: fixed;
      z-index: 9999999999;
      right: 64px;
      top: 50vh;
      transform: translate(calc(64px + 240px), -50%);
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
      background: #fff;
      border-radius: 10px;
      transition: transform 0.4s;
    }
    .danmu-input {
      width: 100%;
      height: 36px;
      box-sizing: border-box;
      font-size: 14px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .danmu-input input {
      width: 180px;
      height: 24px;
      line-height: 24px;
      box-sizing: border-box;
      font-size: 12px;
      padding: 0 10px;
      outline: none;
      border-radius: 8px;
      border: 0;
    }
    .maxlen {
      font-size: 12px;
      line-height: 24px;
      margin-right: 6px;
    }
    .show {
      transform: translate(0, -50%);
    }
  `

  render() {
    return html`
      <div class="wrap">
        <div class="danmu-input">
          <input type="text" placeholder="回车发送/打开" />
          <div class="maxlen">${this.maxlen.value}</div>
        </div>
      </div>
    `
  }

  bliveService = new BliveService()
  maxlen = ref(20)
  inputlen = ref(0)
  data: Emoticons[] = []

  updateMaxlen() {
    const maxlenEl = this.shadowRoot?.querySelector('.maxlen') as HTMLDivElement
    maxlenEl.innerText = `${Math.min(this.inputlen.value, this.maxlen.value)}/${this.maxlen.value}`
  }

  send(msg: string) {
    msg = msg.trim()
    if (msg.length <= 0) {
      return
    }
    const textarea = document.querySelector(
      '#control-panel-ctnr-box > div.chat-input-ctnr.p-relative > div:nth-child(2) > textarea'
    ) as HTMLTextAreaElement
    const btn = document.querySelector(
      '.control-panel-ctnr .chat-input-ctnr ~ .bottom-actions .bl-button--primary'
    ) as HTMLButtonElement

    /** 创建一个输入事件 */
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true
    })
    textarea.value = msg

    /** 触发输入事件 */
    textarea.dispatchEvent(inputEvent)

    /** 触发发送按钮 */
    btn.click()
  }

  connected() {
    const emojiTabsEl = document.createElement('emoji-tabs') as EmojiTabs

    // 绑定数据
    emojiTabsEl.data = this.data

    // 添加表情选项卡
    const wrapEl = this.shadowRoot?.querySelector('.wrap') as HTMLDivElement
    wrapEl.appendChild(emojiTabsEl)

    // 监听输入框输入
    const inputEl = this.shadowRoot?.querySelector('input') as HTMLInputElement

    inputEl.addEventListener('input', () => {
      this.inputlen.value = inputEl.value.length
    })

    // 维护一个焦点状态
    inputEl.addEventListener('focus', () => (danmuInputIsFocus.value = true))
    inputEl.addEventListener('blur', () => (danmuInputIsFocus.value = false))

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (inputEl.value.trim().length > 0) {
          this.send(inputEl.value)
          // 清空输入框
          inputEl.value = ''
          this.inputlen.value = 0
          inputEl.blur()
        }

        // 输入框打开时同时打开控制栏
        danmuInputStatus.value = !danmuInputStatus.value
      }

      if (e.key === 'Escape') {
        danmuInputStatus.value = false
        inputEl.blur()
      }
    })

    // 处理表情
    emojiTabsEl.onSelect = ({ emoji }) => {
      // 保证添加后不会超过长度
      if (emoji.length + inputEl.value.length <= 20) {
        // 添加进输入框
        inputEl.value += emoji
        const inputEvent = new Event('input', {
          bubbles: true,
          cancelable: true
        })
        inputEl.dispatchEvent(inputEvent)
      }
    }

    // 最大的弹幕长度更新
    watch(
      () => [this.maxlen.value, this.inputlen.value],
      ([maxlen]) => {
        inputEl.maxLength = maxlen
        this.updateMaxlen()
      },
      {
        immediate: true
      }
    )

    // 更新显示状态
    watch(
      danmuInputStatus,
      (val) => {
        if (val) {
          // 输入框打开时同时打开控制栏
          controlBarStatus.value = true
          inputEl.focus()
        }
        wrapEl.classList.toggle('show', val)
      },
      {
        immediate: true
      }
    )
  }
}
