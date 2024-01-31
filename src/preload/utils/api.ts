import { GetEmoticons } from '../types/emoji'

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
    .then((res) => {
      if (res.data.code === 0) return res.data.data.data
      else {
        return Promise.reject(res.data.code)
      }
    })
}
