export const useRecipeStore = defineStore('recipeStore', () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const currentRecipe = ref(null);
  const recipes = ref([]);
  const filteredRecipes = ref([]);
  const calenderAssignments = ref([]);

  const setCurrentRecipe = async (recipe) => {
      const { data, error } = await client
          .from('recepies')
          .select('*')
          .eq('id', recipe.id)
          .single();
      if (error) {
          console.error('Error loading recipe', error);
      } else {
          currentRecipe.value = data;
      }
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

  const updateRecipe = async () => {
      const { data, error } = await client
          .from('recepies')
          .update({
              name: currentRecipe.value.name,
              ingredients: currentRecipe.value.ingredients,
              instructions: currentRecipe.value.instructions
          })
          .eq('id', currentRecipe.value.id);
      if (error) {
          console.error('Error updating recipe', error);
      } else {
          await fetchRecipes();
      }
  };

  const newRecipe = async () => {
      const { data, error } = await client
          .from('recepies')
          .insert({
              name: 'New Recipe',
              ingredients: '',
              instructions: '',
              user_id: user.value.id
          });
      if (error) {
          console.error('Error creating recipe', error);
      } else {
          await fetchRecipes();
          setCurrentRecipe(recipes.value[recipes.value.length - 1]);
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

  return {
      calenderAssignments,
      currentRecipe,
      recipes,
      setCurrentRecipe,
      fetchCalenderAssignments,
      fetchRecipes,
      updateRecipe,
      newRecipe,
      deleteRecipe
  };
});
