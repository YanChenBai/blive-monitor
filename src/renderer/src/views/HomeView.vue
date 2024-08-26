<script setup lang="ts">
import { Ellipsis, LogIn, RotateCcw, Unplug } from 'lucide-vue-next'
import { ResultMesg, useRoomsStore } from '@renderer/stores/rooms'
import type { Room } from '@type/room'
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

defineOptions({ name: 'HomeView' })

const message = useMessage()
const roomsStore = useRoomsStore()
const { rooms } = storeToRefs(roomsStore)
const keyword = ref<string>('')
const refreshLoading = ref(false)
const connectCodeRef = ref<InstanceType<typeof ConnectCode>>()

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
        }
        else {
          message.error('刷新失败')
        }
        return res
      })
    }),
  300,
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
  if (keyword.value.length <= 0) {
    return rooms.value
  }
  else {
    let val = keyword.value.toLowerCase()
    let searchRooms: Room[] = [...rooms.value]
    // 如果是live开头的
    if (val.startsWith('live')) {
      // 先过滤掉为开播的
      searchRooms = searchRooms.filter(item => item.liveStatus === 1)
      // 如果关键字就是live就直接返回
      if (val === 'live')
        return searchRooms
      val = val.replace(livePreRegex, '')
    }

    return searchRooms
      .filter((room) => {
        return (
          room.name.toLowerCase().includes(val)
          || room.roomId.includes(val)
          || room.shortId.includes(val)
          || match(room.name, val, { continuous: true }) !== null
          || match(room.tags, val, { continuous: true }) !== null
          || match(room.medalName, val, { continuous: true }) !== null
        )
      })
      .sort((a, b) => {
        if (a.liveStatus === 1 && b.liveStatus !== 1)
          return -1
        else if (a.liveStatus !== 1 && b.liveStatus === 1)
          return 1
        else return 0
      })
  }
})

// 关闭
const close = () => window.mainInvoke.closeWin()

// 最小化
const min = () => window.mainInvoke.minWin()

onMounted(() => refresh())
</script>

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
      >
      <button class="btn w-20 line-height-32px" @click="add">
        添加
      </button>

      <button class="btn w-12" :loading="refreshLoading" @click="refresh()">
        <RotateCcw :stroke-width="2" :size="14" />
      </button>

      <n-popover trigger="click" :show-arrow="false" p-0>
        <template #trigger>
          <button class="btn w-12">
            <Ellipsis :stroke-width="2" :size="14" />
          </button>
        </template>
        <div flex flex-col gap-1>
          <div class="more-btn" @click="openBiliHome">
            <LogIn :stroke-width="2.5" :size="14" />登入
          </div>
          <div class="more-btn" @click="connectCodeRef?.open()">
            <Unplug :stroke-width="2.5" :size="14" />连接
          </div>
          <!-- <div class="more-btn" @click="connectCodeRef?.open()">
            <FileUp :stroke-width="2.5" :size="16" />导入
          </div> -->
        </div>
      </n-popover>
    </div>

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
          />
        </VueDraggable>
      </n-scrollbar>
    </div>
  </div>
  <ConnectCode ref="connectCodeRef" />
</template>

<style scoped>
.btn {
  @apply: bg-[#FB7299] border-0 flex-inline justify-center items-center px-2 rounded-1.5 cursor-pointer hover-bg-[#FB7299]/90 transition-all outline-none;
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
