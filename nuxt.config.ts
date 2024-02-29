// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";
export default defineNuxtConfig({
  alias: {
    '@': resolve(__dirname, '/')
  },
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  supabase: {
    redirect: false
  },
  modules: ['nuxt-icon','@nuxtjs/supabase','@samk-dev/nuxt-vcalendar'],
})
