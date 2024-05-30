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
      <div class="mb-4">
        <div class="flex items-center justify-center w-full">
            <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800  hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input type="file" id="dropzone-file" @change="handleImageUpload" class="hidden" accept="image/*">
            </label>
        </div> 
      </div>
      <div class="mb-4">
        <label for="recipeName" class="block text-gray-700 text-sm font-bold mb-2">Rezeptname</label>
        <input type="text" id="recipeName" v-model="recipeName" @blur="generateRecipe" placeholder="Geben Sie einen Rezeptnamen ein und verlassen sie dieses Feld damit die AI ihnen die Zutaten vorschlagen kann" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
          Beschreibung
        </label>
        <textarea id="description" v-model="recipe.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"></textarea>
      </div>
      <div class="flex flex-wrap -mx-2">
        <div class="w-full px-2">
          <div class="flex flex-wrap -m-2">
            <div class="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Allergien
              </label>
              <div class="flex flex-wrap">
                <div v-for="(allergy, index) in allergies" :key="index" class="w-1/2 mb-2">
                  <input type="checkbox" :id="'allergy-' + index" v-model="selectedAllergies" :value="allergy">
                  <label :for="'allergy-' + index" class="text-gray-700 ml-2">{{ allergy }}</label>
                </div>
              </div>
            </div>
            <div class="w-full md:w-1/2 lg:w-1/3 px-2">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Kategorien
              </label>
              <div class="flex flex-wrap">
                <div v-for="(category, index) in categories" :key="index" class="w-1/2 mb-2">
                  <input type="checkbox" :id="'category-' + index" v-model="selectedCategories" :value="category">
                  <label :for="'category-' + index" class="text-gray-700 ml-2">{{ category }}</label>
                </div>
              </div>
            </div>
            <div class="w-full md:w-1/2 lg:w-1/3 px-2">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Ernährungstyp
              </label>
              <div class="flex flex-wrap">
                <div v-for="(typ, index) in types" :key="index" class="w-1/2 mb-2">
                  <input type="checkbox" :id="'category-' + index" v-model="selectedTyp" :value="typ" @change="handleNutritionTypeChange(typ)">
                  <label :for="'typ-' + index" class="text-gray-700 ml-2">{{ typ }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full px-2 mb-4 md:mb-0">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Einkaufsliste Zutaten
          </label>
          <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="flex flex-wrap items-center mb-2">
            <input type="text" v-model="ingredient.name" placeholder="Zutat" class="border rounded py-2 px-3 text-gray-700 mr-2 mb-2 flex-grow w-full md:w-auto">
            <input type="number" v-model="ingredient.quantity" placeholder="Anzahl" class="border rounded py-2 px-3 text-gray-700 mr-2 mb-2 flex-grow w-full md:w-auto">
            <input type="number" step="0.01" v-model="ingredient.price" placeholder="Preis (CHF)" class="border rounded py-2 px-3 text-gray-700 mr-2 mb-2 flex-grow w-full md:w-auto">
            <div class="flex space-x-1 mb-2 w-full md:w-auto">
              <button type="button" @click="removeIngredient(index)" class="flex justify-center items-center h-10 w-full md:w-10 bg-red-500 text-white rounded">
                <Icon name="pajamas:remove" class="h-6 w-6" />
              </button>
              <button type="button" @click="addIngredient" class="flex justify-center items-center h-10 w-full md:w-10 bg-green-500 text-white rounded">
                <Icon name="material-symbols:add" class="h-6 w-6" />
              </button>
            </div>
          </div>
          <div class="mb-6">
            <p class="text-gray-700 text-sm font-bold">Gesamtkosten: {{ calculateTotalCost.toFixed(2) }} CHF</p>
          </div>
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
  recipe.value.ingredients.push({ name: '', price: 0, quantity: 0});
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


const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const uniqueFileName = `recipes/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('image')
      .upload(uniqueFileName, file);

    if (uploadError) {
      errorMessage.value = uploadError.message;
      return;
    }
    else {
      //TODO: backend call to save image problem in Supabase waiting for the fix
      // self constructed url to solve the problem
      //#Welcome to Frontend Development
      const url = `https://${
        import.meta.env.VITE_SUPABASE_BUCKET
      }${uniqueFileName}`;
      console.log('Image uploaded:', url);
      uploadedImage.value = url;
      recipe.value.image = uniqueFileName;
    }
  }
};

const handleNutritionTypeChange = (selectedType) => {
  if (selectedType === 'Fleischhaltig') {
    selectedTyp.value = ['Fleischhaltig'];
  } else if (selectedType === 'Vegetarisch') {
    selectedTyp.value = ['Vegetarisch'];
  }
};

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

