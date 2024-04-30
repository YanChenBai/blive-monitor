<template>
  <n-config-provider
    abstract
    :theme="darkTheme"
    :theme-overrides="{
      common: {
        primaryColor: '#fb7299FF',
        primaryColorHover: '#F288A6FF',
        primaryColorPressed: '#EE7396FF'
      },
      Input: {
        borderHover: '2px solid #F288A6FF',
        borderDisabled: '2px solid #00000',
        borderFocus: '2px solid #F288A6FF'
      },
      Card: {
        paddingSmall: '10px 10px 10px 10px'
      },
      Popover: {
        padding: '8px',
        borderRadius: '8px'
      }
    }"
  >
    <n-dialog-provider>
      <n-message-provider placement="bottom">
        <n-modal-provider>
          <div class="bg-[#121212] w-screen">
            <RouterView />
          </div>
        </n-modal-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { RouterView } from 'vue-router'
</script>

<style></style>
