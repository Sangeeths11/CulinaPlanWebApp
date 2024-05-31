<template>
  <div v-if="proteins || carbohydrates">
    <h3 class="font-semibold">Nährwerte:</h3>
    <p v-if="proteins">Proteine: {{ proteins }}</p>
    <p v-if="carbohydrates">Kohlenhydrate: {{ carbohydrates }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  proteins: Number,
  carbohydrates: Number
});
</script>
