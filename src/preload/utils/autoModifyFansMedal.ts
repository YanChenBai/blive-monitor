import { getFansMedals, getInfoByUser, modifyFansMedal } from './api'

function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(() => res(), ms))
}

async function findFansMedal(roomId: string, page = 1) {
  const {
    data: {
      data: { page_info, special_list, list },
      code
    }
  } = await getFansMedals(page, 30)

  if (code !== 0) throw new Error('request error')
  console.log(page_info, special_list, list)

  const fansMedal = [...special_list, ...list].find(
    (item) => item.room_info.room_id.toString() === roomId
  )

  if (fansMedal) return fansMedal

  if (page_info.total_page <= page) {
    return undefined
  } else {
    await sleep(200)
    return await findFansMedal(roomId, page++)
  }
}

export async function autoModifyFansMedal(roomId: string) {
  const {
    data: {
      data: { medal },
      code
    }
  } = await getInfoByUser(roomId)

  if (code !== 0) throw new Error('request error')
  console.log(medal)

  if (medal.curr_weared.target_roomid.toString() === roomId) return

  const fansMedal = await findFansMedal(roomId)

  if (fansMedal) {
    modifyFansMedal(fansMedal.medal.medal_id)
  }
}
