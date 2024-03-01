<template>
    <div>
      <ClientOnly>
        <apexchart
          :key="series"
          height="400"
          width="100%"
          :options="options"
          :series="series"
        ></apexchart>
      </ClientOnly>
      <button
        class="
          bg-blue-500
          hover:bg-blue-700
          text-white
          font-bold
          py-2
          px-4
          ml-8
          rounded
        "
        @click="updateChart"
      >
        Change
      </button>
    </div>
  </template>
  <script setup lang="ts">
  const options = ref({
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        borderRadiusApplication: 'around',
      },
    },
  });
  const series = ref([
    {
      name: 'Score',
      data: [],
    },
  ]);
  const updateChart = () => {
    //generate array of random numbers of length 10
    const data = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 100)
    );
    options.value = {
      ...options.value,
      xaxis: {
        categories: Array.from(
          { length: 10 },
          (_, i) => new Date().getFullYear() - i
        ), // array of last 10 years
      },
    };
    series.value = [
      {
        name: 'Score',
        data: data,
      },
    ];
  };
  onMounted(() => {
    //generate array of random numbers of length 10
    updateChart();
  });
  </script>
  