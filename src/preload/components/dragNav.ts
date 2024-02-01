import { BliveService } from '@preload/utils/invoke'
import { html, css, Component, tag, createComponent } from '@preload/utils/component'
import { UserInfo } from '@preload/components/userInfo'
import { watch } from '@vue/runtime-core'
import { controlBarStatus } from '@preload/utils/status'

@tag('drag-nav')
export class DragNav extends Component {
  css = css`
    .drag-nav {
      color: rgb(241, 241, 241);
      opacity: 0;
      background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
      transition: all 0.3s;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999;
      width: 100vw;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .drag {
      width: 100%;
      flex: 1;
      height: 42px;
      -webkit-app-region: drag;
    }
    .no-drag {
      -webkit-app-region: no-drag;
    }
    .show {
      opacity: 1;
    }
  `

  bliveService = new BliveService()
  render() {
    return html`
      <div class="drag-nav">
        <div class="drag"></div>
        <div class="no-drag"></div>
      </div>
    `
  }

  connected() {
    const navEl = this.shadowRoot?.querySelector('.drag-nav') as HTMLDivElement
    const noDragEl = navEl.querySelector('.no-drag') as HTMLDivElement
    const userInfoEl = createComponent(UserInfo)
    this.bliveService.getRoomInfo().then((room) => {
      userInfoEl.room = room
      noDragEl.appendChild(userInfoEl)
    })

    watch(controlBarStatus, (val) => {
      navEl.classList.toggle('show', val)
    })
  }
}
