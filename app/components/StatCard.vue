<template>
  <article 
    class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 group"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <h2 class="text-sm font-medium text-slate-600 mb-1">{{ title }}</h2>
        <p 
          class="text-2xl sm:text-3xl font-bold text-slate-900 transition-colors"
          :class="hoverColorClass"
        >
          {{ value }}
        </p>
        <p class="text-xs text-slate-500 mt-1">{{ description }}</p>
      </div>
      <div 
        class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
        :class="iconBgClass"
      >
        <slot name="icon"></slot>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  title: string;
  value: number | string;
  description: string;
  variant?: 'blue' | 'green' | 'purple' | 'amber';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'blue'
});

// Mapeo de colores según la variante
const hoverColorClass = computed(() => {
  const colors = {
    blue: 'group-hover:text-blue-600',
    green: 'group-hover:text-green-600',
    purple: 'group-hover:text-purple-600',
    amber: 'group-hover:text-amber-600',
  };
  return colors[props.variant];
});

const iconBgClass = computed(() => {
  const bgs = {
    blue: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600',
    green: 'bg-gradient-to-br from-green-100 to-green-200 text-green-600',
    purple: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600',
    amber: 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600',
  };
  return bgs[props.variant];
});
</script>