<template>
  <div class="flex flex-wrap md:flex-nowrap min-h-screen bg-gray-100">
    <!-- Linke Seite: Formular für Benutzerdaten -->
    <div class="flex-auto p-10">
      <h2 class="text-2xl font-bold mb-5">Profil bearbeiten</h2>
      <form class="space-y-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Profilbild</label>
          <div class="flex items-center justify-center w-full">
              <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800  hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input type="file" id="dropzone-file" @change="handleImageUpload" class="hidden" accept="image/*">
              </label>
          </div>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" v-model="user.name">
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Benutzername</label>
          <input type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" v-model="user.username">
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">E-Mail</label>
          <input type="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" v-model="user.email">
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Geburtsdatum</label>
          <input type="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" v-model="user.birthday">
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Webseite / Social Media</label>
          <input type="url" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" v-model="user.website">
        </div>

        <button type="button" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Speichern</button>
      </form>
    </div>
    
    <!-- Rechte Seite: ID-Karte Vorschau -->
    <div class="flex-auto p-10">
      <div class="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex">
        <div class="w-1/3">
          <!-- Quadratisches Profilbild -->
          <div class="p-2 w-full h-full flex justify-center items-center bg-gray-200">
            <img class="object-cover w-full h-full" :src="user.profileImage" alt="Profilbild" style="aspect-ratio: 1 / 1;">
          </div>
        </div>
        <div class="w-2/3 p-5">
          <div class="text-left">
            <p class="text-lg text-gray-700 font-bold">{{user.name}}</p>
            <p class="text-md text-gray-500">{{user.username}}</p>
            <p class="text-sm text-gray-500">{{user.email}}</p>
            <p class="text-sm text-gray-500" v-if="user.bio">{{user.bio}}</p>
            <p class="text-sm text-gray-500">{{user.birthday}}</p>
            <a :href="user.website" class="text-sm text-blue-500" v-if="user.website">{{user.website}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const user = ref({
  name: '',
  username: '',
  email: '',
  bio: '',
  birthday: '',
  website: '',
  profileImage: '', // Standardbild oder Platzhalterbild
});

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      user.value.profileImage = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};
</script>

<style>

</style>
