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
                  <v-avatar class="monAvatar" size="40">
                    <img
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                      alt="John"
                    />
                  </v-avatar>
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
                  <v-tab :value="1" class="text-capitalize"
                    >Listes des projet</v-tab
                  >
                  <v-tab :value="2" class="text-capitalize"
                    >Proposer un projet</v-tab
                  >
                  <v-tab :value="3" class="text-capitalize">Assignation</v-tab>
                  <v-tab :value="4" class="text-capitalize">Visualiser proposition</v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">
                  <v-tab-item value="1" v-show="tab === 1">
                    <v-row align="center" style="margin-top: 10px">
                      <v-sheet
                        class="d-flex justify-space-between align-center pa-4"
                      >
                        <v-select
                          v-model="selectedFilter"
                          :items="filterOptions"
                          persistent-hint
                          single-line
                          variant="plain"
                          class="custom-select"
                          style="
                            max-width: 200px;
                            margin-top: -5px;
                            margin-left: 10px;
                          "
                        ></v-select>
                      </v-sheet>

                      <v-spacer></v-spacer>
                      <div>
                        <v-text-field
                          color="success"
                          v-model="search"
                          class="mx-auto"
                          density="comfortable"
                          placeholder="Recherche"
                          prepend-inner-icon="mdi-magnify"
                          style="max-width: 500px; margin-left: -15px"
                          variant="outlined"
                          rounded
                          height="50px"
                          width="300px"
                        ></v-text-field>
                      </div>
                      <div style="margin-left: 18px">
                        <v-autocomplete
                          color="success"
                          class="mx-auto"
                          density="comfortable"
                          rounded
                          chips
                          clearable
                          label="Trier par"
                          :items="['Date', 'Statut', 'Nom']"
                          variant="underlined"
                          width="195px"
                          style="margin-left: -40px; max-width: 250px"
                        ></v-autocomplete>
                      </div>
                      <v-spacer></v-spacer>

                      <!-- Modal pour Ajouter -->
                      <v-dialog v-model="dialog" max-width="500px">
                        <v-card>
                          <v-card-title>
                            <span class="headline">Ajouter un projet</span>
                          </v-card-title>
                          <v-card-text>
                            C'est le text
                          </v-card-text>
                          <v-card-actions>
                            <v-btn text @click="closeModal">Annuler</v-btn>
                            <v-btn text @click="addItem">Ajouter</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-row>

                    <!-- Liste de projet -->
                    <v-row>
                      <v-col cols="12">
                        <v-data-table
        v-model:search="search"
        :headers="headers"
        :items="projects"
        item-value="titre"
        style="border-radius: 15px; margin-top: -20px"
      >
        <template v-slot:item.sigle="{ item }">
          <span class="white--text" style="font-size: 15px">
            {{ item.sigle }}
          </span>
        </template>

        <template v-slot:item.statut="{ item }">
          <v-chip
            :color="getStatusColor1(item.statut)"
            small
            dark
            class="justify-center"
          >
            {{ item.statut }}
          </v-chip>
        </template>

        <template v-slot:item.date_proposition="{ item }">
  <span>{{ item.date_proposition }}</span>
</template>


        <template v-slot:item.actions="{ item }">
          
          <v-btn variant="text" icon @click="editProject(item)">
            <img src="../../assets/pencil.png" height="29px" />
          </v-btn>
          <v-btn variant="text" icon @click="deleteProject(item)">
            <img src="../../assets/delete.png" height="29px" />
          </v-btn>
          <v-btn
            variant="text"
            icon
            @click="viewDetails(item.id_projet)"
            style="margin-left: 5px"
            dark
          >
            <img src="../../assets/eye.png" height="29px" />
          </v-btn>

          <!-- Modal pour Détails -->
          <v-dialog v-model="dialogDetails" max-width="500px">
  <v-card>
    <v-card-title>Détails de projet</v-card-title>
    <v-card-text>
      <div v-if="selectedProject && selectedProject.length > 0">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Nom : {{ selectedProject[0].titre }}</v-list-item-title>
              <v-list-item-subtitle>Date de proposition : {{ selectedProject[0].date_proposition }}</v-list-item-subtitle>
              <v-list-item-subtitle>Statut : {{ selectedProject[0].statut }}</v-list-item-subtitle>
              <v-list-item-subtitle>Budget : {{ selectedProject[0].budget }} €</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <div v-else>
        <v-alert type="error">Aucun détail disponible pour ce projet.</v-alert>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="dialogDetails = false">Fermer</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Modal pour Éditer le Projet -->
