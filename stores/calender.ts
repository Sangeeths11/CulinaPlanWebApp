export const useCalenderStore = defineStore('calederStore', () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const calenderAssignments = ref([]);

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

  return {
    calenderAssignments,
    fetchCalenderAssignments,
  };  
});