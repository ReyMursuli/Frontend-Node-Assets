<template>
  <div class="fixed right-4 top-4 z-50 space-y-2">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="px-4 py-2 rounded-md shadow text-white"
      :class="t.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'"
    >
      {{ t.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
export type Toast = { id: number; message: string; type: 'success' | 'error' }
defineProps<{ toasts: Toast[] }>()
</script>