<v-dialog v-model="dialogEdit" max-width="500px">
  <v-card>
    <v-card-title>Éditer le Projet</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="editedProject.titre"
        label="Titre"
        required
      ></v-text-field>
      <v-text-field
        v-model="editedProject.sigle"
        label="Sigle"
        required
      ></v-text-field>
      <v-text-field
        v-model="editedProject.date_proposition"
        label="Date de proposition"
        required
      ></v-text-field>
      <v-text-field
        v-model="editedProject.budget"
        label="Budget"
        required
        type="number"
      ></v-text-field>
      <v-select
        v-model="editedProject.statut"
        :items="['Proposé', 'Rejeté', 'Accepté', 'en attente']"
        label="Statut"
      ></v-select>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="dialogEdit = false">Annuler</v-btn>
      <v-btn text @click="updateProject">Sauvegarder</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>



        </template>
      </v-data-table>
                      </v-col>
                    </v-row>
                  </v-tab-item>

                  <!-- Tab 2 -->

                  <v-tab-item value="2" v-show="tab === 2">
                    <v-row align="center" style="margin-top: 10px">
                      <v-sheet
                        class="d-flex justify-space-between align-center pa-4"
                      >
                        <v-select
                          v-model="selectedFilter"
                          :items="filterOptions"
                          persistent-hint
                          single-line
                          variant="plain"
                          class="custom-select"
                          style="max-width: 200px; margin-top: -5px"
                        ></v-select>
                      </v-sheet>

                      <v-spacer></v-spacer>
                      <div>
                        <v-text-field
                          color="success"
                          v-model="search"
                          class="mx-auto"
                          density="comfortable"
                          placeholder="Recherche"
                          prepend-inner-icon="mdi-magnify"
                          style="max-width: 500px; margin-left: -15px"
                          variant="outlined"
                          rounded
                          height="50px"
                          width="300px"
                        ></v-text-field>
                      </div>
                      <div style="margin-left: 18px">
                        <v-autocomplete
                          color="success"
                          class="mx-auto"
                          density="comfortable"
                          rounded
                          chips
                          clearable
                          label="Trier par"
                          :items="['Date', 'Statut', 'Nom']"
                          variant="underlined"
                          width="195px"
                          style="margin-left: -40px; max-width: 250px"
                        ></v-autocomplete>
                      </div>
                      <v-spacer></v-spacer>

                      <v-btn
                        elevation="0"
                        class="text-capitalize"
                        rounded
  
                        style="
                          color: white;
                          margin-top: -15px;
                          margin-right: 15px;
                          background: linear-gradient(
                            90deg,
                            #9bf560d3,
                            #58d67ed7
                          );
                        "
                        >Ajouter</v-btn
                      >
                      
                    </v-row>

                    <!-- Liste de projet proposé -->
                    <v-row>
                      <v-col cols="12">
                        <span>C'est encore un deuxieme test</span>
                      </v-col>
                    </v-row>
                  </v-tab-item>

                  <v-tab-item value="3" v-show="tab === 3">
                    <!-- tab 3 -->

                    <!-- en tete -->

                    <!-- liste de projet à assigner -->
                    <v-row style="margin-top: 20px">
                      <v-col cols="12">
                        <span style="margin-left: 15px; font-size: 20px"
                          >Projets acceptés récents de cette semaine</span
                        >
                        <v-row style="margin-top: 8px">
                          
                            <p>Encore encore test</p>
                          
                        </v-row>
                      </v-col>

                      <v-col cols="12" style="margin-top: 20px">
                        <span style="margin-left: 15px; font-size: 20px"
                          >Tous les projets acceptés</span
                        >
                        <v-row style="margin-top: 8px">
                          <span>Test1</span>
                        </v-row>
                      </v-col>
                    </v-row>

                    <!-- Modal pour Assignation -->
                    
                  </v-tab-item>

                  <!-- tab 4 -->
                 
                  <v-tab-item value="4" v-show="tab === 4">
  <v-row align="center" style="margin-top: 10px">
    <v-col cols="12" md="4">
      <v-card>
        <span>Test encore</span>
      </v-card>
    </v-col>
  </v-row>
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
import axios from 'axios';
import AdminNav from "../../components/admin/AdminNav.vue";

