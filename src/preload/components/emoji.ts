import type { Emoticons } from './../types/emoji'
import { html, css, CreateComponent } from '../utils/createComponent'

export class EmojiItem extends CreateComponent {
  constructor() {
    super()
  }

  css = css`
    .item {
      padding: 4px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `

  html = () => {
    const src = this.getAttribute('src') || ''
    return html`
      <div class="item">
        <img src="${src}" />
      </div>
    `
  }
}

export class EmojiWrap extends CreateComponent {
  constructor() {
    super()
  }

  css = css``

  data?: Emoticons[]

  getEmojiList(index: number) {
    if (this.data)
      return this.data[index].emoticons.reduce((acc, cur, index) => {
        return (
          acc +
          html`<emoji-item src="${cur.url}" title="${cur.emoji}" index="${index}"></emoji-item> ` +
          '\n'
        )
      }, '')
    else {
      return ''
    }
  }

  html = () =>
    html`<div class="emoji-wrap">
      <div name="header"></div>
      <div class="content"></div>
    </div> `
}
