<script setup lang="ts">
const showSideNav = ref(false);
const supabase = useSupabaseClient()
const recipeStore = useRecipeStore();
const showDeleteButton = ref(false);


const toggleSideNav = () => {
  showSideNav.value = !showSideNav.value;
};

const router = useRouter();

definePageMeta({
  title: 'Rezepte Übersicht',
  middleware: ['auth-index']
});

onMounted(() => {
  recipeStore.fetchRecipes();
});

const openCreateRecipeModal = () => {
  router.push('/createRecipe');
};

const confirmDeletion = async (recipe) => {
  if (window.confirm('Möchten Sie dieses Rezept wirklich löschen?')) {
    await recipeStore.deleteRecipe(recipe);
  }
  showDeleteButton.value = false;
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

</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div v-show="showSideNav" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50" @click="toggleSideNav"></div>
    
    <div v-show="showSideNav" class="fixed inset-y-0 left-0 bg-white shadow-md z-50 w-64 flex flex-col py-4 transform transition-transform duration-300" :class="{ '-translate-x-full': !showSideNav }">
      <router-link to="/dashboard" class="px-6 py-3 text-lg font-semibold flex items-center space-x-4 hover:bg-gray-100">
        <Icon name="material-symbols:dashboard-outline" class="h-6 w-6 text-blue-500" />
        Dashboard
      </router-link>
      <router-link to="/calenderView" class="px-6 py-3 text-lg font-semibold flex items-center space-x-4 hover:bg-gray-100">
        <Icon name="uil:calender" class="h-6 w-6 text-blue-500" />
        Kalender
      </router-link>
      <router-link to="/profile" class="px-6 py-3 text-lg font-semibold flex items-center space-x-4 hover:bg-gray-100">
        <Icon name="iconamoon:profile" class="h-6 w-6 text-blue-500" />
        Profile
      </router-link>
    </div>

    <div class="flex justify-between items-center p-5">
      <button @click="toggleSideNav" class="p-2 bg-blue-500 text-white rounded-md">
        <Icon name="heroicons-solid:menu" class="h-6 w-6" />
      </button>
      
      <div class="flex items-center space-x-2">
        <span class="text-gray-600">Benutzername</span>
        <img src="assets/spoon.png" alt="Profil" class="h-10 w-10 rounded-full">
      </div>
    </div>
    <div class="p-5">
      <h1 class="text-3xl font-bold mb-2">Rezepte Übersicht</h1>
    </div>

    <div class="p-5">
      <FilterBar/>
    </div>
    <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="recipe in recipeStore.recipes" :key="recipe.id" class="relative bg-white rounded-lg shadow-md overflow-hidden">
        <button v-if="showDeleteButton" @click="confirmDeletion(recipe)" class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="recipe.image_url" alt="Gerichtsbild" class="w-full h-32 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-bold mb-2">{{ recipe.name }}</h2>
          <p class="text-gray-700 text-base mb-2">{{ recipe.description }}</p>
          <div class="flex flex-wrap">
            <span v-for="tag in recipe.allergies" :key="tag" class="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-red-100 text-red-800">
              {{ tag }}
            </span>
            <span v-for="tag in recipe.categories" :key="tag" class="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
              {{ tag }}
            </span>
            <span class="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-green-100 text-green-800">
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
