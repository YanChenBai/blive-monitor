import type { Emoticon, Emoticons } from './../types/emoji'
import { html, css, CreateComponent } from '../utils/createComponent'
// eslint-disable-next-line vue/prefer-import-from-vue
import { watch, ref } from '@vue/runtime-core'

function isClickEmojiItem(e: MouseEvent) {
  const target = e.target as EmojiItem
  return target.tagName.toLocaleLowerCase() === 'emoji-item'
}

export class EmojiItem extends CreateComponent {
  data?: Emoticon
  index = 0
  css = css`
    .emoji-item {
      cursor: pointer;
      display: flex;
      user-select: none;
    }

    .emoji-item img {
      width: 100%;
    }
  `

  template = () => {
    const src = this.getAttribute('src') || ''
    this.index = Number(this.getAttribute('index')) || 0
    return html`
      <div class="emoji-item">
        <img src="${src}" />
      </div>
    `
  }
}

export class EmojiTabHeader extends CreateComponent {
  data: Emoticons[] = []

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

  template() {
    return html`
      <div class="emoji-header">
        ${this.data.reduce(
          (pre, cur, index) =>
            html`${pre}
            ${html`
              <emoji-item src="${cur.current_cover}" title="${cur.pkg_name}" index="${index}">
              </emoji-item>
            `} `,
          ''
        )}
      </div>
    `
  }

  switchTab(index: number) {
    this.shadowRoot?.querySelector('.now')?.classList.remove('now')
    this.shadowRoot?.querySelector(`emoji-item:nth-child(${index + 1})`)?.classList.add('now')
  }

  connected() {
    // 初始化
    this.switchTab(0)

    const dom = this.shadowRoot?.querySelector('.emoji-header') as HTMLDivElement
    dom.addEventListener('click', (e) => {
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

export class EmojiTab extends CreateComponent {
  data?: Emoticons
  index = 0
  show = ref(false)

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

  template = () => {
    if (this.data === undefined) throw new Error('data is undefined')
    const hideStyle = this.data.recently_used_emoticons.length > 0 ? '' : 'hide'
    const { width, height } = this.data.emoticons[0]
    const size = `${this.getSize(width, height)}%`

    return html`
      <div class="emoji-tab">
        <div class="${hideStyle}">最近使用</div>
        <div class="emoji-rec ${hideStyle}">
          ${this.getList(this.data.recently_used_emoticons, size)}
        </div>

        <div class="${hideStyle}" style="margin-top: 6px;">全部表情</div>
        <div class="emoji-all">${this.getList(this.data.emoticons, size)}</div>
      </div>
    `
  }

  getSize(width: number, height: number) {
    if (width === 0) return 12.5
    const diff = width - height
    if (diff > 10) {
      return 25
    } else {
      return 16.66
    }
  }

  getList(list: Emoticon[], size: string) {
    return list
      .map(
        (item, index) => html`
          <emoji-item
            src="${item.url}"
            title="${item.emoji}"
            index="${index}"
            style="width:${size};"
          >
          </emoji-item>
        `
      )
      .join('')
  }

  onSelect(_data: Emoticon) {
    //
  }

  connected() {
    // 绑定数据
    if (this.shadowRoot) {
      const resEl = this.shadowRoot.querySelectorAll(
        '.emoji-rec emoji-item'
      ) as NodeListOf<EmojiItem>
      const allEl = this.shadowRoot.querySelectorAll(
        '.emoji-all emoji-item'
      ) as NodeListOf<EmojiItem>

      resEl.forEach((item, index) => (item.data = this.data?.recently_used_emoticons[index]))
      allEl.forEach((item, index) => (item.data = this.data?.emoticons[index]))
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
      { immediate: true }
    )
  }
}

export class EmojiTabs extends CreateComponent {
  data: Emoticons[] = []
  tabs: EmojiTab[] = []
  isShow: number[] = []
  setp = 10

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

  template = () => html`
    <div class="emoji-tabs">
      <div class="emoji-tabs-header"></div>
      <div class="emoji-tabs-body"></div>
    </div>
  `

  // 隐藏所有选项卡
  hiddenTab() {
    for (const tab of this.tabs) {
      tab.show.value = false
    }
  }

  // 切换选项卡
  switchTab(index: number) {
    this.hiddenTab()
    const tab = this.tabs[index]
    tab.show.value = true

    // 判断是否已经渲染过了
    if (!this.isShow.includes(index)) {
      this.isShow.push(index)
      this.shadowRoot?.querySelector('.emoji-tabs-body')?.appendChild(tab)
    }
  }

  onSelect(_data: Emoticon, _pkg_type: number) {
    //
  }

  connected() {
    // 创建选项卡头部并渲染
    const tabHeaderEl = document.createElement('emoji-tab-header') as EmojiTabHeader
    tabHeaderEl.data = this.data
    this.shadowRoot?.querySelector('.emoji-tabs-header')?.appendChild(tabHeaderEl)

    // 创建选项卡
    this.tabs = this.data.map((item, index) => {
      const dom = document.createElement('emoji-tab') as EmojiTab
      dom.index = index
      dom.data = item
      dom.show.value = true
      dom.onSelect = (data) => this.onSelect(data, item.pkg_type)
      return dom
    })

    // 阻止冒泡,避免滚动调整音量触发 和 滚动间隔调整
    const tabsBody = this.shadowRoot?.querySelector('.emoji-tabs-body') as HTMLDivElement

    tabsBody.addEventListener('wheel', (event) => {
      tabsBody.scrollTop += event.deltaY > 0 ? this.setp : -this.setp
      event.preventDefault()
      event.stopPropagation()
    })

    // 初始化一下
    this.switchTab(0)
    tabHeaderEl.onChange = (index) => this.switchTab(index)
  }
}
