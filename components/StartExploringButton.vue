<template>
   <button class="bg-green-500 text-white font-bold py-2 px-4 rounded mt-8 effect-button" @click="redirect">
      <Icon name="gis:flag-start" color="white"/>
      Start Exploring!
    </button>
</template>

<script setup lang="ts">
const router = useRouter()
function redirect(event) {
   router.push('/overview')
}
</script>

<style scoped>
</style>
