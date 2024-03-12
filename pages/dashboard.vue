<template>
  <ClientOnly>
    <div class="min-h-screen bg-gray-100 p-4 md:p-10">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div v-for="(chart, index) in charts" :key="index" class="rounded-lg overflow-hidden border border-gray-200">
          <h2 class="bg-blue-500 text-white text-lg font-bold p-4">{{ chart.title }}</h2>
          <apexchart :key="'chart-' + index" height="300" :options="chart.options" :series="chart.series"></apexchart>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const charts = reactive([
  {
    title: 'Chart 1',
    options: {
      chart: {
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
        },
      },
      xaxis: {
        categories: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),
      },
    },
    series: [{
      name: 'Score',
      data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
    }],
  },
  {
    title: 'Chart 2',
    options: {
      chart: {
        type: 'line',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
    },
    series: [{
      name: 'Sales',
      data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000)),
    }],
  },
  {
    title: 'Chart 3',
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['Team A', 'Team B', 'Team C'],
    },
    series: [30, 40, 30],
  },
  {
    title: 'Chart 4',
    options: {
      chart: {
        type: 'pie',
      },
      labels: ['Product 1', 'Product 2', 'Product 3', 'Product 4'],
    },
    series: [300, 500, 200, 400],
  },
]);

const updateCharts = () => {
  charts.forEach((chart, index) => {
    if (chart.options.chart.type === 'bar' || chart.options.chart.type === 'line') {
      chart.series[0].data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
    } else if (chart.options.chart.type === 'donut' || chart.options.chart.type === 'pie') {
      chart.series = Array.from({ length: 3 }, () => Math.floor(Math.random() * 100));
    }
  });
};

onMounted(async () => {
  await nextTick();
  updateCharts();
});
</script>
