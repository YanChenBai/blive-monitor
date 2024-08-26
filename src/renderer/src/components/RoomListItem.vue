<script setup lang="ts">
import type { Room } from '@type/room'
import { ExternalLink, Trash2 } from 'lucide-vue-next'

defineOptions({ name: 'RoomListroom' })
const props = defineProps<{
  room: Room
}>()
defineEmits<{
  (e: 'remove', roomId: string): void
  (e: 'open', room: Room): void
}>()

const showRoomId
  = props.room.shortId && props.room.shortId === '0' ? props.room.roomId : props.room.shortId
</script>

<template>
  <div bg="[#1e1e1e]" rounded-2 py-12px px-12px cursor-pointer>
    <div flex items-center justify-between>
      <div flex class="gap-[6px]">
        <div size-48px relative :class="[room.liveStatus === 1 ? 'live' : 'unlive']">
          <n-avatar rd-2 :size="48" :src="room.face" cursor-pointer />
        </div>

        <div text-16px flex flex-col p-l-10px p-r-10px box-border line-height-24px>
          <div text-16px font-500 color="[rgba(255,255,255,0.87)]">
            {{ room.name }}
          </div>

          <div text-14px font-300 color="[rgba(255,255,255,0.6)]">
            {{ showRoomId }}
          </div>
        </div>
      </div>

      <div flex items-center gap-8px justify-between>
        <button class="btn" @click="$emit('open', room)">
          <ExternalLink :size="5" />
        </button>

        <n-popconfirm
          positive-text="尊嘟"
          negative-text="假嘟"
          placement="bottom"
          @positive-click="$emit('remove', room.roomId)"
        >
          <template #trigger>
            <button class="btn">
              <Trash2 :size="5" />
            </button>
          </template>
          要删噜!
        </n-popconfirm>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  @apply: bg-[#FB7299] size-28px p-6px border-0 flex-inline justify-center items-center rounded-2
    cursor-pointer hover-bg-[#FB7299]/90 transition-all outline-none;
}

.unlive {
  filter: brightness(0.6);
}

.live::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 0 2px #fb7299;
  border-radius: 0.5rem;
  z-index: 9;
  animation: 0.8s live infinite;
}

@keyframes live {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}
</style>
