import { Component, css, html, tag } from '@preload/utils/component'

@tag('control-btn')
export class ControlBtn extends Component {
  css = css`
    .control-btn {
      border: 0;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s;
      color: #ffffff;
      line-height: 22px;
      font-size: 22px;
      height: 22px;
      width: 22px;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      padding: 4px;
    }
    .control-btn:hover {
      opacity: 0.8;
    }
  `
  color = ''
  content = ''
  title = ''

  onClickBtn() {
    // 事件处理
  }

  render() {
    return html`
      <button
        class="control-btn"
        title="${this.title}"
        style="${css`
          background-color: ${this.color};
        `}"
      >
        ${this.content}
      </button>
    `
  }

  connected(shadowRoot: ShadowRoot) {
    const btnEl = shadowRoot.querySelector('.control-btn') as HTMLButtonElement
    btnEl.addEventListener('click', () => this.onClickBtn())
  }
}
