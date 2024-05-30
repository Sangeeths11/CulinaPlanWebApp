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
definePageMeta({
  title: 'Dashboard',
  layout: 'nav',
  middleware: ['auth-index'],
});

const categoryCounts = {};
const charts = reactive([]);
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
  else {
    charts.push({
      title: 'Rezepte pro Kategorie',
      options: {
        chart: {
          type: 'donut',
        },
        labels: categories,
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
      series: categoryCountsValues,
    });
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

const updateCalendarAssignmentsChart = () => {
  let dataPerDate = recipeStore.calenderAssignments.reduce((acc, curr) => {
    const date = curr.date.split('T')[0];
    const total = Object.values(curr).reduce((sum, meal) => {
      return sum + (meal.priceTotal || 0);
    }, 0);

    acc[date] = (acc[date] || 0) + total;
    return acc;
  }, {});

  const dates = Object.keys(dataPerDate);
  const totals = Object.values(dataPerDate);

  const chartIndex = charts.findIndex(chart => chart.title === 'Ausgaben pro Tag');
  if (chartIndex !== -1) {
    const updatedChart = { ...charts[chartIndex] };
    updatedChart.options = { ...updatedChart.options, labels: dates };
    updatedChart.series = totals;
    charts[chartIndex] = updatedChart;
  } else {
    charts.push({
      title: 'Ausgaben pro Tag',
      options: {
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          }
        },
        xaxis: {
          categories: dates,
        },
        dataLabels: {
          enabled: false
        },
      },
      series: [
        {
          name: 'Ausgaben',
          data: totals,
        },
      ],
    });
  }
  let dataPerDate2 = recipeStore.calenderAssignments.reduce((acc, curr) => {
    const date = curr.date.split('T')[0];
    const total = Object.values(curr).reduce((sum, meal) => {
      return sum + (meal.proteins || 0);
    }, 0);

    acc[date] = (acc[date] || 0) + total;
    return acc;
  }, {});

  const dates2 = Object.keys(dataPerDate2);
  const totals2 = Object.values(dataPerDate2);

  const chartIndex2 = charts.findIndex(chart => chart.title === 'Protein pro Tag');
  if (chartIndex2 !== -1) {
    const updatedChart = { ...charts[chartIndex2] };
    updatedChart.options = { ...updatedChart.options, labels: dates };
    updatedChart.series = totals;
    charts[chartIndex2] = updatedChart;
  } else {
    charts.push({
      title: 'Protein pro Tag',
      options: {
        chart: {
          type: 'area',
        },
        xaxis: {
          categories: dates2,
        },
        stroke: {
          curve: 'smooth'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0.0,
            stops: [0, 90, 100]
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy'
          },
        },
      },
      series: [
        {
          name: 'Protein',
          data: totals2,
        },
      ],
    });
  }
};

onMounted(async () => {
  await nextTick();
  recipeStore.fetchRecipes().then(() => {
    recipeStore.fetchCalenderAssignments().then(() => {
      updateChartsWithRecipeData();
      updateCalendarAssignmentsChart();
    });
  });

  recipeStore.fetchCalenderAssignments().then(() => {
    updateCalendarAssignmentsChart();
  });
});
</script>

<style scoped>

</style>
