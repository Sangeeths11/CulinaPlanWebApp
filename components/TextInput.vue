<template>
  <div class="mb-4">
    <label :for="id" class="block text-gray-700 text-sm font-bold mb-2">{{ label }}</label>
    <input :id="id" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
           @blur="onBlur" :placeholder="placeholder"
           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
  </div>
</template>

<script setup>
const props = defineProps({
  id: String,
  label: String,
  modelValue: String,
  placeholder: String
});
const emit = defineEmits(['update:modelValue', 'blur']);

const onBlur = () => {
  emit('blur');
};
</script>
