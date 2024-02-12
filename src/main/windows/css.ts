import { css } from '../../preload/utils/component'

export const insertCSS = css`
  /** 关闭礼物栏 */
  #full-screen-interactive-wrap {
    display: none !important;
  }
  #fullscreen-danmaku-vm .fullscreen-danmaku {
    bottom: 5px !important;
  }

  .web-live-player-gift-icon-wrap {
    display: none;
  }

  /** 添加黑色底，让切换时不会突然闪白色 */
  body {
    overflow: hidden !important;
    background: black;
  }

  html {
    background: black;
  }

  /** 去掉水印 */
  .web-player-icon-roomStatus {
    display: none;
  }

  /* 去掉反馈按钮 */
  .web-player-icon-feedback {
    display: none;
  }

  /** 全屏播放器 */
  .live-room-app .app-content .app-body .player-and-aside-area .left-container {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw !important;
    height: 100vh;
    display: flex;
  }

  /** 移除下播后的推荐 */
  #live-player > div.web-player-ending-panel > div > div.web-player-ending-panel-recommendList {
    display: none !important;
  }

  /** 移除一下杂七杂八的东西 */
  .shop-popover,
  #link-footer-vm,
  #sections-vm,
  #sidebar-vm,
  #room-ssr-vm,
  #head-info-vm,
  #pk-vm,
  #awesome-pk-vm,
  #gift-control-vm {
    display: none !important;
  }

  /** 幻星派对互动按钮 */
  #game-id {
    display: none !important;
  }

  @media screen and (max-height: 560px) {
    #anchor-guest-box-id {
      transform: translate(-50%, 0) scale(0.8) !important;
      bottom: 0;
      top: 0 !important;
    }
  }

  /** 封禁布局修改 */
  .room-blocked {
    position: fixed;
    width: 100vw;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .room-blocked .header-img {
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    width: 100% !important;
    height: 100% !important;
  }

  /** 隐藏全局广播飘屏 */
  .web-player-inject-wrap {
    display: none;
  }

  /** 播放器模糊层隐藏 */
  .web-player-module-area-mask {
    display: none !important;
  }

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
`
