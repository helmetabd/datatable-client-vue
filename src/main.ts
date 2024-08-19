import { createApp } from 'vue'

import App from './App.vue'
import datatable from './datatable'
import 'bootstrap/dist/js/bootstrap.bundle'
// import './assets/scss/config/default/app.scss'

const app = createApp(App)
app.use(datatable, { asset_url: 'https://arjuna-backend-v3.test' })
app.mount('#app')
