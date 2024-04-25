import { Component, tag, css, html } from '@preload/utils/component'
import { EmojiTabs } from './emoji'
import {
  danmuInputStatus,
  danmuInputIsFocus,
  Status,
  watch,
  openControlBar,
  closeControlBar,
  closeDanmuInput,
  switchDanmuInput
} from '@preload/utils/status'
import { BliveInvoke } from '@preload/utils/invoke'
import { Emoticons } from '@type/emoji'
import lodash from 'lodash'
import { onSendText } from '@preload/utils/monitor'

/** 匹配可输入的最大弹幕 */
function matchMaxDanmu() {
  const regex = /0\/(\d+)/
  return new Promise<number>((res) => {
    const timer = setInterval(() => {
      const dom = document.querySelector('.input-limit-hint') as HTMLDivElement
      if (!dom) return
      const match = dom.innerText.match(regex)
      clearInterval(timer)
      return res(match ? Number(match[1]) : 20)
    }, 200)
  })
}

@tag('danmu-send')
export class DanmuSend extends Component {
  css = css`
    .wrap {
      width: 240px;
      position: fixed;
      z-index: 9999999999;
      right: 54px;
      top: 50vh;
      transform: translate(calc(54px + 240px), -50%) scale(0);
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
      transform: translate(0, -50%) scale(1);
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

  bliveInvoke = new BliveInvoke()
  maxlen = new Status(20)
  inputlen = new Status(0)
  data: Emoticons[] = []

  updateMaxlen() {
    const maxlenEl = this.shadowRoot?.querySelector('.maxlen') as HTMLDivElement
    const inputEl = this.shadowRoot?.querySelector('input') as HTMLInputElement

    maxlenEl.innerText = `${Math.min(this.inputlen.value, this.maxlen.value)}/${this.maxlen.value}`
    inputEl.maxLength = this.maxlen.value
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
        if (inputEl.value.trim().length > 0 && danmuInputStatus.value) {
          this.send(inputEl.value)
          // 清空输入框
          inputEl.value = ''
          this.inputlen.value = 0
        }

        danmuInputStatus.value ? inputEl.blur() : inputEl.focus()

        // 输入框打开时同时打开控制栏
        switchDanmuInput()
      }

      if (e.key === 'Escape') {
        closeControlBar(true)
        closeDanmuInput(true)
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
    watch([this.maxlen, this.inputlen], () => this.updateMaxlen(), true)

    // 更新显示状态
    watch(
      danmuInputStatus,
      lodash.debounce((val) => {
        // 输入框打开时同时打开控制栏
        if (val) openControlBar()

        wrapEl.classList.toggle('show', val)
      }, 100)
    )

    // 获取可输入弹幕的长度
    matchMaxDanmu().then((maxlen) => {
      console.log('get maxlen:', maxlen)

      this.maxlen.value = maxlen
    })

    onSendText((content) => {
      if (typeof content === 'string') this.send(content)
    })
  }
}
