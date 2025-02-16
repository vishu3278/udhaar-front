import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
// import vClickOutside from "click-outside-vue3"
// import '../node_modules/spectre.css/dist/spectre.min.css'
// import '../node_modules/spectre.css/dist/spectre-icons.css'
import 'remixicon/fonts/remixicon.css'
// import './assets/main.css'
import "./assets/base.css"

import './firebase.js'

// import './constants.js'

const app = createApp(App)

app.use(router)
app.use(store)
// app.use(vClickOutside)

app.mount('#app')
