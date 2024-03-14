export const useRecipeStore = defineStore('recipeStore', () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const currentRecipe = ref(null);
  const recipes = ref([]);

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

  const fetchRecipes = async () => {
      const { data, error } = await client
          .from('recepies')
          .select('*')
          .eq('user_id', user.value.id)
          .order('id', { ascending: true });
      if (error) {
          console.error('Error loading recipes', error);
      } else {
          recipes.value = data;
          if (recipes.value.length > 0 && currentRecipe.value === null) {
              setCurrentRecipe(recipes.value[recipes.value.length - 1]);
          }
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
      currentRecipe,
      recipes,
      setCurrentRecipe,
      fetchRecipes,
      updateRecipe,
      newRecipe,
      deleteRecipe
  };
});
