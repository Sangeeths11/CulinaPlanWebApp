<template>
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

const today = new Date();
const showRecipeModal = ref(false);
const assignedRecipes = ref({});
const calendarAttributes = ref([]);
const supabase = useSupabaseClient()

const assignRecipe = (date, recipe) => {
  console.log(date, recipe);
  const formattedDate = new Date(date['date']).toISOString().split('T')[0];
  const supabase = useSupabaseClient()
  const router = useRouter()
  console.log(date);
  saveRecipeAssignment(formattedDate, date);
};

const saveRecipeAssignment = async (date, recipe) => {
  const { data, error } = await supabase
    .from('calender')
    .insert(
      {
        'date': date,
        'morning_id': recipe['morgen']['id'],
        'lunch_id': recipe['lunch']['id'],
        'evening_id': recipe['evening']['id'],
        'snack_id': recipe['snack']['id'],
      },
    );
  if (error) {
    console.error('Error saving recipe assignment:', error);
  } else {
    console.log('Recipe assignment saved:', data);
    fetchRecipeAssignments();
  }
};

const fetchRecipeAssignments = async () => {
  const { data, error } = await supabase
    .from('calender')
    .select(`
      date,
      morning:morning_id (name),
      lunch:lunch_id (name),
      evening:evening_id (name),
      snack:snack_id (name)
    `);

  if (error) {
    console.error('Error fetching recipe assignments with joins:', error);
    return;
  }

  const assignments = {};
  for (const item of data) {
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
definePageMeta({
  middleware: ['auth-index'],
})
</script>