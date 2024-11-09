// src/i18n.js
import { createI18n } from 'vue-i18n';

const messages = {
  fr: {
    $vuetify: {
      noDataText: 'Aucune donnée disponible',
      dataIterator: {
        noResultsText: 'Aucun résultat trouvé',
        loadingText: 'Chargement des éléments...',
      },
      dataTable: {
        itemsPerPageText: 'Éléments par page',
        ariaLabel: {
          sortDescending: ': Trié par ordre décroissant. Activer pour supprimer le tri.',
          sortAscending: ': Trié par ordre croissant. Activer pour trier par ordre décroissant.',
          sortNone: ': Non trié. Activer pour trier par ordre croissant.',
        },
        pageText: '{0}-{1} de {2}',
        nextPage: 'Page suivante',
        prevPage: 'Page précédente',
      },
      dataFooter: {
        itemsPerPageText: 'Éléments par page :',
        pageText: '{0}-{1} de {2}',
      },
      datePicker: {
        header: 'choisissez un date',  // En-tête du sélecteur de date
        title: 'Calendrier',              // Titre du sélecteur de date
        cancel: 'Annuler',                // Bouton pour annuler la sélection
        confirm: 'Confirmer',             // Bouton pour confirmer la sélection
        // Ajoutez ici d’autres traductions pour le datePicker si nécessaire
      },
    },
  },
};

const i18n = createI18n({
  locale: 'fr', // Définit le français comme langue par défaut
  fallbackLocale: 'fr',
  legacy: false, // Utiliser le mode composition de vue-i18n (requis par Vuetify)
  messages,
});

export default i18n;
