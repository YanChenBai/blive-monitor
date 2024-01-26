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

  css: string = ''
  html() {
    return ``
  }

  connected() {
    //
  }

  connectedCallback() {
    if (this.shadowRoot) this.shadowRoot.innerHTML = `<style> ${this.css}</style> ${this.html()}`
    this.connected()
  }
}

export interface Ref<T> {
  value: T
}
