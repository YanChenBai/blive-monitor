import type { InvokeTransform } from '@type/invoke'
import type { LivePlayer } from '@type/livePlayer'
import type { MainHandleInterface } from '@type/handle'

declare global {
  interface Window {
    livePlayer?: LivePlayer
    mainInvoke: InvokeTransform<MainHandleInterface>
    Vue: {
      // eslint-disable-next-line ts/method-signature-style
      nextTick(): Promise<void>
    }
  }
}
