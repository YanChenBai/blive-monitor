import type { Emoticon, Emoticons } from '@preload/types/emoji'
import { html, css, Component, tag, createComponent, batchAdd } from '@preload/utils/component'
import { awaitLivePlayer } from '@preload/utils/livePlayer'
import { Status, watch } from '@preload/utils/status'
// eslint-disable-next-line vue/prefer-import-from-vue
import lodash from 'lodash'

function isClickEmojiItem(e: MouseEvent) {
  const target = e.target as EmojiItem
  return target.tagName.toLocaleLowerCase() === 'emoji-item'
}

@tag('emoji-item')
export class EmojiItem extends Component {
  css = css`
    .emoji-item {
      cursor: pointer;
      display: flex;
      user-select: none;
    }

    .emoji-item img {
      width: 100%;
    }
    .not {
      opacity: 0.5;
    }
  `

  render() {
    return html`
      <div class="emoji-item ${this.data?.perm === 0 ? 'not' : ''}">
        <img src="${this.src}" />
      </div>
    `
  }

  data?: Emoticon
  index = 0
  src = ''
}

@tag('emoji-tab-header')
export class EmojiTabHeader extends Component {
  css = css`
    .emoji-header {
      width: 100%;
      display: flex;
      box-sizing: border-box;
      background: #f1f2f3;
    }

    .emoji-header emoji-item {
      width: 24px;
      height: 24px;
      padding: 6px;
      transition: all 0.3s;
    }
    .emoji-header emoji-item:hover,
    .now {
      background: #fff;
    }
  `

  render() {
    return html`<div class="emoji-header"></div>`
  }

  data: Emoticons[] = []

  switchTab(index: number) {
    this.shadowRoot?.querySelector('.now')?.classList.remove('now')
    this.shadowRoot?.querySelector(`emoji-item:nth-child(${index + 1})`)?.classList.add('now')
  }

  connected() {
    const emojiHeader = this.shadowRoot?.querySelector('.emoji-header') as HTMLDivElement
    batchAdd(
      emojiHeader,
      this.data.map((item, index) =>
        createComponent(EmojiItem, {
          index,
          src: item.current_cover,
          title: item.pkg_name
        })
      )
    )

    // 初始化
    this.switchTab(0)

    emojiHeader.addEventListener('click', (e) => {
      if (isClickEmojiItem(e)) {
        const target = e.target as EmojiItem
        this.switchTab(target.index)
        this.onChange(target.index)
      }
    })
  }

  onChange(_index: number) {
    //
  }
}

@tag('emoji-tab')
export class EmojiTab extends Component {
  css = css`
    .emoji-tab {
      width: 100%;
      display: none;
      box-sizing: border-box;
      padding-right: 6px;
    }
    .emoji-tab emoji-item {
      padding: 2px;
      border-radius: 4px;
      box-sizing: border-box;
      transition: all 0.3s;
    }
    .emoji-tab emoji-item:hover {
      background-color: #f1f2f3;
    }
    .emoji-rec,
    .emoji-all {
      font-size: 12px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: left;
    }
    .hide {
      display: none;
    }
    .now {
      display: block;
    }
  `

  render() {
    if (this.data === undefined) throw new Error('data is undefined')
    const hideStyle = this.data.recently_used_emoticons.length > 0 ? '' : 'hide'

    return html`
      <div class="emoji-tab">
        <div class="${hideStyle}">最近使用</div>
        <div class="emoji-rec ${hideStyle}"></div>

        <div class="${hideStyle}" style="margin-top: 6px;">全部表情</div>
        <div class="emoji-all"></div>
      </div>
    `
  }

  data?: Emoticons
  index = 0
  show = new Status(false)
  /** 是否渲染过 */
  rendered = false

  getSize(width: number, height: number) {
    if (width === 0) return 12.5
    const diff = width - height
    if (diff > 10) {
      return 25
    } else {
      return 16.66
    }
  }

  getItems(list: Emoticon[], size: string) {
    return list.map((item, index) => {
      const dom = createComponent(EmojiItem, {
        data: item,
        index,
        src: item.url
      })
      dom.style.width = size
      return dom
    })
  }

  onSelect(_data: Emoticon) {
    //
  }

