import { ref, watch } from '@vue/runtime-core'

export const html = String.raw
export const css = String.raw

/** 注册标签 */
export function Tag(tagName: string) {
  return (target: typeof Component) => {
    target.regTagName = tagName
    customElements.define(tagName, target)
  }
}

export type Props<P> = Partial<Omit<P, 'css' | 'render' | 'connected' | 'connectedCallback'>>

/** 创建组件 */
export function createComponent<T extends typeof Component>(
  component: T,
  props?: Props<InstanceType<T>>
) {
  const dom = document.createElement(component.regTagName) as InstanceType<T>
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
  const signal = ref(initValue)
  const displayValue = els.map((item) => {
    item.onclick = () => (signal.value = !signal.value)
    return item.style.display
  })

  /** 监听需修改 */
  watch(
    signal,
    (val) => {
      els.forEach((item, index) => {
        const isHide = (index === 0) === val
        item.style.display = isHide ? 'none' : displayValue[index]
      })
    },
    { immediate: true }
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
  static regTagName: string = ''

  /** css样式 */
  css: string = ''

  /** html内容 */
  render() {
    return ``
  }

  /** 挂载后的回调 */
  connected() {
    //
  }

  connectedCallback() {
    if (this.shadowRoot) this.shadowRoot.innerHTML = `<style> ${this.css}</style> ${this.render()}`
    this.connected()
  }
}
