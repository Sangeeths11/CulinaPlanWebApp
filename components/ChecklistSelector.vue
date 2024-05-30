<template>
  <div :class="`w-full md:w-1/2 lg:w-1/3 px-2 mb-4`">
    <label class="block text-gray-700 text-sm font-bold mb-2">
      {{ label }}
    </label>
    <div class="flex flex-wrap">
      <div v-for="(item, index) in items" :key="index" class="w-1/2 mb-2">
        <input type="checkbox" :id="`${idPrefix}-${index}`"
               :value="item"
               :checked="selectedValues.includes(item)"
               @change="handleCheckboxChange(item)">
        <label :for="`${idPrefix}-${index}`" class="text-gray-700 ml-2">{{ item }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  items: Array,
  selectedValues: Array,
  idPrefix: String,
  singleSelection: Boolean
});
const emit = defineEmits(['update:selectedValues']);

function handleCheckboxChange(selectedItem) {
  let newSelectedValues = [];
  if (props.singleSelection) {
    // Single selection logic
    if (!props.selectedValues.includes(selectedItem)) {
      newSelectedValues = [selectedItem];
    }
  } else {
    // Multiple selections logic
    newSelectedValues = [...props.selectedValues];
    const index = newSelectedValues.indexOf(selectedItem);
    if (index === -1) {
      newSelectedValues.push(selectedItem);
    } else {
      newSelectedValues.splice(index, 1);
    }
  }
  emit('update:selectedValues', newSelectedValues);
}
</script>
