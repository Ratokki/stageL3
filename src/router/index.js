/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';
/*import Utilisateur from '@/pages/Utilisateur.vue'; 
import GestionProjet from '@/pages/GestionProjet.vue'; 
import GestionTache from '@/pages/GestionTache.vue'; 
import Notification from '@/pages/Notification.vue'; 
import Budget from '@/pages/Budget.vue';*/ 
import Login from '@/pages/Login.vue'; 
import Register from '@/pages/Register.vue'; 
import LandingPage from '@/pages/LandingPage.vue';

import Dashboard from '@/pages/admin/Dashboard.vue';
import GestionProjet from '@/pages/admin/GestionProjet.vue';
import GestionTache from '@/pages/admin/GestionTache.vue';
import Utilisateur from '@/pages/admin/Utilisateur.vue';
import Notification from '@/pages/admin/Notification.vue';
import Budget from '@/pages/admin/Budget.vue';

import DashboardChef from '@/pages/chefprojet/DashboardChef.vue';
import ProjetChef from '@/pages/chefprojet/ProjetChef.vue';
import RapportAvanc from '@/pages/chefprojet/RapportAvanc.vue';
import DiscussionChef from '@/pages/chefprojet/DiscussionChef.vue';

import TacheEmp from '@/pages/employe/TacheEmp.vue';
import RapportEmp from '@/pages/employe/RapportEmp.vue';
import DiscussionEmp from '@/pages/employe/DiscussionEmp.vue';


routes.push({
  path: '/login', 
  name: 'LoginVue', 
  component: Login, 
});

routes.push({
  path: '/register',
  name: 'RegisterVue',
  component: Register, 
});

/*routes.push({
  path: '/utilisateur', 
  name: 'utilisateur', 
  component: Utilisateur, 
});

routes.push({
  path: '/projet',
  name: 'gestionProjet',
  component: GestionProjet,
});

routes.push({
  path: '/tache',
  name: 'gestionTache',
  component: GestionTache,
});

routes.push({
  path: '/notification',
  name: 'notification',
  component: Notification,
});

routes.push({
  path: '/budget',
  name: 'budget',
  component: Budget,
});*/

routes.push({
  path: '/landingPage',
  name: 'landingPage',
  component: LandingPage,
});


//Pour l'administrateur
routes.push({
  path: '/admin/Dashboard',
  name: 'adminDashboard',
  component: Dashboard,
});

routes.push({
  path: '/admin/Projet',
  name: 'adminGestionProjet',
  component: GestionProjet,
});

routes.push({
  path: '/admin/Tache',
  name: 'adminGestionTache',
  component: GestionTache,
});

routes.push({
  path: '/admin/Utilisateur',
  name: 'adminUtilisateur',
  component: Utilisateur,
});

routes.push({
  path: '/admin/Notification',
  name: 'adminNotification',
  component: Notification,
});

routes.push({
  path: '/admin/Budget',
  name: 'adminBudget',
  component: Budget,
});



//Pour le chef de projet
routes.push({
  path: '/chefProjet/Dashboard',
  name: 'dashboardChef',
  component: DashboardChef,
});

routes.push({
  path: '/chefProjet/Projet',
  name: 'projetChef',
  component: ProjetChef,
});

routes.push({
  path: '/chefProjet/RapportAvancement',
  name: 'rapport',
  component: RapportAvanc,
});

routes.push({
  path: '/chefProjet/Discussion',
  name: 'discussion',
  component: DiscussionChef,
});



//Pour l'employé
routes.push({
  path: '/employe/Tache',
  name: 'tacheEmploye',
  component: TacheEmp,
})

routes.push({
  path: '/employe/Discussion',
  name: 'discussionEmploye',
  component: DiscussionEmp,
})

routes.push({
  path: '/employe/Rapport',
  name: 'rapportEmploye',
  component: RapportEmp,
})




// Créer le routeur
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Gestion des erreurs d'importation dynamique
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

// Nettoyer le local storage lorsque le routeur est prêt
router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

// Exporter le routeur
export default router;
