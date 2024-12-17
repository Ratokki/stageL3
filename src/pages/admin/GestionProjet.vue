<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <AdminNav />
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <v-snackbar v-model="snackbarSuccess" top color="success" :timeout="timeout">
      <b>{{ textSuccess }}</b>
      <template></template>
    </v-snackbar>
    
        <v-col cols="12">
          <v-card
            height="58"
            elevation="0"
            style="background-color: white; border-radius: 10px"
          >
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-col cols="8">
                  <p class="monTitle">Gestion de projet</p>
                </v-col>
                <v-col cols="4" class="text-right">
      <div style="display: flex; align-items: center; justify-content: flex-end;">
        <v-btn elevation="0" rounded style="margin-right:25px;" @click.stop="menu1 = !menu1">
  
  <v-badge
    v-if="projetsEnAttente > 0"
    :content="projetsEnAttente"
    color="red"
    class="ml-2"
  >
  <v-icon size="25">mdi-bell-outline</v-icon></v-badge>
</v-btn>

    <!-- Liste déroulante -->
    <v-menu
      v-model="menu1"
      activator="parent"
      offset-y
      close-on-content-click
    >
      <v-card max-width="300px">
        <v-list>
          <v-list-item
  v-for="(projet, index) in projetsDetails"
  :key="index"
  :title="`${projet.titre}`"
  :subtitle="'Nouvel projet proposé'"
>
</v-list-item>

<v-list-item v-if="projetsDetails.length === 0">
    <v-list-item-title>Aucun projet en attente</v-list-item-title>
  </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
        <AdminAvatar />
      </div>
    </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-container>

      <v-container fluid class="px-6 mt-n2" style="margin-top: -8px" >
        <v-col cols="12" style="margin-top: -8px">
          <v-card
          height="540px"
            elevation="0"
            style="background-color: white; border-radius: 10px; margin-top: -25px;"
          >
            <v-container style="margin-top: -6px">
              <div style="margin-top: 10px;">
                <v-tabs v-model="tab" color="deep-purple-accent-4" lazy>
                  <v-tab :value="1" class="text-none"
                    >Listes des projet</v-tab
                  >
                  <v-tab :value="2" class="text-none">
  Voir proposition
  <v-badge
    v-if="projetsEnAttente > 0"
    :content="projetsEnAttente"
    color="red"
    class="ml-2"
    floating
  ></v-badge>
</v-tab>
                  <v-tab :value="3" class="text-none" style="margin-left: 10px;">
  Assignation
  <v-badge
    v-if="recentAcceptedProjectsCount > 0"
    :content="recentAcceptedProjectsCount"
    color="red"
    class="ml-2"
    floating
  ></v-badge>
</v-tab>

                  
                </v-tabs>

                <v-tabs-items v-model="tab">
                  <v-tab-item value="1" v-show="tab === 1">
                    <ProjetAvanc/>                  
                  </v-tab-item>

                  <!-- Tab 2 -->

                  <v-tab-item value="2" v-show="tab === 2">
                    <ProjetPropose />
                  </v-tab-item>

                  <v-tab-item value="3" v-show="tab === 3">
                    <!-- tab 3 -->

                    <!-- en tete -->

                    <!-- liste de projet à assigner -->
                    
                      <AssignerProjet/>
                    

                    <!-- Modal pour Assignation -->
                    
                  </v-tab-item>

                

               </v-tabs-items>
              </div>
            </v-container>
          </v-card>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import AdminNav from "../../components/admin/AdminNav.vue";
import AdminAvatar from "../../components/admin/AdminAvatar.vue";
import ProjetPropose from "../../components/admin/ProjetPropose.vue";
import AssignerProjet from "../../components/admin/AssignerProjet.vue";
import ProjetAvanc from "../../components/admin/ProjetAvanc.vue"

export default {
    components: {
        AdminNav,
        AdminAvatar,
        ProjetPropose, 
        AssignerProjet,
        ProjetAvanc,
    },
    data() {
      return {
        projetsEnAttente: 0,
        menu1: false,
        projetsDetails: [],
        textSuccess: 'Modification avec succéss',
      timeout: 3000,
      snackbarSuccess: false,
       // dialogDetails: false,
        // dialogEdit: false, // Ajouter cette ligne
        tab: 1,
        selectedFilter: "Tous les projets", // Updated to be a string, not an object
      filterOptions: [
        "Tous les projets",
        "Projet en cours",
        "Projet à faire",
        "Projet terminé",
      ],
      search: "",
      
      }
    },
    created() {
  this.fetchProjetsEnAttente(); // Charge les données dès que le composant est monté
},
mounted() {
  this.interval = setInterval(() => {
    this.fetchProjetsEnAttente();
  }, 30000); // Actualise toutes les 30 secondes
},
beforeDestroy() {
  clearInterval(this.interval);
},
     methods: {
      async fetchProjetsEnAttente() {
  try {
    const response = await fetch("http://localhost:5000/admin/projetsEnAttente");
    const data = await response.json();
    this.projetsEnAttente = data.count; // Nombre total de projets en attente
    this.projetsDetails = data.projets; // Détails des projets en attente
  } catch (error) {
    console.error("Erreur lors de la récupération des projets en attente :", error);
  }
},

    getImageUrl(profile) {
    if (profile.startsWith('uploads')) {
      return `http://localhost:5000/${profile}`;
    } else if (profile.startsWith('/src/assets')) {
      // Remplacer les chemins src/assets par des chemins statiques
      return `/images/${profile.split('/').pop()}`;
    }
    return profile;
  },
  
},
    
}
</script>
