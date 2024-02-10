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
      }
    }"
  >
    <n-dialog-provider>
      <n-message-provider placement="bottom">
        <div h-screen w-screen flex flex-col>
          <n-layout flex-1>
            <RouterView />
          </n-layout>
        </div>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { RouterView } from 'vue-router'
</script>

<style scoped></style>
