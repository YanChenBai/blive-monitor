<template>
  <div flex h-32px w-full class="menu" bg="#1d1d1d">
    <div w-full flex items-center p-l-10px drag>
      <n-gradient-text
        font="600 size-16px"
        p="t-4px l-0px"
        weight="600"
        :gradient="{ from: '#f54ea2', to: '#ff7676' }"
      >
        BLIVE MONITOR
      </n-gradient-text>
    </div>
    <div no-drag p-r-5px p-t-5px>
      <n-button-group ref="menuBtnsRef">
        <n-button size="tiny" type="primary" tertiary @click="$emit('min')">
          <n-icon>
            <MingcuteMinimizeFill />
          </n-icon>
        </n-button>
        <n-button size="tiny" type="primary" tertiary @click="close">
          <MingcuteCloseFill />
        </n-button>
      </n-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDialog } from 'naive-ui'
import MingcuteMinimizeFill from './Icons/MingcuteMinimizeFill.vue'
import MingcuteCloseFill from './Icons/MingcuteCloseFill.vue'

defineOptions({ name: 'WinMenu' })
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'min'): void
}>()

const dialog = useDialog()

const createDialog = () =>
  dialog.warning({
    title: '警告',
    content: '你确定？这样会关闭所有直播间哦',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => emit('close')
  })

async function close() {
  const count = await window.mainInvoke.winCount()
  count === 0 ? emit('close') : createDialog()
}
</script>
