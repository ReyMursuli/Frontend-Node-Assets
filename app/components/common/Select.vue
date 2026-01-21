<template>
  <div>
    <label v-if="label" class="block text-sm font-semibold text-gray-700 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        class="w-full px-4 py-2.5 border rounded-lg appearance-none bg-white transition-all outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 hover:border-gray-400 shadow-sm disabled:bg-gray-50 disabled:text-gray-500"
        :disabled="disabled"
      >
        <option value="" disabled selected>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.id" :value="option.id">
          {{ option.username }} </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: [String, Number, null],
  label: String,
  placeholder: { type: String, default: 'Seleccione una opción' },
  options: { type: Array as () => any[], default: () => [] },
  disabled: Boolean
})
defineEmits(['update:modelValue'])
</script>