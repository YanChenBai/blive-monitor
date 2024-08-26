window.onload = () => {
  const timer = setInterval(() => {
    const loginEntry = document.querySelector('.header-login-entry') as HTMLDivElement
    const userPanel = document.querySelector('.user-panel-ctnr') as HTMLDivElement

    if (loginEntry) {
      /** 触发登录面板 */
      loginEntry.click()
      clearInterval(timer)
      return
    }

    if (userPanel) {
      /** 触发用户面板 */
      const mouseEnterEvent = new Event('mouseenter')
      userPanel.dispatchEvent(mouseEnterEvent)
      clearInterval(timer)
    }
  }, 1000)
}
