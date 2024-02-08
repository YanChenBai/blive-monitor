import { Status, watch } from './status'

export const html = String.raw
export const css = String.raw

/** 注册标签 */
export function tag(tagName: string) {
  return (target: typeof Component) => {
    target.regtagName = tagName
    customElements.define(tagName, target)
  }
}

export type Props<P> = Partial<Omit<P, 'css' | 'render' | 'connected' | 'connectedCallback'>>

/** 创建组件 */
export function createComponent<T extends typeof Component>(
  component: T,
  props?: Props<InstanceType<T>>
) {
  const dom = document.createElement(component.regtagName) as InstanceType<T>
  for (const key in props) {
    if (props[key]) dom[key] = props[key]
  }
  return dom
}

/** 批量添加 */
export function batchAdd(el: HTMLElement, els: HTMLElement[]) {
  return els.map((item) => el.appendChild(item))
}

/** 切换元素 */
export function switchElement(els: [HTMLElement, HTMLElement], initValue: boolean) {
  const signal = new Status(initValue)
  const displayValue = els.map((item) => {
    item.addEventListener('click', () => (signal.value = !signal.value))
    return item.style.display
  })

  /** 监听需修改 */
  watch(
    signal,
    (val: boolean) =>
      els.forEach((item, index) => {
        const isHide = (index === 0) === val
        item.style.display = isHide ? 'none' : displayValue[index]
      }),
    true
  )

  return signal
}

/**
 * 创建组件
 */
export class Component extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
  static regtagName: string = ''

  /** css样式 */
  css: string = ''

  /** html内容 */
  render() {
    return ``
  }

  /** 获取渲染html */
  getRender() {
    return `<style> ${this.css}</style> ${this.render()}`
  }

  /** 重新渲染 */
  reRender() {
    if (this.shadowRoot) {
      const oldHtml = this.shadowRoot.innerHTML
      const newHtml = this.getRender()
      if (oldHtml !== newHtml) {
        this.shadowRoot.innerHTML = newHtml
      }
    }
  }

  /** 挂载后的回调 */
  connected(_shadowRoot: ShadowRoot) {
    //
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.getRender()
      this.connected(this.shadowRoot)
    }
  }
}
