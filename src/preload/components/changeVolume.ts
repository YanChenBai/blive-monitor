import { awaitLivePlayer, awaitVideoEl } from '@preload/utils/livePlayer'
import { tag, Component, html, css } from '../utils/component'
import { BliveInvoke } from '@preload/utils/invoke'

@tag('change-volume')
export class ChangeVolume extends Component {
  css = css`
    .change-volume {
      position: fixed;
      top: 50vh;
      right: 50vw;
      width: 50px;
      height: 50px;
      border-radius: 10px;
      transform: translate(50%, -50%);
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 9999999999;
      color: #fff;
      text-align: center;
      line-height: 50px;
      font-size: 16px;
      display: none;
    }

    .show {
      display: block;
    }
  `

  render() {
    return html` <div class="change-volume ${this.show ? 'show' : ''}">${this.volume}%</div> `
  }

  volumeStep = 2
  volume = 0
  show = false
  isShowOnce = false
  timer: NodeJS.Timeout | null = null
  bliveInvoke = new BliveInvoke()

  set setVolume(value: number) {
    this.volume = value

    // 在初始化时，不显示
    if (this.isShowOnce) {
      this.setShow = true
    } else {
      this.isShowOnce = true
    }

    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => (this.setShow = false), 500)

    this.bliveInvoke.setVolume(value)
    this.reRender()

    Promise.all([awaitLivePlayer(), awaitVideoEl()]).then(([lp, el]) => {
      // 保证改变音量时不在静音状态
      const { volume: volumeInfo } = lp.getPlayerInfo()
      if (el.muted) el.muted = false
      if (volumeInfo && volumeInfo.disabled) volumeInfo.disabled = false

      lp.volume(value)
    })
  }

  set setShow(value: boolean) {
    this.show = value
    this.reRender()
  }

  modifyVolume(status: boolean) {
    // 放置超出0 - 100的范围内
    const newVolume = Number(
      (status
        ? Math.max(0, this.volume - this.volumeStep)
        : Math.min(100, this.volume + this.volumeStep)
      ).toFixed(0)
    )

    this.setVolume = newVolume
  }

  async connected() {
    const volume = await this.bliveInvoke.getVolume()

    this.setVolume = volume

    // 监听滚动
    window.addEventListener('wheel', (event) => {
      this.modifyVolume(event.deltaY > 0)
    })

    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowDown':
          this.modifyVolume(true)
          break
        case 'ArrowUp':
          this.modifyVolume(false)
          break
      }
    })
  }
}
