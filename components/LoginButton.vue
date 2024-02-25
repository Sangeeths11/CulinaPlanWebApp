<template>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2" @click="references">
      <Icon name="oi:account-login" color="white"/>
      Login
    </button>
</template>

<script setup lang="ts">
  const router = useRouter()
  function references(event) {
    router.push('/login')
  }
</script>