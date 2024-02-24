<template>
  <div class="flex flex-col items-center justify-center min-h-screen relative">
    <div class="absolute top-0 right-0 p-5">
      <LoginButton/>
    </div>
    <div class="text-center">
      <h1 class="text-6xl font-bold">
        Welcome to CulinaPlan
      </h1>
      <p class="mt-4 text-xl max-w-lg mx-auto">
        CulinaPlan is an innovative web application that aims to revolutionize the everyday cooking experience. With a user-friendly interface, CulinaPlan allows users to discover recipes, create personalized meal plans and efficiently generate shopping lists.
      </p>
      <StartExploringButton/>
    </div>
  </div>
  <NuxtPage/>
</template>

<script lang="ts">

</script>

<style>

</style>