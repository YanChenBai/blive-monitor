interface Response {
  code: number
  msg: string
  message: string
}

export interface RoomInfo extends Response {
  data: {
    uid: number
    room_id: number
    short_id: number
    attention: number
    online: number
    is_portrait: boolean
    description: string
    live_status: number
    area_id: number
    parent_area_id: number
    parent_area_name: string
    old_area_id: number
    background: string
    title: string
    user_cover: string
    keyframe: string
    is_strict_room: boolean
    live_time: string
    tags: string
    is_anchor: number
    room_silent_type: string
    room_silent_level: number
    room_silent_second: number
    area_name: string
    // more...
  }
}

export interface UserInfo extends Response {
  data: {
    info: {
      uid: number
      uname: string
      face: string
      official_verify: object
    }
    exp: { master_level: object }
    follower_num: number
    room_id: number
    medal_name: string
    glory_count: number
    pendant: string
    link_group_num: number
    room_news: {
      content: string
      ctime: string
      ctime_text: string
    }
  }
}

export interface ManyUserInfoItem {
  title: string
  room_id: number
  uid: number
  online: number
  live_time: number
  live_status: number
  short_id: number
  area: number
  area_name: string
  area_v2_id: number
  area_v2_name: string
  area_v2_parent_name: string
  area_v2_parent_id: number
  uname: string
  face: string
  tag_name: string
  tags: string
  cover_from_user: string
  keyframe: string
  lock_till: string
  hidden_till: string
  broadcast_type: number
}

export interface ManyUserInfo extends Response {
  data: Record<string, ManyUserInfoItem>
}
