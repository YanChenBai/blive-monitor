import { html } from 'proper-tags'
import { ipcRenderer } from 'electron'
import { win_id } from './getWinId'
import { OpenRoom } from '../../../types/bili'
import { createDom, ref } from './tools'

export function createUaerInfo(room: OpenRoom) {
  createDom(html`
    <div class="user-info" blive-monitor>
      <div class="face">
        <img src="${room.face}" />
      </div>
      <div class="name">${room.name}</div>
    </div>
  `)

  const userInfo = document.querySelector('.user-info[blive-monitor]') as HTMLDivElement
  const userInfoIsOpen = ref(false, (value) => {
    userInfo.classList.toggle('open', value)
  })

  return { userInfoIsOpen }
}
