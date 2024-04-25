<template>
  <n-modal v-model:show="show" transform-origin="center">
    <div flex flex-col gap-2>
      <n-qr-code :size="200" :value="code" />
      <div class="item">
        <div class="title">IP</div>
        {{ connectInfo?.ip }}
      </div>
      <div class="item">
        <div class="title">Token</div>
        {{ connectInfo?.token }}
      </div>

      <button class="btn py-1.5" @click="close">关闭</button>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
defineOptions({ name: 'ConnectCode' })
const show = ref(false)
const connectInfo = ref<{ ip?: string; token: string }>()
const code = computed(() => JSON.stringify(connectInfo.value))
window.mainInvoke.getConnectInfo().then((data) => (connectInfo.value = data))

const open = () => (show.value = true)
const close = () => (show.value = false)
defineExpose({
  open,
  close
})
</script>

<style scoped>
.item {
  @apply: bg-white text-black rounded-1.5 p4px flex gap-1 items-center;
}
.title {
  @apply: bg-#FB7299 text-white rounded-1.5 text-center px-1 w-46px;
}
.btn {
  @apply: bg-[#FB7299] border-0 flex-inline justify-center items-center px-2 rounded-1.5
    cursor-pointer hover-bg-[#e06689] transition-all outline-none;
}
</style>
