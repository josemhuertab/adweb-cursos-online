import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({
  icons: { defaultSet: 'mdi' },
  theme: {
    defaultTheme: 'adwebTheme',
    themes: {
      adwebTheme: {
        dark: false,
        colors: {
          primary: '#764ba2',
          secondary: '#667eea',
          surface: '#ffffff'
        }
      }
    }
  }
})

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
