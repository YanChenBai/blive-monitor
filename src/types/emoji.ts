interface Response {
  code: number
  msg: string
  message: string
}

interface TopShow {
  top_left: { image: string; text: string }
  top_right: { image: string; text: string }
}

export interface Emoticon {
  emoji: string
  descript: string
  url: string
  is_dynamic: number
  in_player_area: number
  width: number
  height: number
  identity: number
  unlock_need_gift: number
  perm: number
  unlock_need_level: number
  emoticon_value_type: number
  bulge_display: number
  unlock_show_text: string
  unlock_show_color: string
  emoticon_unique: string
  unlock_show_image: string
  emoticon_id: number
}

export interface Emoticons {
  emoticons: Emoticon[]
  pkg_id: number
  pkg_name: string
  pkg_type: number
  pkg_descript: string
  pkg_perm: number
  unlock_identity: number
  unlock_need_gift: number
  current_cover: string
  recently_used_emoticons: Emoticon[]
  top_show: TopShow
  top_show_recent: TopShow
}

export interface GetEmoticons extends Response {
  code: number
  data: {
    data: Emoticons[]
    purchase_url: string | null
    fans_brand: number
  }
}

interface SimpleEmoticon {
  perm: number
  emoticon_unique: string
  emoji: string
  url: string
}

export interface EmoticonsMap {
  pkg_id: number
  pkg_name: string
  current_cover: string
  pkg_type: number
  used: SimpleEmoticon[]
  emoticons: SimpleEmoticon[]
}