export default {
    components: {
        AdminNav,
    },
    data() {
      return {
        textSuccess: 'Modification avec succéss',
      timeout: 3000,
      snackbarSuccess: false,
        dialogDetails: false,
        dialogEdit: false, // Ajouter cette ligne
        tab: 1,
        selectedFilter: "Tous les projets", // Updated to be a string, not an object
      filterOptions: [
        "Tous les projets",
        "Projet en cours",
        "Projet à faire",
        "Projet terminé",
      ],
      search: "",
      projects: [],
      selectedProject: null,
      editedProject: {
      id_projet: null,
      titre: '',
      sigle: '',
      date_proposition: '',
      budget: 0,
      statut: ''
    },
      headers: [
        { title: "Titre", key: "titre", align: "start" },
        { title: "Sigle", key: "sigle", align: "start" },
        { title: "Statut", key: "statut", align: "start" },
        { title: "Date de proposition", key: "date_proposition", align: "center" },
        { title: "Budget", key: "budget", align: "center" },
        { title: "Action", key: "actions", align: "center" },
      ],
      }
    },
    mounted() {
  this.fetchProjects();
},
methods: {

 async fetchProjects() {
    try {
      const response = await axios.get(`http://localhost:5000/admin/allProjects`);

      this.projects = response.data.map(project => ({
        ...project,
        date_proposition: new Date(project.date_proposition).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      }));

      console.log("VOICI", this.projects);
    } catch (err) {
      console.log(err);
    }
  },

async viewDetails(itemId) {
  try {
    const response = await axios.get(`http://localhost:5000/admin/allProjects/?id_projet=${itemId}`);
    this.selectedProject = response.data; // Assurez-vous que cela renvoie un tableau
    console.log(this.selectedProject); // Vérifiez la structure des données
    this.dialogDetails = true; // Ouvrir le modal
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du projet:', error);
    this.selectedProject = []; // Réinitialiser en cas d'erreur
    this.dialogDetails = true; // Ouvrir le modal pour montrer l'erreur
  }
},

editProject(item) {
  this.editedProject = { ...item }; // Cloner l'objet pour l'éditer
  this.dialogEdit = true; // Ouvrir le modal
},

async updateProject() {
  try {
    const response = await axios.put(`http://localhost:5000/admin/allProjects/${this.editedProject.id_projet}`, this.editedProject);
    this.dialogEdit = false; // Fermer le modal
    this.snackbarSuccess = true;
    this.fetchProjects(); // Rafraîchir la liste des projets
    console.log(response.data.message); // Afficher le message de succès
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
  }
},


   deleteProject(item) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    axios.delete(`http://localhost:5000/admin/allProjects/${item.id_projet}`)
      .then(response => {
        console.log(response.data.message); // Afficher le message de succès
        this.fetchProjects(); // Rafraîchir la liste des projets
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du projet:', error);
      });
  }
},

    getStatusColor1(statut) {
      switch (statut) {
        case "Proposé":
          return "blue";
        case "Rejeté":
          return "red";
        case "Accepté":
          return "green";
        case "en attente":
          return "orange";
        default:
          return "grey";
      }
    },

},
}
</script>