import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import lodash from 'lodash'

export interface DBConfig {
  roomId: string
  alwaysOnTop: boolean
  keepAspectRatio: boolean
  width?: number
  height?: number
  x?: number
  y?: number
  volume?: number
}

interface DBData {
  config: DBConfig[]
}

class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

const defaultData: DBData = {
  config: []
}

const adapter = new JSONFile<DBData>('db.json')

export const db = new LowWithLodash(adapter, defaultData)
