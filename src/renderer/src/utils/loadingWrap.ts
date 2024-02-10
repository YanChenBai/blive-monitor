import type { Ref } from 'vue'

export function loadingWrap<T = any>(
  state: Record<string, boolean>,
  key: string,
  func: () => Promise<T>
): Promise<T> {
  state[key] = true
  return func()
    .then((res) => {
      state[key] = false
      return res
    })
    .catch((err) => {
      state[key] = false
      return err
    })
}

export function loadingWrapRef<T = any>(state: Ref<boolean>, func: () => Promise<T>): Promise<T> {
  state.value = true
  return func()
    .then((res) => {
      state.value = false
      return res
    })
    .catch((err) => {
      state.value = false
      return err
    })
}
