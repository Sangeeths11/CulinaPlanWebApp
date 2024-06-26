export const useRecipeStore = defineStore('recipeStore', () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const router = useRouter();
  const currentRecipe = ref([]);
  const currentIngredients = ref([]);
  const recipes = ref([]);
  const filteredRecipes = ref([]);
  const calenderAssignments = ref([]);

  const fetchRecipe = async (recipe) => {
      const { data, error } = await client
        .from('recepies')
        .select('*')
        .eq('id', recipe)
        .single();
      if (error) {
          console.error('Error loading recipe', error);
      } else {
          console.log('data', data);
          currentRecipe.value = data;
      }
  };

  const fetchIngredients = async (recipe) => {
    const { data: ingredientsData, error: ingredientsError } = await client
    .from('ingredients')
    .select('*')
    .eq('recepie_id', recipe);
    if (ingredientsError) {
      console.error('Fehler beim Laden der Zutaten:', ingredientsError);
      return;
    }
    currentIngredients.value = ingredientsData;
  };

  const fetchRecipes = async (filterData = null) => {
    let query = client
      .from('recepies')
      .select('*')
      .eq('user_id', user.value.id);

    if (filterData) {
      if (filterData.searchQuery) {
        query = query.ilike('name', `%${filterData.searchQuery}%`);
      }
      if (filterData.category && filterData.category !== 'Alle') {
        console.log('filterData.category', filterData.category);
        query = query.contains('categories', [filterData.category]);
      }
      if (filterData.allergy && filterData.allergy !== 'Keine') {
        console.log('filterData.allergy', filterData.allergy);
        query = query.contains('allergies', [filterData.allergy]);
      }
      if (filterData.typ && filterData.typ !== 'Beide') {
        query = query.eq('typ', String(filterData.typ));
      }
    }

    const { data, error } = await query.order('id', { ascending: true });

    if (error) {
      console.error('Error loading recipes', error);
    } else {
      recipes.value = data;
    }
  };

  const fetchCalenderAssignments = async () => {
    const { data, error } = await client
      .from('calender')
      .select(`
        date,
        morning: morning_id (priceTotal,proteins),
        lunch: lunch_id (priceTotal,proteins),
        evening: evening_id (priceTotal,proteins),
        snack: snack_id (priceTotal,proteins)
      `);

    if (error) {
      console.error('Error fetching recipe assignments with joins:', error);
    } else {
        console.log('data', data);
        calenderAssignments.value = data;
    }
  };

  const deleteRecipe = async (recipe) => {
      const { data, error } = await client
          .from('recepies')
          .delete()
          .eq('id', recipe.id);
      if (error) {
          console.error('Error deleting recipe', error);
      } else {
          await fetchRecipes();
          if (recipes.value.length > 0) {
              setCurrentRecipe(recipes.value[recipes.value.length - 1]);
          } else {
              currentRecipe.value = null;
          }
      }
  };

  const saveRecipe = async (recipeDetails, ingredientsDetails) => {
    const { data: recipeData, error: recipeError  } = await client
      .from('recepies')
      .insert([
        {
          name: recipeDetails.name,
          description: recipeDetails.description,
          allergies: recipeDetails.allergies,
          categories: recipeDetails.categories,
          typ: recipeDetails.typ,
          image_url: recipeDetails.image_url,
          user_id: recipeDetails.user_id,
          proteins: recipeDetails.proteins,
          carbohydrates: recipeDetails.carbohydrates,
          priceTotal: recipeDetails.priceTotal
        }
      ]).select();
      
      console.log(recipeData[0].id);

      if (recipeError) throw recipeError;
      const ingredientsWithRecipeId = ingredientsDetails.map(ingredient => ({
        name: ingredient.name,
        price: ingredient.price,
        quantity: ingredient.quantity,
        recepie_id: recipeData[0].id
      }));
      
      console.log(ingredientsWithRecipeId);

      const { error: ingredientsError } = await client
        .from('ingredients')
        .insert (ingredientsWithRecipeId);

      if (ingredientsError) throw ingredientsError;

      router.push({ path: "/overview" })
  };

  const updateRecipe = async (recepieId, recipeDetails, ingredientsDetails) => {
    const { data: recipeData, error: recipeError  } = await client
      .from('recepies')
      .update({
        name: recipeDetails.name,
        description: recipeDetails.description,
        allergies: recipeDetails.allergies,
        categories: recipeDetails.categories,
        typ: recipeDetails.typ,
        image_url: recipeDetails.image_url,
        user_id: recipeDetails.user_id,
        proteins: recipeDetails.proteins,
        carbohydrates: recipeDetails.carbohydrates,
        priceTotal: recipeDetails.priceTotal
      })
      .match({ id: recepieId });
      
      if (recipeError) throw recipeError;

      const { error: deleteIngredientsError } = await client
            .from('ingredients')
            .delete()
            .match({ recepie_id: recepieId });
      if (deleteIngredientsError) throw deleteIngredientsError;
      
      const ingredientsWithRecipeId = ingredientsDetails.map(ingredient => ({
        name: ingredient.name,
        price: ingredient.price,
        quantity: ingredient.quantity,
        recepie_id: recepieId
      }));
      const { error: insertIngredientsError } = await client
            .from('ingredients')
            .insert(ingredientsWithRecipeId);
      if (insertIngredientsError) throw insertIngredientsError;
      console.log('Rezept erfolgreich aktualisiert.');
      router.push({ path: "/overview" });
  }

  return {
      calenderAssignments,
      currentRecipe,
      currentIngredients,
      recipes,
      fetchRecipe,
      fetchCalenderAssignments,
      fetchIngredients,
      fetchRecipes,
      deleteRecipe,
      saveRecipe,
      updateRecipe
  };
});
