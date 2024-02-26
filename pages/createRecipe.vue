<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-10">
    <h1 class="text-3xl font-bold mb-6">Rezept erstellen</h1>
    <form @submit.prevent="submitRecipe" class="bg-white shadow-md rounded px-4 md:px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="image">
          Bild hochladen
        </label>
        <input type="file" id="image" @change="handleImageUpload" class="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
          Beschreibung
        </label>
        <textarea id="description" v-model="recipe.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"></textarea>
      </div>
      <div class="flex flex-wrap -mx-2">
        <div class="w-full md:w-1/2 px-2 mb-4 md:mb-0 pr-5">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Einkaufsliste Zutaten
          </label>
          <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="flex items-center mb-2">
            <input type="text" v-model="ingredient.name" placeholder="Zutat" class="border rounded py-2 px-3 text-gray-700 mr-2 flex-grow">
            <input type="number" v-model="ingredient.quantity" placeholder="Anzahl" class="border rounded py-2 px-3 text-gray-700 mr-2 flex-grow">
            <input type="number" v-model="ingredient.price" placeholder="Preis (CHF)" class="border rounded py-2 px-3 text-gray-700 mr-2 flex-grow">
            <div class="flex space-x-1">
              <button type="button" @click="removeIngredient(index)" class="flex justify-center items-center h-10 w-10 bg-red-500 text-white rounded">
                <Icon name="pajamas:remove" class="h-6 w-6" />
              </button>
              <button type="button" @click="addIngredient" class="flex justify-center items-center h-10 w-10 bg-green-500 text-white rounded">
                <Icon name="material-symbols:add" class="h-6 w-6" />
              </button>
          </div>
          </div>
          <div class="mb-6">
            <p class="text-gray-700 text-sm font-bold">Gesamtkosten: {{ calculateTotalCost.toFixed(2) }} CHF</p>
          </div>
        </div>
        <div class="w-full md:w-1/2 px-2">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Allergien
          </label>
          <div class="flex flex-wrap pb-5">
            <div v-for="(allergy, index) in allergies" :key="index" class="w-full md:w-1/2 mb-2">
              <input type="checkbox" :id="'allergy-' + index" v-model="selectedAllergies" :value="allergy">
              <label :for="'allergy-' + index" class="text-gray-700 ml-2">{{ allergy }}</label>
            </div>
          </div>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Kategorien
          </label>
          <div class="flex flex-wrap">
            <div v-for="(category, index) in categories" :key="index" class="w-full md:w-1/2 mb-2">
              <input type="checkbox" :id="'category-' + index" v-model="selectedCategories" :value="category">
              <label :for="'category-' + index" class="text-gray-700 ml-2">{{ category }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between mt-6">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Rezept speichern
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">

interface Ingredient {
  name: string;
  price: number;
  quantity: number;
}

const recipe = ref({
  description: '',
  ingredients: [{ name: '', price: 0, quantity: 1 }],
  image: null,
});


const allergies = ['Gluten', 'Nüsse', 'Laktose', 'Soja'];
const categories = ['Frühstück', 'Mittagessen', 'Abendessen', 'Snack'];
const selectedAllergies = ref([]);
const selectedCategories = ref([]);

const addIngredient = () => {
  recipe.value.ingredients.push({ name: '', price: 0 });
};

const removeIngredient = (index: number) => {
  recipe.value.ingredients.splice(index, 1);
};

const calculateTotalCost = computed(() => {
  return recipe.value.ingredients.reduce((total, ingredient) => total + (ingredient.price * ingredient.quantity), 0);
});


const handleImageUpload = (event) => {
};

const submitRecipe = () => {
  alert('Rezept gespeichert (Dies ist nur ein Platzhalter)');
};
</script>

<style scoped>
@media (max-width: 640px) {
  .flex.items-center.mb-2 {
    flex-direction: column;
  }
  .flex.items-center.mb-2 .flex-grow {
    width: 100%;
    margin-bottom: 1rem;
  }
  .flex.space-x-1 {
    width: 100%;
    justify-content: space-around;
  }
  .flex.space-x-1 button {
    margin-bottom: 1rem;
  }
}
</style>
