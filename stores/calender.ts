export const useCalenderStore = defineStore('calederStore', () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const calenderAssignments = ref([]);
  const errorMessages = ref([]);

  const fetchCalenderAssignments = async () => {
    const { data, error } = await client
      .from('calender')
      .select(`
        date,
        morning:morning_id (name),
        lunch:lunch_id (name),
        evening:evening_id (name),
        snack:snack_id (name)
      `);

    if (error) {
      errorMessages.value = error.message;
      console.error('Error fetching recipe assignments with joins:', error);
    } else {
        console.log('data', data);
        calenderAssignments.value = data;
        console.log('calenderAssignments', calenderAssignments.value);
    }
  };

  const saveRecipeAssignment = async (date, recipe) => {
    const { data, error } = await client
      .from('calender')
      .insert({
        'date': date,
        'morning_id': recipe['morgen']['id'],
        'lunch_id': recipe['lunch']['id'],
        'evening_id': recipe['evening']['id'],
        'snack_id': recipe['snack']['id'],
      });

    if (error) {
      errorMessages.value.push(error.message);
      console.error('Error saving recipe assignment:', error);
    } else {
      console.log('Recipe assignment saved:', data);
    }
  };

  return {
    calenderAssignments,
    fetchCalenderAssignments,
    errorMessages,
    saveRecipeAssignment
  };  
});