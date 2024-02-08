import { Room } from '@main/types/window'
import { html, css, Component, tag } from '@preload/utils/component'
import { controlBarStatus, watch } from '@preload/utils/status'

@tag('user-info')
export class UserInfo extends Component {
  css = css`
    .user-info {
      z-index: 99999;
      width: fit-content;
      display: flex;
      align-items: center;
      transition: opacity 0.3s;
      user-select: none;
      cursor: pointer;
      margin-right: 10px;
      margin-top: 10px;
      opacity: 0;
    }
    .face {
      overflow: hidden;
      height: 32px;
      height: 32px;
      display: flex;
      border-radius: 16px;
    }
    .face img {
      width: 100%;
    }
    .uname {
      padding: 0 6px;
      line-height: 32px;
      font-size: 14px;
    }

    .show {
      opacity: 1;
    }
  `
  room?: Room

  render() {
    return html`
      <div class="user-info" title="${this.room?.name}">
        <div class="uname">${this.room?.name}</div>
        <div class="face">
          <img src="${this.room?.face}" />
        </div>
      </div>
    `
  }

  connected() {
    const userInfoEl = this.shadowRoot?.querySelector('.user-info') as HTMLDivElement
    watch(
      controlBarStatus,
      (val) => {
        userInfoEl.classList.toggle('show', val)
      },
      true
    )
  }
}
