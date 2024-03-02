<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" @click.self="close">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Rezept zuweisen</h3>
        <div class="mt-2">
          <label for="recipeName" class="block text-gray-700 text-sm font-bold mb-2">
            Datum auswählen:
            <input type="date" v-model="selectedDate" class="mt-2 p-2 border rounded">
          </label>
          
          <label for="recipeName" class="block text-gray-700 text-sm font-bold mb-2">
            Morgen Rezeptname eingeben:
            <input type="text" placeholder="Rezeptname" v-model="morgenRecipeName" class="mt-2 p-2 border rounded">
          </label>

          <label for="recipeName" class="block text-gray-700 text-sm font-bold mb-2">
            Mittag Rezeptname eingeben:
            <input type="text" placeholder="Rezeptname" v-model="lunchRecipeName" class="mt-2 p-2 border rounded">
          </label>

          <label for="recipeName" class="block text-gray-700 text-sm font-bold mb-2">
            Abend Rezeptname eingeben:
            <input type="text" placeholder="Rezeptname" v-model="eveningRecipeName" class="mt-2 p-2 border rounded">
          </label>

          <label for="recipeName" class="block text-gray-700 text-sm font-bold mb-2">
            Snack Rezeptname eingeben:
            <input type="text" placeholder="Rezeptname" v-model="snackRecipeName" class="mt-2 p-2 border rounded">
          </label>
        </div>
        <div class="items-center px-4 py-3">
          <button
            class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="assignRecipe"
          >
            Zuweisen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['close', 'assign']);
const selectedDate = ref('');
const recipeName = ref('');

const close = () => {
  emits('close');
};

const assignRecipe = () => {
  if (selectedDate.value && recipeName.value) {
    emits('assign', selectedDate.value, recipeName.value);
    recipeName.value = '';
    selectedDate.value = '';
  }
};
</script>

<style>
/* Tailwind CSS ist bereits für Styling aktiv */
</style>
