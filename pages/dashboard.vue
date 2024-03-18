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

]);

const recipeStore = useRecipeStore();

const updateChartsWithRecipeData = () => {
  const categoryCounts = {};
  const typeCounts = {};

  recipeStore.recipes.forEach(recipe => {
    recipe.categories.forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });


    const type = recipe.typ;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const categories = Object.keys(categoryCounts);
  const categoryCountsValues = Object.values(categoryCounts);

  const types = Object.keys(typeCounts);
  const typeCountsValues = Object.values(typeCounts);

  const categoryChartIndex = charts.findIndex(chart => chart.title === 'Rezepte pro Kategorie');
  if (categoryChartIndex !== -1) {
    const updatedCategoryChart = { ...charts[categoryChartIndex] };
    updatedCategoryChart.options = { ...updatedCategoryChart.options, labels: categories };
    updatedCategoryChart.series = categoryCountsValues;
    charts[categoryChartIndex] = updatedCategoryChart;
  }


  const typeChartIndex = charts.findIndex(chart => chart.title === 'Rezepte nach Typ');
  if (typeChartIndex !== -1) {
    const updatedTypeChart = { ...charts[typeChartIndex] };
    updatedTypeChart.options = { ...updatedTypeChart.options, labels: types };
    updatedTypeChart.series = typeCountsValues;
    charts[typeChartIndex] = updatedTypeChart;
  } else {
    charts.push({
      title: 'Rezepte nach Typ',
      options: {
        chart: {
          type: 'donut',
        },
        labels: types,
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
      series: typeCountsValues,
    });
  }
};

onMounted(async () => {
  await nextTick();
  recipeStore.fetchRecipes().then(() => {
    updateChartsWithRecipeData();
  });
});
</script>

<style scoped>

</style>
