import { css } from '../../preload/utils/component'

export const dragStyle = css`
  /** 拖拽栏 */
  body::after {
    content: '';
    -webkit-app-region: drag;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999999999999;
    width: 100vw;
    height: 40px;
    opacity: 0;
  }

  /** 添加黑色底，让切换时不会突然闪白色 */
  body {
    overflow: hidden !important;
    background: black !important;
  }

  html {
    background: black !important;
  }

  .live-player-ctnr .live-player-mounter {
    z-index: 999999999999;
  }
`
