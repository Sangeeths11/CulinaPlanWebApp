<template>
  <div class="p-4 bg-white shadow rounded-lg">
    <div class="flex items-center gap-4 mb-4">
      <input type="text" v-model="searchQuery" placeholder="Suche nach Rezepten..." class="border p-2 rounded w-full transition duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      <button @click="toggleAdvancedSearch" class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition duration-300">
        <Icon name="mdi:filter" class="w-6 h-6" />
      </button>
    </div>

    <transition name="fade">
      <div v-if="showAdvancedSearch" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select v-model="selectedCategory" class="border p-2 rounded transition duration-300 hover:border-blue-500">
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
        <select v-model="selectedAllergy" class="border p-2 rounded transition duration-300 hover:border-blue-500">
          <option v-for="allergy in allergies" :key="allergy" :value="allergy">{{ allergy }}</option>
        </select>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('');
const showAdvancedSearch = ref(false);
const selectedCategory = ref('');
const categories = ['Alle', 'Frühstück', 'Mittagessen', 'Abendessen', 'Snacks'];
const selectedAllergy = ref('');
const allergies = ['Keine', 'Nüsse', 'Gluten', 'Laktose'];

const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value;
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
