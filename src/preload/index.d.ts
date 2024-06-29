import { InvokeTransform } from '@type/invoke'
import type { LivePlayer } from '@type/livePlayer'
import { MainHandleInterface } from '@type/handle'

declare global {
  interface Window {
    livePlayer?: LivePlayer
    mainInvoke: InvokeTransform<MainHandleInterface>
    Vue: {
      nextTick(): Promise<void>
    }
  }
}
