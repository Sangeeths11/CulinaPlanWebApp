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

const assignRecipe = (date, recipe) => {
  const formattedDate = new Date(date).toISOString().split('T')[0];
  if (!assignedRecipes.value[formattedDate]) {
    assignedRecipes.value[formattedDate] = [];
  }
  assignedRecipes.value[formattedDate].push(recipe);
  calenderUpdate();
};

const calenderUpdate = () => {
  const attributes = [];
  
  for (const date in assignedRecipes.value) {
    let labelname = 'Rezepte: '; // Initialisiert labelname für jedes Datum neu
    const recipes = assignedRecipes.value[date];

    // Überprüft, ob mehr als ein Rezept für das Datum vorhanden ist
    if (recipes.length > 1) {
      recipes.forEach((recipe, index) => {
        // Fügt jedes Rezept zum labelname hinzu, trennt mit Komma, außer beim letzten Element
        labelname += `${recipe}${index < recipes.length - 1 ? ', ' : ''}`;
      });
    } else {
      // Wenn nur ein Rezept vorhanden ist, fügt dieses direkt hinzu
      labelname += recipes[0];
    }

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
};



</script>