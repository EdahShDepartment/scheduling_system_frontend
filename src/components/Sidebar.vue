<script setup>
// 引入 Icon 元件
import { Icon } from '@iconify/vue';

// 定義 props 和 emits
defineProps({
  pages: Array,
  currentPage: Object
});
defineEmits(['navigate']);
</script>

<template>
  <aside class="w-64 bg-[#2c3e50] text-gray-200 flex flex-col">
    <div class="h-20 flex items-center justify-start border-b border-slate-600 px-4 w-full">
      <div class="flex items-center space-x-3">
        <img src="/ed_logo.jpg" alt="Logo" class="h-10 w-10 bg-white p-1 rounded-md">
        <h1 class="text-xl font-bold text-white">排班系統</h1>
      </div>
    </div>
    <nav class="flex-1 px-4 py-6 space-y-2">
      <a href="#" v-for="page in pages" :key="page.id" @click.prevent="$emit('navigate', page.id)"
        :class="['flex items-center py-2 px-4 rounded-lg hover:bg-gray-700', { 'bg-blue-500 text-white font-semibold': currentPage.id === page.id }]">
        <Icon :icon="page.icon" class="h-5 w-5 mr-3" />
        {{ page.name }}
      </a>
    </nav>
  </aside>
</template>