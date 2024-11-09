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
                <v-col cols="10">
                  <p class="monTitle">Gestion de projet</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <AdminAvatar/>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-container>

      <v-container fluid class="px-6 mt-n2" style="margin-top: -8px">
        <v-col cols="12" style="margin-top: -8px">
          <v-card
            elevation="0"
            style="
              background-color: white;
              border-radius: 10px;
              margin-top: -25px;
            "
          >
            <v-container style="margin-top: -6px">
              <div>
                <v-tabs v-model="tab" color="deep-purple-accent-4" lazy>
                  <v-tab :value="1" class="text-none"
                    >Listes des projet</v-tab
                  >
                  <v-tab :value="2" class="text-none"
                    >Voir proposition</v-tab
                  >
                  <v-tab :value="3" class="text-none">Assignation</v-tab>
                  
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
    
}
</script>