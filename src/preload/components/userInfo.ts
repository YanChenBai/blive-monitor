import type { Room } from '@type/room'
import { Component, css, html, tag } from '@preload/utils/component'
import { controlBarStatus, watch } from '@preload/utils/status'

@tag('user-info')
export class UserInfo extends Component {
  css = css`
    .user-info {
      width: fit-content;
      display: flex;
      align-items: center;
      transition: all 0.3s;
      user-select: none;
      cursor: pointer;
      opacity: 0;
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 99999;
      transform: scale(0);
      transform-origin: right;
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
      color: #fff;
    }

    .show {
      transform: scale(1);
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
      true,
    )
  }
}
