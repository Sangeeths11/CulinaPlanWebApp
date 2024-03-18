<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg p-4 max-w-sm mx-auto">
      <h2 class="font-bold text-lg">Rezept löschen</h2>
      <p class="text-sm my-4">Möchten Sie dieses Rezept wirklich löschen?</p>
      <div class="flex justify-end gap-4">
        <button @click="cancel" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Abbrechen</button>
        <button @click="confirm" class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Löschen</button>
      </div>
    </div>
  </div>
</template>

<script setup>

const emit = defineEmits(['confirm']);
const isVisible = ref(false);

function show() {
  isVisible.value = true;
}

function hide() {
  isVisible.value = false;
}

function confirm() {
  emit('confirm');
  hide();
}

function cancel() {
  hide();
}

defineExpose({ show, hide });
</script>
