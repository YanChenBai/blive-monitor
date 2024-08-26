export function autoLottery() {
  setInterval(() => {
    const lotteryBtn = document.querySelector(
      '#app > div > div.particitation-btn',
    ) as HTMLButtonElement

    // 点击抽奖
    if (lotteryBtn)
      lotteryBtn.click()

    // 关闭天选
    setTimeout(() => {
      const closeBtn = document.querySelector(
        '#app > div > div.close-btn.bg-contain',
      ) as HTMLButtonElement

      if (closeBtn)
        closeBtn.click()
    }, 1000)
  }, 1000 * 60)
}
