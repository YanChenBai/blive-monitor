<template>
  <n-card :bordered="false" size="small">
    <n-thing>
      <template #avatar>
        <n-popover trigger="hover" placement="right" :show-arrow="false">
          <template #trigger>
            <n-badge :value="room.liveStatus === 1 ? '播' : ''">
              <n-avatar :size="48" :src="room.face" cursor-pointer />
            </n-badge>
          </template>
          <div>
            <div font="600">
              {{ room.title }}
            </div>
          </div>
        </n-popover>
      </template>
      <template #header>
        <n-ellipsis w-140px of-hidden color="#fb7299FF">
          <n-text type="primary" select-none>{{ room.name }}</n-text>
          <template #tooltip> {{ room.name }} </template>
        </n-ellipsis>
        <div :title="room.name"></div>
      </template>
      <template #description>
        <n-text text-14px>
          <template v-if="room.shortId && room.shortId !== '0'">
            {{ room.shortId }}
          </template>
          <template v-else>
            {{ room.roomId }}
          </template>
        </n-text>
      </template>
      <template #header-extra>
        <n-space>
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
        </n-space>
      </template>
    </n-thing>
  </n-card>
</template>

<script setup lang="ts">
import { Room } from '@type/room'

defineOptions({ name: 'RoomListroom' })
defineProps<{
  room: Room
}>()
defineEmits<{
  (e: 'remove', roomId: string): void
  (e: 'open', room: Room): void
}>()
</script>

<style scoped></style>
