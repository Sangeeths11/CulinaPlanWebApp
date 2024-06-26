<script setup lang="ts">
definePageMeta({
  title: 'Rezepte Übersicht',
  middleware: ['auth-index'],
  layout: 'nav',
});

const supabase = useSupabaseClient()
const recipeStore = useRecipeStore();
const showDeleteButton = ref(false);
const showEditButton = ref(false);

const router = useRouter();
const deleteConfirmationModal = ref(null);
const recipeToDelete = ref(null);

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

onMounted(() => {
  recipeStore.fetchRecipes();
});
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
    <ActionButtons @create="openCreateRecipeModal" @edit="activateEditFunction" @delete="activateDeleteFunction" />
  </div>
</template>

<style scoped>
</style>
