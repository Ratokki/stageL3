// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { registerPlugins } from '@/plugins';
import i18n from './i18n';  // Importation de i18n
import vuetify from './plugins/vuetify';  // Importation de Vuetify

const app = createApp(App);

registerPlugins(app);

app.use(i18n);
app.use(vuetify);

app.mount('#app');
