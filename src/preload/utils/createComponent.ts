export const html = String.raw
export const css = String.raw

/**
 * 创建组件
 */
export class CreateComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  /** css样式 */
  css: string = ''

  /** html内容 */
  template() {
    return ``
  }

  /** 挂载后的回调 */
  connected() {
    //
  }

  connectedCallback() {
    if (this.shadowRoot)
      this.shadowRoot.innerHTML = `<style> ${this.css}</style> ${this.template()}`
    this.connected()
  }
}
