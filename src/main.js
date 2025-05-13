import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';


import './style.css';

const app = createApp(App);
app.use(router); 
app.use(VueTelInput);
app.mount('#app');
