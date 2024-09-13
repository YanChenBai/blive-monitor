<script setup lang="ts">
import type { Room } from '@type/room'
import { onLongPress } from '@vueuse/core'
import { ref, toRaw } from 'vue'
import { ExternalLink } from 'lucide-vue-next'

defineOptions({ name: 'RoomBtn' })

const props = defineProps<{
  room: Room
}>()

defineEmits<{
  (e: 'open'): void
}>()

const btnRefHook = ref()

// 重设播放窗口位置
const resetBliveWinPosition = () => window.mainInvoke.resetBliveWinPosition({ ...toRaw(props.room) })

onLongPress(
  btnRefHook,
  () => resetBliveWinPosition(),
  { delay: 1000 },
)
</script>

<template>
  <button ref="btnRefHook" @click="$emit('open')">
    <ExternalLink :size="14" />
  </button>
</template>
