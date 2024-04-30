import { GetEmoticons } from '@type/emoji'
import { FansMedals, InfoByUser } from '@type/bili'
import axios from 'axios'

function getCookieValue(cookieName) {
  const name = cookieName + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookieArray = decodedCookie.split(';')
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i]
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1)
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length)
    }
  }
  return ''
}

/**
 * 获取房间表情号
 * @param roomId 真实的房间id
 */
export async function getEmoticons(roomId: string) {
  return await axios
    .get<GetEmoticons>(
      `https://api.live.bilibili.com/xlive/web-ucenter/v2/emoticon/GetEmoticons?platform=pc&room_id=${roomId}`,
      {
        withCredentials: true
      }
    )
    .then(({ data }) => {
      if (data.code === 0) return data.data.data
      else {
        return Promise.reject(data.code)
      }
    })
}

/**
 * 获取粉丝牌分页api
 */
export function getFansMedals(page: number, pageSize: number) {
  return axios.get<FansMedals>(
    `https://api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/panel?page=${page}&page_size=${pageSize}`,
    {
      withCredentials: true
    }
  )
}

/** 修改粉丝牌 */
export function modifyFansMedal(medalId: number) {
  const bili_jct = getCookieValue('bili_jct')
  if (bili_jct.length <= 0) throw new Error('bili_jct not found')
  return axios.post(
    'https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/wear',
    {
      medal_id: medalId,
      csrf_token: bili_jct,
      csrf: bili_jct
    },
    {
      withCredentials: true,
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
  )
}

/** 获取个人信息 */
export function getInfoByUser(roomId: string) {
  return axios.get<InfoByUser>(
    `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=${roomId}`,
    {
      withCredentials: true
    }
  )
}
