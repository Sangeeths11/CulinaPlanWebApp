<template>
  <div class="flex flex-wrap items-center mb-2">
    <input type="text" v-model="ingredient.name" placeholder="Zutat" 
           class="border rounded py-2 px-3 text-gray-700 mr-2 mb-2 flex-grow w-full md:w-auto">
    <input type="number" v-model="ingredient.quantity" placeholder="Anzahl" 
           class="border rounded py-2 px-3 text-gray-700 mr-2 mb-2 flex-grow w-full md:w-auto">
    <input type="number" step="0.01" v-model="ingredient.price" placeholder="Preis (CHF)" 
           class="border rounded py-2 px-3 text-gray-700 mr-2 mb-2 flex-grow w-full md:w-auto">
    <div class="flex space-x-1 mb-2 w-full md:w-auto">
      <button type="button" @click="remove" class="flex justify-center items-center h-10 w-10 bg-red-500 text-white rounded">
        <Icon name="pajamas:remove" class="h-6 w-6" />
      </button>
      <button type="button" @click="add" class="flex justify-center items-center h-10 w-10 bg-green-500 text-white rounded">
        <Icon name="material-symbols:add" class="h-6 w-6" />
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  ingredient: Object,
  index: Number
});
const emit = defineEmits(['add-ingredient', 'remove-ingredient']);

function add() {
  emit('add-ingredient', props.index);
}

function remove() {
  emit('remove-ingredient', props.index);
}
</script>
