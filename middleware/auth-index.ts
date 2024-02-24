export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()
    console.log('user', user)
    console.log('to', to)
    console.log('from', from)
    if (!user.value && to.path !== '/' && to.path !== '/login' && to.path !== '/register') {
      return navigateTo('/login')
    }
})
  