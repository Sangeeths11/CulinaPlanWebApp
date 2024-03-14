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
  chatgpt: {
    apiKey: process.env.CHATGPT_API_KEY,
  },
  supabase: {
    redirect: false
  },
  modules: ['nuxt-icon','@nuxtjs/supabase','@samk-dev/nuxt-vcalendar',"nuxt-chatgpt","@pinia/nuxt",'@nuxt/test-utils/module'],
})
