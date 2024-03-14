<template>
  <div>
    <div v-show="showSideNav" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50" @click="toggleSideNav"></div>
    <div v-show="showSideNav" class="fixed inset-y-0 left-0 bg-white shadow-md z-50 w-64 flex flex-col py-4 transform transition-transform duration-300" :class="{ '-translate-x-full': !showSideNav }">
      <router-link to="/overview" class="px-6 py-3 text-lg font-semibold flex items-center space-x-4 hover:bg-gray-100">
        <Icon name="material-symbols:home-outline" class="h-6 w-6 text-blue-500" />
        Home
      </router-link>
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

    <!-- Hauptbereich für Seiteninhalt -->
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
const showSideNav = ref(false)

function toggleSideNav() {
  showSideNav.value = !showSideNav.value
}
</script>

<style>
/* Globale Stile oder spezifische Layout-Stile */
</style>
