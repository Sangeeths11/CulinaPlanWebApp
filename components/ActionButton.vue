<template>
  <button @click="handleClick" :class="buttonClass">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
    </svg>
  </button>
</template>

<script setup>
const props = defineProps({
  color: String,
  iconPath: String
});
const emit = defineEmits(['click']);

const buttonClass = computed(() => {
  return `bg-${props.color}-500 hover:bg-${props.color}-600 text-white p-4 rounded-full shadow-lg transition duration-300 flex items-center justify-center`;
});

function handleClick() {
  emit('click');
}
</script>
