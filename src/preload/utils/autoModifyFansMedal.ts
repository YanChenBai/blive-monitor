import { getFansMedals, getInfoByUser, modifyFansMedal } from './api'

let roomMedalId = 0

function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(() => res(), ms))
}

async function findFansMedal(roomId: string) {
  let total = 2
  for (let page = 1; page <= total; page++) {
    const {
      data: {
        data: { special_list, list, page_info },
        code
      }
    } = await getFansMedals(page, 30)

    if (code !== 0) throw new Error('request error')

    total = page_info.total_page

    await sleep(300)
    const all = [...special_list, ...list]
    const fansMedal = all.find((item) => item.room_info.room_id.toString() === roomId)

    if (fansMedal && fansMedal.medal.is_lighted === 1) return fansMedal

    // 如果已经有灭掉的牌子后面就没必要找了
    if (all.find((item) => item.medal.is_lighted === 0) !== undefined) return undefined
  }

  return undefined
}

export async function autoModifyFansMedal(roomId: string) {
  const {
    data: {
      data: { medal },
      code
    }
  } = await getInfoByUser(roomId)

  if (code !== 0) throw new Error('request error')

  if (medal.curr_weared.target_roomid.toString() === roomId) return
  let medalId: number

  if (roomMedalId === 0) {
    const res = await findFansMedal(roomId)
    roomMedalId = res ? res.medal.medal_id : -1
    medalId = roomMedalId
  } else {
    medalId = roomMedalId
    console.log('medalId:', medalId)
  }

  if (medalId > 0) modifyFansMedal(medalId)
}
