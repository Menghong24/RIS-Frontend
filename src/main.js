import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index' // Import the router file
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
const app = createApp(App)
app.use(Toast,{
    position: 'top-center'
})
app.use(router) // Tell Vue to use it
app.mount('#app')
