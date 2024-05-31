<template>
  <div class="fixed bottom-10 right-10 flex flex-col items-center">
    <ActionButton
      color="blue"
      iconPath="M12 6v12m6-6H6"
      @click="openCreateRecipeModal" />

    <ActionButton
      color="yellow"
      iconPath="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L12 21H3v-9l10.768-10.768"
      @click="activateEditFunction" />

    <ActionButton
      color="red"
      iconPath="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      @click="activateDeleteFunction" />
  </div>
</template>

<script setup>
const emit = defineEmits(['create', 'edit', 'delete']);

function openCreateRecipeModal() {
  emit('create');
}

function activateEditFunction() {
  emit('edit');
}

function activateDeleteFunction() {
  emit('delete');
}
</script>
