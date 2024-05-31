<template>
  <div v-if="ingredients && ingredients.length > 0">
    <h3 class="font-semibold mt-4 mb-2">Zutaten:</h3>
    <ul>
      <li v-for="(ingredient, index) in ingredients" :key="index">
        {{ ingredient.name }} - {{ ingredient.amount }} ({{ ingredient.cost }})
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  ingredients: Array
});
</script>
