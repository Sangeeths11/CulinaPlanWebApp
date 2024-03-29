<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 overflow-y-auto">
    <div class="bg-white rounded-md shadow-lg w-96">
      <div class="p-6">
        <div class="">
          <button @click="closeModal" class="text-gray-600">
            <Icon name="material-symbols:close"/>
          </button>
        </div>
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Rezept zuweisen</h3>
        <div class="mb-4">
          <label for="recipeDate" class="block text-sm font-medium text-gray-700 mb-1">Datum auswählen:</label>
          <input type="date" v-model="selectedDate" id="recipeDate" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label for="morgenRecipe" class="block text-sm font-medium text-gray-700 mb-1">Morgen:</label>
          <select v-model="morgenRecipe" id="morgenRecipe" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option disabled value="">Bitte auswählen</option>
            <option v-for="recipe in breakfastRecipes" :key="recipe.id" :value="{ id: recipe.id, name: recipe.name }">{{ recipe.name }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="lunchRecipe" class="block text-sm font-medium text-gray-700 mb-1">Mittag:</label>
          <select v-model="lunchRecipe" id="lunchRecipe" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option disabled value="">Bitte auswählen</option>
            <option v-for="recipe in lunchRecipes" :key="recipe.id" :value="{ id: recipe.id, name: recipe.name }">{{ recipe.name }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="eveningRecipe" class="block text-sm font-medium text-gray-700 mb-1">Abend:</label>
          <select v-model="eveningRecipe" id="eveningRecipe" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option disabled value="">Bitte auswählen</option>
            <option v-for="recipe in dinnerRecipes" :key="recipe.id" :value="{ id: recipe.id, name: recipe.name }">{{ recipe.name }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="snackRecipe" class="block text-sm font-medium text-gray-700 mb-1">Snack:</label>
          <select v-model="snackRecipe" id="snackRecipe" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option disabled value="">Bitte auswählen</option>
            <option v-for="recipe in snackRecipes" :key="recipe.id" :value="{ id: recipe.id, name: recipe.name }">{{ recipe.name }}</option>
          </select>
        </div>
        <div class="flex justify-end">
          <button
            class="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
import { ref, onMounted } from 'vue';
const supabase = useSupabaseClient()
const emits = defineEmits(['close', 'assign']);
const selectedDate = ref('');
const morgenRecipe = ref<{ id: string; name: string } | null>(null);
const lunchRecipe = ref<{ id: string; name: string } | null>(null);
const eveningRecipe = ref<{ id: string; name: string } | null>(null);
const snackRecipe = ref<{ id: string; name: string } | null>(null);



const breakfastRecipes = ref([]);
const lunchRecipes = ref([]);
const dinnerRecipes = ref([]);
const snackRecipes = ref([]);

const closeModal  = () => {
  emits('close');
};

const assignRecipe = () => {
  if (selectedDate.value && morgenRecipe.value && lunchRecipe.value && eveningRecipe.value && snackRecipe.value) {

    const assignValues = {
      date: selectedDate.value,
      morgen: morgenRecipe.value,
      lunch: lunchRecipe.value,
      evening: eveningRecipe.value,
      snack: snackRecipe.value,
    };
    console.log(assignValues);
    emits('assign', assignValues);

    // Resetting the form fields
    selectedDate.value = '';
    morgenRecipe.value = null;
    lunchRecipe.value = null;
    eveningRecipe.value = null;
    snackRecipe.value = null;
  }
};

const fetchRecipesForMeal = async (meal: string) => {
  const { data, error } = await supabase
    .from('recepies')
    .select('id, name')
    .contains('categories', [meal]);
  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
  return data;
};

onMounted(async () => {
  breakfastRecipes.value = await fetchRecipesForMeal('Frühstück');
  lunchRecipes.value = await fetchRecipesForMeal('Mittagessen');
  dinnerRecipes.value = await fetchRecipesForMeal('Abendessen');
  snackRecipes.value = await fetchRecipesForMeal('Snack');
});
</script>

<style scoped>
/* Additional styling for improved appearance */
input:focus,
select:focus {
  border-color: #4a90e2;
  outline: none;
}

button:hover {
  background-color: #4a90e2;
}
</style>
