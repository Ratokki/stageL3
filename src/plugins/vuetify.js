// plugins/vuetify.js
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import i18n from '../i18n';

export default createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n }),
    defaultLocale: 'fr',
  },
  theme: {
    themes: {
      light: {
        fontFamily: 'ABeeZee, sans-serif',
      },
    },
  },
});
