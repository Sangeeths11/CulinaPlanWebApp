<script setup lang="ts">
const router = useRouter();
definePageMeta({
  title: 'Rezepte Übersicht',
  middleware: ['auth-index']
});

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const recipes = ref<Recipe[]>([
  { 
    id: 1, 
    title: 'Spaghetti Carbonara', 
    description: 'Ein klassisches italienisches Gericht.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgPJB_Jc4subauB-MliuT5DFLiNRr7XHPoNQ&usqp=CAU',
    tags: ['klassisch']
  },
  { 
    id: 2, 
    title: 'Gemüsecurry', 
    description: 'Würzig und nahrhaft.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgPJB_Jc4subauB-MliuT5DFLiNRr7XHPoNQ&usqp=CAU',
    tags: ['vegan', 'glutenfrei']
  },
]);
const openCreateRecipeModal = () => {
  router.push('/createRecipe');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="p-5 flex justify-between items-center">
      <button class="p-2 bg-blue-500 text-white rounded-md">Menu</button>
      <button class="p-2 bg-blue-500 text-white rounded-md">
        <img src="assets/spoon.png" alt="Profil" class="h-8 w-8 rounded-full">
      </button>
    </div>
    <div>
      <h1 class="text-3xl font-bold p-5">Recipe overview</h1>
    </div>
    <div class="p-5">
      <FilterBar/>
    </div>
    <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="recipe in recipes" :key="recipe.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <img :src="recipe.image" alt="Gerichtsbild" class="w-full h-32 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-bold mb-2">{{ recipe.title }}</h2>
          <p class="text-gray-700 text-base mb-2">{{ recipe.description }}</p>
          <div class="flex flex-wrap">
            <span v-for="tag in recipe.tags" :key="tag" class="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
              {{ tag }}
            </span>
            <span class="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
              mehr
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
    </div>
  </div>
</template>

<style scoped>
</style>
