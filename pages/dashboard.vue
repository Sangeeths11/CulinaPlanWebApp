<template>
  <ClientOnly>
    <div class="min-h-screen bg-gray-100 p-4 md:p-10">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div v-for="(chart, index) in charts" :key="index" class="rounded-lg overflow-hidden border border-gray-200">
          <h2 class="bg-blue-500 text-white text-lg font-bold p-4">{{ chart.title }}</h2>
          <apexchart :key="'chart-' + index" type="donut" height="350" :options="chart.options" :series="chart.series"></apexchart>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const categoryCounts = {};
definePageMeta({
  title: 'Dashboard',
  layout: 'default',
  middleware: ['auth-index'],
});

const charts = reactive([
  {
    title: 'Rezepte pro Kategorie',
    options: {
      chart: {
        type: 'donut',
      },
      labels: [],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      }],
    },
    series: [],
  },
  // Fügen Sie hier weitere Charts hinzu, falls gewünscht
]);

const recipeStore = useRecipeStore();

const updateChartsWithRecipeData = () => {
  const categoryCounts = {};

  recipeStore.recipes.forEach(recipe => {
    recipe.categories.forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
  });

  const categories = Object.keys(categoryCounts);
  const counts = Object.values(categoryCounts);

  const categoryChartIndex = charts.findIndex(chart => chart.title === 'Rezepte pro Kategorie');
  if (categoryChartIndex !== -1) {
    const updatedChart = { ...charts[categoryChartIndex] };
    updatedChart.options = { ...updatedChart.options, labels: categories };
    updatedChart.series = counts;
    charts[categoryChartIndex] = updatedChart;
  }
};

onMounted(async () => {
  await nextTick();
  recipeStore.fetchRecipes().then(() => {
    updateChartsWithRecipeData(); // Aktualisieren Sie die Charts, nachdem die Rezepte abgerufen wurden
  });
});
</script>

<style scoped>
/* Stildefinitionen nach Bedarf */
</style>
