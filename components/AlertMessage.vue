<template>
  <div v-if="message" :class="alertClass">
    <div class="flex items-center space-x-2">
      <Icon :name="icon" class="w-5 h-5" />
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'error'
  },
  message: String
});

const icon = computed(() => {
  return props.type === 'error' ? 'ic:round-error' : 'ic:round-check-circle';
});

const alertClass = computed(() => {
  return props.type === 'error' 
    ? 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
    : 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative';
});
</script>
