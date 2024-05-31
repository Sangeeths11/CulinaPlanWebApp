<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-10">
    <div v-if="isLoading" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div class="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full" role="status">
        <span class="visually-hidden"></span>
      </div>
    </div>
    <h1 class="text-3xl font-bold mb-6">Rezept erstellen</h1>
    <form @submit.prevent="submitRecipeToSupabase" class="bg-white shadow-md rounded px-4 md:px-8 pt-6 pb-8 mb-4">
      <AlertMessage v-if="errorMessage" :message="errorMessage" type="error" class="mb-5" />
      <AlertMessage v-if="successMessage" :message="successMessage" type="success" class="mb-5"/>
      <div v-if="uploadedImage" class="mb-4 flex justify-center items-center">
        <img :src="uploadedImage" class="max-w-full h-auto max-h-60" alt="Hochgeladenes Bild" style="object-fit: contain;">
      </div>
      <ImageUploader @image-uploaded="handleImageUpload" />
      <TextInput id="recipeName" label="Rezeptname" v-model="recipeName" placeholder="Geben Sie einen Rezeptnamen ein..." @blur="generateRecipe" />
      <TextAreaInput id="description" label="Beschreibung" v-model="recipe.description" />

      <div class="flex flex-wrap -mx-2">
        <ChecklistSelector label="Allergien" :items="allergies" v-model:selectedValues="selectedAllergies" idPrefix="allergy" />
        <ChecklistSelector label="Kategorien" :items="categories" v-model:selectedValues="selectedCategories" idPrefix="category" />
        <ChecklistSelector label="Ernährungstyp" :items="types" v-model:selectedValues="selectedTyp" idPrefix="type" :singleSelection="true" />
      </div>
      <div class="w-full px-2 mb-4 md:mb-0">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Einkaufsliste Zutaten
        </label>
        <div v-for="(ingredient, index) in recipe.ingredients" :key="index">
          <IngredientItem :ingredient="ingredient" :index="index" 
                          @remove-ingredient="removeIngredient"
                          @add-ingredient="addIngredient"/>
        </div>
        <div class="mb-6">
          <p class="text-gray-700 text-sm font-bold">Gesamtkosten: {{ calculateTotalCost.toFixed(2) }} CHF</p>
        </div>
      </div>
      <div class="flex items-center justify-between mt-6">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Rezept speichern
        </button>
      </div>
    </form>
    <div v-if="generatedRecipe" class="bg-white p-5 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-2">AI generierter Rezept zu {{ generatedRecipe.name }}</h2>
      <div v-if="generatedRecipe.Proteins || generatedRecipe.Carbohydrates">
        <h3 class="font-semibold">Nährwerte:</h3>
        <p v-if="generatedRecipe.Proteins">Proteine: {{ generatedRecipe.Proteins }}</p>
        <p v-if="generatedRecipe.Carbohydrates">Kohlenhydrate: {{ generatedRecipe.Carbohydrates }}</p>
      </div>
      <div v-if="generatedRecipe.ingredients && generatedRecipe.ingredients.length > 0">
        <h3 class="font-semibold mt-4 mb-2">Zutaten:</h3>
        <ul>
          <li v-for="(ingredient, index) in generatedRecipe.ingredients" :key="index">
            {{ ingredient.name }} - {{ ingredient.amount }} ({{ ingredient.cost }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth-index'],
  layout: 'nav',
})

const { chatCompletion } = useChatgpt()
const recipeName = ref('');
const generatedRecipe = ref('');
const router = useRouter();
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const recipeStore = useRecipeStore();

