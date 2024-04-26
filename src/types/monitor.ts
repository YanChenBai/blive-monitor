export enum EventNames {
  SEND_TEXT = 'monitor:send_text',
  SEND_EMOTICON = 'monitor:send_emoticon',
  CHANGE_VOLUME = 'monitor:change_volume'
}

export interface SendEmoticonParams {
  pkgId: number
  emoticonUnique: string
}
