export function useAuth() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const errorMessage = ref('');

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = '';
      router.push('/overview');
    }
  };
  
  return {
    signIn,
    errorMessage
  };
}
