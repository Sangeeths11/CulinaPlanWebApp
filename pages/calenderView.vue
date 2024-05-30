<template>
  <div v-if="calenderStore.errorMessage" class="mb-4 w-full">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">
        <Icon name="ic:round-error" class="w-5 h-5 inline-block" />
      </strong>
      <span class="block sm:inline pl-2">{{ calenderStore.errorMessage }}</span>
    </div>
  </div>
  <div class="min-h-screen bg-gray-100 p-4 md:p-10">
    <h1 class="text-3xl font-bold mb-6">Mein Kalender</h1>
    <div class="mb-6">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="showRecipeModal = true"
      >
        Rezept zuweisen
      </button>
    </div>
    <div v-if="showRecipeModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded shadow-lg">
        <RecipeModal
          @close="showRecipeModal = false"
          @assign="assignRecipe"
        />
      </div>
    </div>
    <VCalendar 
    :rows="2" 
    expanded
    :attributes="calendarAttributes"
    :model-value="today"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth-index'],
  layout: 'nav',
})

const today = new Date();
const showRecipeModal = ref(false);
const assignedRecipes = ref({});
const calendarAttributes = ref([]);
const supabase = useSupabaseClient()
const calenderStore = useCalenderStore();

const assignRecipe = (date, recipe) => {
  console.log(date, recipe);
  const formattedDate = new Date(date['date']).toISOString().split('T')[0];
  const supabase = useSupabaseClient()
  const router = useRouter()
  console.log(date);
  calenderStore.saveRecipeAssignment(formattedDate, date);
  calenderStore.fetchCalenderAssignments();
  fetchRecipeAssignments();
};

const fetchRecipeAssignments = async () => {
  await calenderStore.fetchCalenderAssignments();
  const assignments = {};
  for (const item of calenderStore.calenderAssignments) {
    const { date, morning, lunch, evening, snack } = item;
    assignments[date] = {
      morning: morning ? { id: morning.id, name: morning.name } : undefined,
      lunch: lunch ? { id: lunch.id, name: lunch.name } : undefined,
      evening: evening ? { id: evening.id, name: evening.name } : undefined,
      snack: snack ? { id: snack.id, name: snack.name } : undefined,
    };
  }
  assignedRecipes.value = assignments;
  calenderUpdate();
};

const calenderUpdate = () => {
  const attributes = [];
  for (const date in assignedRecipes.value) {
    const labelname = assignedRecipes.value[date]['morning']['name'] + ', ' + assignedRecipes.value[date]['lunch']['name'] + ', ' + assignedRecipes.value[date]['evening']['name'] + ', ' + assignedRecipes.value[date]['snack']['name'];
    attributes.push({
      key: date,
      dates: [date],
      highlight: {
        contentClass: 'bg-green-200',
      },
      popover: {
        label: labelname,
      },
    });
  }
  calendarAttributes.value = attributes;
  nextTick(() => {
    console.log("Kalender-Attribute wurden aktualisiert.");
  });
  console.log(calendarAttributes.value);
};

onMounted(async () => {
  await fetchRecipeAssignments();
});
</script>