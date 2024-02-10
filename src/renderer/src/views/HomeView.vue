<template>
  <WinMenu @close="close" @min="min" />
  <div p-10px flex flex-col>
    <div flex w-full align="center">
      <n-input-group>
        <n-input
          v-model:value="keyword"
          w-full
          type="primary"
          placeholder="输入房间号👌"
          clearable
        />
        <n-button type="primary" @click="add()">添加</n-button>
      </n-input-group>
      <n-button type="primary" m-l-6px @click="openBiliHome()">登录</n-button>
      <n-button type="primary" m-l-6px :loading="refreshLoading" @click="refresh()">
        <template #icon>
          <n-icon>
            <MaterialSymbolsSyncRounded />
          </n-icon>
        </template>
      </n-button>
      <!-- <Updater /> -->
    </div>

    <n-spin description="加载中" :show="newVersionInit">
      <div m-t-10px of-hidden>
        <n-scrollbar class="h-[calc(100vh-96px)]">
          <n-card
            v-for="(item, index) in searchList"
            :key="index"
            :bordered="false"
            size="small"
            class="[&:not(:last-child)]:m-b-10px"
          >
            <RoomListItem :room="item" @open="openLiveRoom" @remove="remove"></RoomListItem>
          </n-card>
        </n-scrollbar>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { useRoomsStore, ResultMesg } from '@renderer/stores/rooms'
import { Room } from '@type/room'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { match } from 'pinyin-pro'
import { useMessage } from 'naive-ui'
import { loadingWrapRef } from '@renderer/utils/loadingWrap'
import RoomListItem from '@renderer/components/RoomListItem.vue'
import WinMenu from '@renderer/components/WinMenu.vue'

defineOptions({ name: 'HomeView' })

const message = useMessage()
const roomsStore = useRoomsStore()
const { rooms } = storeToRefs(roomsStore)
const keyword = ref<string>('')
const newVersionInit = ref(false)
const refreshLoading = ref(false)

/** 以前的数据格式转换为新的 */
rooms.value = rooms.value.map((item: any) => {
  console.log(item)

  if (item.live_status) {
    item.liveStatus = item.live_status
    Reflect.deleteProperty(item, 'live_status')
  }
  if (item.medal_name) {
    item.medalName = item.medal_name
    Reflect.deleteProperty(item, 'medal_name')
  }
  if (item.room_id) {
    item.roomId = item.room_id
    Reflect.deleteProperty(item, 'room_id')
  }
  if (item.short_id) {
    item.shortId = item.short_id
    Reflect.deleteProperty(item, 'short_id')
  }
  return item
})

async function add() {
  const status = await roomsStore.add(keyword.value)
  switch (status) {
    case ResultMesg.OK:
      message.success('添加成功')
      break
    case ResultMesg.Empty:
      message.error('房间号不能为空')
      break
    case ResultMesg.Format:
      message.error('房间号格式不正确')
      break
    case ResultMesg.Repeat:
      message.error('直播间已添加噜')
      break
  }
}

function remove(room_id: string) {
  const status = roomsStore.remove(room_id)
  switch (status) {
    case ResultMesg.OK:
      message.success('删除成功')
      break
    case ResultMesg.NotFound:
      message.error('列表里没这个房间捏')
      break
  }
}

const refresh = () =>
  loadingWrapRef(refreshLoading, async () => {
    return await roomsStore.refresh().then((res) => {
      if (res === ResultMesg.OK) {
        message.success('刷新成功')
      } else {
        message.error('刷新失败')
      }
      return res
    })
  })

const openLiveRoom = (room: Room) => window.mainInvoke.openLiveRoom({ ...room })

const openBiliHome = () => window.mainInvoke.openBiliHome()

const livePreRegex = /^live /
// 搜索
const searchList = computed(() => {
  if (keyword.value.length <= 0) return rooms.value
  else {
    let val = keyword.value.toLowerCase()
    let searchRooms: Room[] = rooms.value
    // 如果是live开头的
    if (val.startsWith('live')) {
      // 先过滤掉为开播的
      searchRooms = searchRooms.filter((item) => item.liveStatus === 1)
      // 如果关键字就是live就直接返回
      if (val === 'live') return searchRooms
      val = val.replace(livePreRegex, '')
    }

    return searchRooms.filter((item) => {
      // 修改了数据结构兼容
      const room = Object.assign(
        {
          uid: '',
          roomId: '',
          shortId: '',
          name: '',
          face: '',
          liveStatus: 0,
          tags: '',
          title: '',
          medalName: ''
        } as Room,
        item
      )
      return (
        room.name.toLowerCase().includes(val) ||
        room.roomId.includes(val) ||
        room.shortId.includes(val) ||
        match(room.name, val, { continuous: true }) !== null ||
        match(room.tags, val, { continuous: true }) !== null ||
        match(room.medalName, val, { continuous: true }) !== null
      )
    })
  }
})

// 关闭
const close = () => window.mainInvoke.closeWin()

// 最小化
const min = () => window.mainInvoke.minWin()

onMounted(() => refresh())
</script>

<style scoped></style>
