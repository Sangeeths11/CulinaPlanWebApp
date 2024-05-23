<script setup lang="ts">
import NetworkBackground from '~/components/startingPage/NetworkBackground.vue';

definePageMeta({
  middleware: ['auth-index'],
  layout: 'non',
  title: 'CulinaWebApp - Home',
})
</script>

<template>
  <div>
    <NetworkBackground/>
  </div>
</template>

<style>
</style>