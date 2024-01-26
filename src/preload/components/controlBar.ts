// eslint-disable-next-line vue/prefer-import-from-vue
import { ref, watch } from '@vue/runtime-core'
import { html, css, CreateComponent } from '../utils/createComponent'

export class ControlBar extends CreateComponent {
  status = ref(false)

  constructor() {
    super()
  }

  css = css`
    .control-bar {
      padding: 6px;
      border-radius: 10px;
      position: fixed;
      z-index: 98888;
      right: 10px;
      top: 50vh;
      transform: translate(calc(100% + 10px), -50%);
      transition: all 0.3s;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .show {
      transform: translate(0px, -50%);
    }

    ::slotted(div) {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  `

  html = () =>
    html`<div class="control-bar">
      <slot name="content"> </slot>
    </div> `

  connected() {
    watch(this.status, (val) => {
      this.shadowRoot?.querySelector('.control-bar')?.classList.toggle('show', val)
    })
  }
}
