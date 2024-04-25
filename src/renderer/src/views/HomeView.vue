<template>
  <WinMenu @close="close" @min="min" />
  <div flex flex-col>
    <div flex w-full gap-1 h-8 px-14px my-14px box-border>
      <input
        v-model="keyword"
        class="input line-height-32px"
        w-full
        placeholder="输入房间号👌"
        clearable
        @keydown.enter="add"
      />
      <button class="btn w-20 line-height-32px" @click="add">添加</button>

      <button class="btn w-12" :loading="refreshLoading" @click="refresh()">
        <RotateCcw :stroke-width="2" :size="4" />
      </button>

      <n-popover trigger="click" :show-arrow="false">
        <template #trigger>
          <button class="btn w-12">
            <Ellipsis :stroke-width="2" :size="5" />
          </button>
        </template>
        <div flex flex-col gap-2>
          <div class="more-btn" @click="openBiliHome">
            <LogIn :stroke-width="2.5" :size="4" />登入
          </div>
          <div class="more-btn" @click="connectCodeRef?.open()">
            <Unplug :stroke-width="2.5" :size="4" />连接
          </div>
        </div>
      </n-popover>
    </div>

    <n-spin description="加载中" :show="newVersionInit" of-hidden>
      <div of-hidden>
        <n-scrollbar class="h-[calc(100vh-92px)] px-14px box-border">
          <VueDraggable
            v-model="rooms"
            :animation="150"
            :scroll-sensitivity="20"
            :disabled="keyword.length > 0"
          >
            <RoomListItem
              v-for="item in searchList"
              :key="item.uid"
              class="[&]:m-b-10px"
              :room="item"
              @open="openLiveRoom"
              @remove="remove"
            >
            </RoomListItem>
          </VueDraggable>
        </n-scrollbar>
      </div>
    </n-spin>
  </div>
  <ConnectCode ref="connectCodeRef"></ConnectCode>
</template>

<script setup lang="ts">
import { RotateCcw, Ellipsis } from 'lucide-vue-next'
import { useRoomsStore, ResultMesg } from '@renderer/stores/rooms'
import { Room } from '@type/room'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { match } from 'pinyin-pro'
import { useMessage } from 'naive-ui'
import { loadingWrapRef } from '@renderer/utils/loadingWrap'
import WinMenu from '@renderer/components/WinMenu.vue'
import { debounce } from 'lodash'
import { VueDraggable } from 'vue-draggable-plus'
import RoomListItem from '@renderer/components/RoomListItem.vue'
import ConnectCode from '@renderer/components/ConnectCode.vue'
import { LogIn, Unplug } from 'lucide-vue-next'

defineOptions({ name: 'HomeView' })

const message = useMessage()
const roomsStore = useRoomsStore()
const { rooms } = storeToRefs(roomsStore)
const keyword = ref<string>('')
const newVersionInit = ref(false)
const refreshLoading = ref(false)
const connectCodeRef = ref<InstanceType<typeof ConnectCode>>()

/** 以前的数据格式转换为新的 */
rooms.value = rooms.value.map((item: any) => {
  if (item.live_status !== undefined) {
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

const add = debounce(async () => {
  if (!keyword.value.startsWith('live')) {
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
}, 300)

const refresh = debounce(
  () =>
    loadingWrapRef(refreshLoading, async () => {
      return await roomsStore.refresh().then((res) => {
        if (res === ResultMesg.OK) {
          message.success('刷新成功')
        } else {
          message.error('刷新失败')
        }
        return res
      })
    }),
  300
)
const openLiveRoom = (room: Room) => window.mainInvoke.openLiveRoom({ ...room })

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

const openBiliHome = () => window.mainInvoke.openBiliHome()

const livePreRegex = /^live /
// 搜索
const searchList = computed(() => {
  if (keyword.value.length <= 0) return rooms.value
  else {
    let val = keyword.value.toLowerCase()
    let searchRooms: Room[] = [...rooms.value]
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

<style scoped>
.btn {
  @apply: bg-[#FB7299] border-0 flex-inline justify-center items-center px-2 rounded-1.5
    cursor-pointer hover-bg-[#FB7299]/90 transition-all outline-none;
}

.more-btn {
  @apply: px-2 py-1 cursor-pointer rounded-1.5 flex items-center gap-1 hover:bg-#1e1e1e transition-all select-none;
}

.input {
  @apply: bg-[#28282C] outline-none color-white border-solid border-transparent border-0 border-2 rounded-1.5 px-2 hover-border-[#FB7299] transition-all;
}

:deep(.n-modal-body-wrapper) {
  padding: 20px !important;
}
</style>