const generateRecipe = async () => {
  if (recipeName.value.trim() !== '') {
    isLoading.value = true;
    try {
      const prompt = `
        Give me the recipe for ${recipeName.value}. Please make sure that you indicate the cost and quantity of each product. It is important that you give me this information in a nicely structured way.
        The output should be given in JSON format, everything else will not be accepted:

        {
        "name": "Name of recipe",
        "Proteins": "in grams",
        "Carbohydrates": "in grams",
        "ingredients": [
          {
            "name": "",
            "cost": "in CHF",
            "amount": "in number"
          },
          {
            etc.
          }
          ]
        }
        `
      const chatTree = [
        {
          role: 'user',
          content: prompt,
        }
      ]

      const response = await chatCompletion(chatTree, 'gpt-3.5-turbo-0301')
      const responseData = JSON.parse(response[0].message.content);

      generatedRecipe.value = responseData;

      console.log('Rezeptvorschlag wurde generiert.')
      successMessage.value = 'AI Rezeptvorschlag wurde generiert.';
    } catch (error) {
      generateRecipe()
      errorMessage.value = error.message;
      console.log('Fehler beim Generieren des Rezeptvorschlags: ' + error.message)
    }finally {
      isLoading.value = false;
    }
  } else {
    console.log('Bitte geben Sie zuerst einen Rezeptnamen ein.')
  }
};

const selectedTyp = ref([]);

watchEffect(() => {
  console.log(selectedTyp.value.length);
});

interface Ingredient {
  name: string;
  price: number;
  quantity: number;
}

const recipe = ref({
  description: '',
  ingredients: [{ name: '', price: 0, quantity: 1 }],
  image: null,
});

const uploadedImage = ref(null);

const allergies = ['Gluten', 'Nüsse', 'Laktose', 'Soja'];
const categories = ['Frühstück', 'Mittagessen', 'Abendessen', 'Snack'];
const types = ['Fleischhaltig','Vegetarisch'];
const selectedAllergies = ref([]);
const selectedCategories = ref([]);

const addIngredient = () => {
  recipe.value.ingredients.push({ name: '', price: 0, quantity: 1});
};

const removeIngredient = (index: number) => {
  if (recipe.value.ingredients.length > 1)
  {
    recipe.value.ingredients.splice(index, 1);
  }
};

const calculateTotalCost = computed(() => {
  return recipe.value.ingredients.reduce((total, ingredient) => total + (ingredient.price * ingredient.quantity), 0);
});

async function handleImageUpload(file) {
  try {
    const uniqueFileName = `recipes/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('image')
      .upload(uniqueFileName, file);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    uploadedImage.value = `https://${import.meta.env.VITE_SUPABASE_BUCKET}${uniqueFileName}`;
    recipe.value.image = uniqueFileName;
  } catch (error) {
    errorMessage.value = error.message;
    console.error('Upload failed:', error);
  }
}

const supabase = useSupabaseClient()
const user = useSupabaseUser()

async function submitRecipeToSupabase(){
  try{
    const proteinsExtract = generatedRecipe.value.Proteins.match(/\d+/g);
    const carbohydratesExtract = generatedRecipe.value.Carbohydrates.match(/\d+/g);

    const protein = proteinsExtract ? parseInt(proteinsExtract[0], 10) : null;
    const carbohydrates = carbohydratesExtract ? parseInt(carbohydratesExtract[0], 10) : null;

    const recipeDetails = {
      name: recipeName.value,
      description: recipe.value.description,
      allergies: selectedAllergies.value,
      categories: selectedCategories.value,
      typ: selectedTyp.value[0],
      image_url: uploadedImage.value,
      user_id: user.value.id,
      proteins: protein,
      carbohydrates: carbohydrates,
      priceTotal: calculateTotalCost.value
    }
    
    try {
      if (recipeDetails.name === '') {
        errorMessage.value = 'Bitte geben Sie einen Rezeptnamen ein.';
        return;
      }
      recipeStore.saveRecipe(recipeDetails, recipe.value.ingredients);
    } catch (error) {
      errorMessage.value = error.message;
    }
  } catch (error) {
    errorMessage.value = 'Bitte generieren Sie zuerst ein Rezept.';
  }
}
</script>

<style scoped>
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

