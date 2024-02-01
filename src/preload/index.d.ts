import { LivePlayer } from './types/livePlayer'

declare global {
  interface Window {
    livePlayer?: LivePlayer
  }
}
