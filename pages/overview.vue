<script setup lang="ts">
const supabase = useSupabaseClient()
const recipeStore = useRecipeStore();
const showDeleteButton = ref(false);
const showEditButton = ref(false);

const router = useRouter();
const deleteConfirmationModal = ref(null);
const recipeToDelete = ref(null);

definePageMeta({
  title: 'Rezepte Übersicht',
  middleware: ['auth-index'],
  layout: 'default',
});

onMounted(() => {
  recipeStore.fetchRecipes();
});

const openCreateRecipeModal = () => {
  router.push('/createRecipe');
};

function openDeleteConfirmation(recipe) {
  recipeToDelete.value = recipe;
  deleteConfirmationModal.value.show();
}

const confirmDeletion = async () => {
  if (recipeToDelete.value) {
    console.log('Lösche Rezept ID:', recipeToDelete.value);
    await recipeStore.deleteRecipe(recipeToDelete.value);
    recipeToDelete.value = null;
    await recipeStore.fetchRecipes();
  }
};

const activateDeleteFunction = () => {
  if (showDeleteButton.value) {
    showDeleteButton.value = false;
    return;
  }
  else {
    showDeleteButton.value = true;
  }
};

const activateEditFunction = () => {
  if (showEditButton.value) {
    showEditButton.value = false;
    return;
  }
  else {
    showEditButton.value = true;
  }
};

const editRecipe = async (recipe) => {
  console.log('Bearbeitungsfunktion für Rezept ID:', recipe.id);
  router.push(`/editRecipe/${recipe.id}`);
};

const applyFilter = (filterData) => {
  console.log('Filter angewendet:', filterData);
  recipeStore.fetchRecipes(filterData);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <DeleteConfirmationModal ref="deleteConfirmationModal" @confirm="confirmDeletion"/>
    <div class="p-5">
      <h1 class="text-3xl font-bold mb-2">Rezepte Übersicht</h1>
    </div>

    <div class="p-5">
      <FilterBar @applyFilter="applyFilter" />
    </div>
    <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="recipe in recipeStore.recipes" :key="recipe.id" class="relative bg-white rounded-lg shadow-md overflow-hidden">
        <button v-if="showDeleteButton" @click="openDeleteConfirmation(recipe)" class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button v-if="showEditButton" @click="editRecipe(recipe)" class="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L12 21H3v-9l10.768-10.768z" />
          </svg>
        </button>
        <img :src="recipe.image_url" alt="Gerichtsbild" class="w-full h-32 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-bold mb-2">{{ recipe.name }}</h2>
          <p class="text-gray-700 text-base mb-2">{{ recipe.description }}</p>
          <div class="flex flex-wrap">
            <span v-for="tag in recipe.allergies" :key="tag" class="text-xs font-semibold mr-2 px-2.5 py-0.5 mt-2 rounded bg-red-100 text-red-800">
              {{ tag }}
            </span>
            <span v-for="tag in recipe.categories" :key="tag" class="text-xs font-semibold mr-2 px-2.5 py-0.5 mt-2 rounded bg-blue-100 text-blue-800">
              {{ tag }}
            </span>
            <span class="text-xs font-semibold mr-2 px-2.5 py-0.5 mt-2 rounded bg-green-100 text-green-800">
              {{ recipe.typ }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed bottom-10 right-10 flex flex-col items-center">
      <button @click="openCreateRecipeModal" class="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition duration-300 flex items-center justify-center group">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      </button>

      <button @click="activateEditFunction" class="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg transition duration-300 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L12 21H3v-9l10.768-10.768z" />
        </svg>
      </button>

      <button @click="activateDeleteFunction" class="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition duration-300 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
