<script setup lang="ts">
const supabase = useSupabaseClient();
const router = useRouter();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const register = async () => {
  if (password.value !== confirmPassword.value) {
    console.log("Passwords do not match.");
    return;
  }

  const { user, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (error) {
    console.log(error.message);
  } else {
    console.log("Registration successful, redirecting...");
    router.push('/login');
  }
};
definePageMeta({
  layout: 'non',
})
</script>
<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h1 class="text-2xl md:text-3xl font-bold mb-4 text-center">Sign Up</h1>
      <div class="flex items-center justify-center mb-6">
        <img src="assets/spoon.png" alt="Logo" class="w-16 h-16 rounded-full">
      </div>
      <form @submit.prevent="register" class="flex flex-col items-center">
        <div class="mb-4 w-full">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <div class="flex items-center relative">
            <Icon name="ic:baseline-email" class="absolute left-3 w-5 h-5 text-gray-400" />
            <input 
            class="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="email" 
            type="email" 
            placeholder="Email" 
            v-model="email">
          </div>
        </div>
        <div class="mb-6 w-full">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
          <div class="flex items-center relative">
            <Icon name="carbon:password" class="absolute left-3 w-5 h-5 text-gray-400" style="top: 40%; transform: translateY(-50%);" />
            <input 
            class="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
            id="password" 
            type="password" 
            placeholder="******************" 
            v-model="password">
          </div>
        </div>
        <div class="mb-6 w-full">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="confirm_password">Confirm Password</label>
          <div class="flex items-center relative">
            <Icon name="carbon:password" class="absolute left-3 w-5 h-5 text-gray-400" style="top: 40%; transform: translateY(-50%);" />
            <input 
            class="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="confirm_password" 
            type="password" 
            placeholder="******************" 
            v-model="confirmPassword">
          </div>
        </div>
        <div class="mb-4 w-full">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
            Sign Up
          </button>
        </div>
        <div class="flex flex-col items-center md:flex-row w-full justify-center">
          <span class="text-gray-600 text-sm">Already have an account?</span>
          <NuxtLink to="/login" class="text-blue-500 text-sm">Login here</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
/* Dein Style bleibt unverändert */
</style>