  connected() {
    // 绑定数据
    if (this.shadowRoot && this.data) {
      const resEl = this.shadowRoot.querySelector('.emoji-rec') as HTMLDivElement
      const allEl = this.shadowRoot.querySelector('.emoji-all') as HTMLDivElement

      const { width, height } = this.data.emoticons[0]
      const size = `${this.getSize(width, height)}%`

      batchAdd(resEl, this.getItems(this.data.recently_used_emoticons, size))
      batchAdd(allEl, this.getItems(this.data.emoticons, size))
    }

    //监听单击的表情
    ;(this.shadowRoot?.querySelector('.emoji-tab') as HTMLDivElement).addEventListener(
      'click',
      (e) => {
        if (isClickEmojiItem(e)) {
          const target = e.target as EmojiItem
          if (target.data) this.onSelect(target.data)
        }
      }
    )

    // 切换选项卡
    watch(
      this.show,
      (val) => {
        const dom = this.shadowRoot?.querySelector('.emoji-tab') as HTMLDivElement
        dom.classList.toggle('now', val)
      },
      true
    )
  }
}

@tag('emoji-tabs')
export class EmojiTabs extends Component {
  css = css`
    .emoji-tabs {
      overflow: hidden;
      padding-bottom: 6px;
    }

    .emoji-tabs-body {
      box-sizing: border-box;
      padding: 6px 0 6px 6px;
      height: 120px;
      overflow-y: scroll;
    }

    .emoji-tabs-body::-webkit-scrollbar {
      width: 6px;
    }

    .emoji-tabs-body::-webkit-scrollbar-thumb {
      background-color: #aaaaaa;
      border-radius: 10px;
    }

    .emoji-tabs-body::-webkit-scrollbar-thumb:hover {
      background-color: #aaaaaa;
    }
  `

  render() {
    return html`
      <div class="emoji-tabs">
        <div class="emoji-tabs-header"></div>
        <div class="emoji-tabs-body"></div>
      </div>
    `
  }

  data: Emoticons[] = []
  tabs: EmojiTab[] = []
  setp = 10

  // 切换选项卡
  switchTab(index: number) {
    // 隐藏所有选项卡
    for (const tab of this.tabs) {
      tab.show.value = false
    }

    const tab = this.tabs[index]
    tab.show.value = true

    // 判断是否已经渲染过了
    if (!tab.rendered) {
      tab.rendered = true
      this.shadowRoot?.querySelector('.emoji-tabs-body')?.appendChild(tab)
    }
  }

  // 选择表情回调
  onSelect(data: Emoticon) {
    console.log(data)
  }

  /**
   * 发送表情
   * @param emoji 表情
   */
  async send(data: Emoticon) {
    const livePlayer = await awaitLivePlayer()
    return await livePlayer.sendDanmaku({
      msg: data.emoticon_unique,
      mode: 1,
      bubble: 0,
      dm_type: 1,
      emoticonOptions: {
        bulgeDisplay: data.bulge_display,
        emoji: data.emoji,
        emoticonUnique: data.emoticon_unique,
        height: data.height,
        width: data.width,
        url: data.url,
        inPlayerArea: data.in_player_area,
        isDynamic: data.is_dynamic
      }
    })
  }

  connected() {
    const tabsBody = this.shadowRoot?.querySelector('.emoji-tabs-body') as HTMLDivElement
    const tabsHeader = this.shadowRoot?.querySelector('.emoji-tabs-header') as HTMLDivElement

    // 创建选项卡头部并渲染
    tabsHeader.appendChild(
      createComponent(EmojiTabHeader, {
        data: this.data,
        onChange: (index) => this.switchTab(index)
      })
    )

    const send = lodash.throttle((data) => this.send(data), 5000)

    // 创建选项卡
    this.tabs = this.data.map((item, index) =>
      createComponent(EmojiTab, {
        index,
        data: item,
        show: new Status(true),
        onSelect: (data) => {
          if (item.pkg_type === 3) {
            this.onSelect(data)
          } else {
            if (data.perm === 1) send(data)
          }
        }
      })
    )

    // 初始化一下
    this.tabs.length > 0 && this.switchTab(0)

    // 阻止冒泡,避免滚动调整音量触发 和 滚动间隔调整
    tabsBody.addEventListener('wheel', (ev) => {
      tabsBody.scrollTop += ev.deltaY > 0 ? this.setp : -this.setp
      ev.preventDefault()
      ev.stopPropagation()
    })
  }
}
