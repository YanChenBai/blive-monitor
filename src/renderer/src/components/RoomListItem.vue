<template>
  <n-card :bordered="false" size="small">
    <div flex items-center>
      <div flex>
        <div size-48px>
          <n-popover trigger="hover" placement="right" :show-arrow="false">
            <template #trigger>
              <n-badge :value="room.liveStatus === 1 ? '播' : ''">
                <n-avatar :size="48" :src="room.face" cursor-pointer />
              </n-badge>
            </template>
            <div w-200px>
              <n-descriptions
                label-placement="top"
                title=""
                :column="1"
                label-style="color: #fb7299FF; font-weight: 600;"
              >
                <n-descriptions-item label="标题">
                  {{ room.title }}
                </n-descriptions-item>

                <n-descriptions-item v-if="room.tags" label="标签">
                  {{ room.tags }}
                </n-descriptions-item>

                <n-descriptions-item v-if="room.medalName" label="粉丝牌">
                  <n-tag size="small">{{ room.medalName }}</n-tag>
                </n-descriptions-item>
              </n-descriptions>
            </div>
          </n-popover>
        </div>
        <div text-16px flex flex-col w-178px p-l-10px p-r-10px box-border line-height-24px>
          <n-ellipsis w-158px of-hidden color="#fb7299FF">
            <n-text type="primary" select-none>{{ room.name }}</n-text>
            <template #tooltip> {{ room.name }} </template>
          </n-ellipsis>

          <n-ellipsis w-158px of-hidden color="#fb7299FF">
            <n-text text-14px>
              {{ showRoomId }}
            </n-text>
            <template #tooltip> {{ showRoomId }} </template>
          </n-ellipsis>
        </div>
      </div>
      <div w-94px flex items-center justify-between>
        <n-button round size="small" type="primary" @click="$emit('open', room)">打开</n-button>
        <n-popconfirm
          positive-text="尊嘟"
          negative-text="假嘟"
          placement="bottom"
          @positive-click="$emit('remove', room.roomId)"
        >
          <template #trigger>
            <n-button circle size="small" type="error">
              <n-icon size="16"> <MaterialSymbolsDeleteRounded /> </n-icon>
            </n-button>
          </template>
          要删噜!
        </n-popconfirm>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { Room } from '@type/room'

defineOptions({ name: 'RoomListroom' })
const props = defineProps<{
  room: Room
}>()
defineEmits<{
  (e: 'remove', roomId: string): void
  (e: 'open', room: Room): void
}>()

const showRoomId =
  props.room.shortId && props.room.shortId === '0' ? props.room.roomId : props.room.shortId
</script>

<style scoped></style>
