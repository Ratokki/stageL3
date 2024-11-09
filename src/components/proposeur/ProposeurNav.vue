<template>
  <v-navigation-drawer v-model="drawer" class="ma-4 pa-2"  elevation="2" style="border-radius: 20px;">
    <v-sheet class="pa-4 rounded-te-xl text-center">
      <center>
        <v-img src="../../assets/Fiantso.png" width="120" height="60"></v-img>
      </center>
    </v-sheet>
    <v-sheet>
      <span style="color: '#757474'; margin: 20px; margin-top: -20px;">MENU</span>
    </v-sheet>
    <v-list shaped>
      <v-list-item
        v-for="(item, i) in links"
        :key="i"
        :value="item"
        active-class="selected-list-item"
        :ripple="false"
        rounded="xl"
        @click="navigateTo(item, i)"
        :class="{ 'selected-list-item': selectedItem === i, 'unselected-list-item': selectedItem !== i }"
      >
        <template v-slot:prepend>
          <v-icon :color="'#7e7e7e'">{{ item.icon }}</v-icon>
          <v-list-item-title v-text="item.text" style="margin-left: 12px;"></v-list-item-title>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // Importer useRouter

const links = [
  { text: "Tableau de bord", icon: "mdi-view-dashboard-outline", route: '/proposeur/Dashboard' }, // Route pour Tableau de bord
  { text: "Proposition", icon: "mdi-briefcase-outline", route: '/proposeur/Projet' }, // Route pour Utilisateur
  { text: "Notification", icon: "mdi-bell", route: '/proposeur/Notification' }, // Route pour Gestion du projet
];

const drawer = ref(null);
const selectedItem = ref(null); // Suivre l'élément sélectionné
const router = useRouter(); // Utiliser le routeur

// Fonction pour naviguer vers une route et mettre à jour l'élément sélectionné
const navigateTo = (item, index) => {
  selectedItem.value = index; // Mettre à jour l'élément sélectionné
  router.push(item.route); // Naviguer vers la route correspondante
};
</script>
<script>
export default {
    name: "ProposeurNav",
}
</script>

<style scoped>
.unselected-list-item {
  border-radius: 0px 35px 35px 0px; /* Bordure arrondie à droite */
  background-color: transparent; /* Fond par défaut transparent */
  transition: background-color 0.3s ease; /* Animation douce pour la transition */
}

.unselected-list-item:hover {
  background-color: #eaf7ef; /* Couleur de fond au survol */
}

.selected-list-item {
  border-radius: 0px 35px 35px 0px; /* Arrondi pour l'élément sélectionné */
  color: white; /* Couleur du texte lors de la sélection */
  background: linear-gradient(90deg, #9bf560d3, #58d67ed7); /* Dégradé lors de la sélection */
}
</style>
