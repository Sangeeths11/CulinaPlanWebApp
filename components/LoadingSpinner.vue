<template>
  <div class="fixed inset-0 bg-gray-400 bg-opacity-75 flex justify-center items-center z-50">
    <div class="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full" role="status">
      <span class="visually-hidden"></span>
    </div>
  </div>
</template>

<style>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner-border {
  display: inline-block;
  width: 4rem; 
  height: 4rem; 
  border-width: 0.5rem;
  border-color: rgba(255, 255, 255, 0.5);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>
