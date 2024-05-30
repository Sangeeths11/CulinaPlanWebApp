<template>
  <div class="mb-4">
    <label :for="id" class="block text-gray-700 text-sm font-bold mb-2">{{ label }}</label>
    <textarea :id="id" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"></textarea>
  </div>
</template>

<script setup>
const props = defineProps({
  id: String,
  label: String,
  modelValue: String
});
const emit = defineEmits(['update:modelValue']);
</script>
