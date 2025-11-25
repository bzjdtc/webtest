<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <AppHeader />
  <!-- 二级路由出口 -->
  <div class="min-h-[calc(100vh-300px)]">
      <router-view :key="$route.fullPath" />
  </div>
  <AppFooter />
</template>
