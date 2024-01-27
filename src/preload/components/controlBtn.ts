import { html, css, CreateComponent } from '../utils/createComponent'

export class ControlBtn extends CreateComponent {
  css = css`
    .control-btn {
      border: 0;
      border-radius: 6px;
      cursor: pointer;
      padding: 2px 4px;
      transition: all 0.3s;
      color: #ffffff;
      font-size: 12px;
      line-height: 26px;
      height: 26px;
      width: 32px;
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
  template = () => {
    const content = this.getAttribute('content') || ''
    const title = this.getAttribute('title') || ''
    const color = this.getAttribute('color') || ''

    const style = css`
      background-color: ${color};
    `

    return html` <button class="control-btn" title="${title}" style="${style}">${content}</button> `
  }
}
