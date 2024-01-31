import { html, css, Component, tag } from '../utils/component'

@tag('control-btn')
export class ControlBtn extends Component {
  css = css`
    .control-btn {
      border: 0;
      border-radius: 16px;
      cursor: pointer;
      padding: 6px;
      transition: all 0.3s;
      color: #ffffff;
      line-height: 28px;
      height: 28px;
      width: 28px;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
    }
    .control-btn:hover {
      opacity: 0.8;
    }
  `

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

  color = ''
  content = ''
  title = ''
}
