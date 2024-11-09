<template>
<div>
  
    <v-snackbar
      :timeout="timeout"
      color="white"
      v-model="snackbarSuccessAccept"
      top
      transition="fade-blur"
      class="custom-snackbar"
    >
      <strong style="color: green;">{{ textSuccessAccept }}</strong>

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbarSuccessAccept = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Snackbar pour le rejet -->
    <v-snackbar
      v-model="snackbarSuccessReject"
      top
      color="red"
      rounded="pill"
      :timeout="timeout"
      class="custom-snackbar"
    >
      <b>{{ textSuccessReject }}</b>
      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbarSuccessReject = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar> 
    
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
                      
                      
                    </v-row> 
    <v-row>
        <v-col cols="12">
          
            <v-data-table
        v-model:search="search"
        :headers="headers"
  :items="filteredItems"
  item-value="titre"
  items-per-page-text="Articles par page"
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
          
          <v-btn
          class="text-none"
          :width="80"
          :height="35"
          style="font-size: 12px; color: green; "
          elevation="0"
          variant="outlined"           
          @click="openConfirmDialog('accepter', item)"
          >
            Accepter
          </v-btn>

          <v-btn
          class="text-none"
          :width="80"
          :height="35"
          style="font-size: 12px; color: red; "
          elevation="0"
          variant="tonal"           
          @click="openConfirmDialog('rejeter', item)"
          >
            Rejeter
          </v-btn>

          <v-btn
            variant="text"
            icon
            @click="viewDetails(item.id_projet)"
            style="margin-left: 5px"
            dark
          >
            <img src="../../assets/eye.png" height="29px" />
            <v-tooltip
                          activator="parent"
                          location="bottom"
                          class="custom-tooltip"
                        >
                          Voir détails
                        </v-tooltip>
          </v-btn>

          <!-- Confirmation Dialog for Accepter/Rejeter -->
  <v-dialog v-model="confirmDialog" width="400">
    <v-card>
      <v-card-title class="headline" style="margin-top: 5px; margin-right: -5px;">
        <v-icon left>mdi-alert-circle-outline</v-icon> 
        <span style="margin-top: 10px;">Confirmation</span>
      </v-card-title>

      <v-card-text>
        Êtes-vous sûr de vouloir {{ actionType }} ce projet ?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <!-- Cancel Button -->
        <v-btn 
        variant="flat" 
        rounded 
        class="text-none" 
        elevation="5" 
        color="white" 
        @click="confirmDialog = false"
        style="margin-top: -15px; margin-right: 5px;"
        >
          Annuler
        </v-btn>

        <!-- Confirmation Button for Accepter/Rejeter -->
        <v-btn
        :width="100"
          variant="flat"
          rounded
          class="text-none"
          :color="actionType === 'accepter' ? 'green darken-1' : 'red'"
          @click="confirmAction"
          style="margin-top: -15px; margin-right: 8px;"
        >
          {{ actionType === 'accepter' ? 'Accepter' : 'Rejeter' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
      <!-- Champ date_proposition supprimé -->
      <v-text-field
        v-model="editedProject.budget"
        label="Budget"
        required
        type="number"
      ></v-text-field>
      <v-select
        v-model="editedProject.statut"
        :items="['Proposé', 'Refusé', 'Accepté', 'En attente']"
        label="Statut"
      ></v-select>
    
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="dialogEdit = false">Annuler</v-btn>
      <v-btn text @click="updateProject" :loading="load">Sauvegarder</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Boîte de dialogue de confirmation -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer ce projet ?
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialogDelete = false">Annuler</v-btn>
          <v-btn text @click="confirmDelete" :loading="load">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



        </template>
      </v-data-table>
        </v-col>
    </v-row>
 </div>       
    
</template>

<script>
import axios from 'axios';
export default {
    name: 'monProjetPropose',
    data() {
      return {
         
        confirmDialog: false,  // Control dialog visibility
      actionType: '',        // Store action type (accepter or rejeter)
      currentItem: null,
        projects: [],
        dialogAdd: false,
        dialogDelete: false,
      projectToDelete: null,
        load: false,
        textSuccessAccept: 'Projet accepté avec succés',
        textSuccessReject: 'Projet rejété',
      timeout: 3000,
      snackbarSuccessAccept: false,
      snackbarSuccessReject: false,
        dialogDetails: false,
        dialogEdit: false, // Ajouter cette ligne
        tab: 1,
        selectedFilter: "Tous les projets", // Updated to be a string, not an object
      filterOptions: [
        "Tous les projets", 
        "Proposé",             
        "Accepté", 
        "Refusé",
        "En attente",
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
      newItem: {
        titre: "",
        sigle: "",
        description: "",
        lieu: "",
        latitude: null,
        longitude: null,
        budget: null,
        raison_proposition: "",
        date_proposition: "",
      },
      map: null,
      marker: null,
      }
    },
    computed : {
      filteredItems() {
    // Assurez-vous que `projects` est un tableau réactif contenant tous les projets
    if (this.search) {
      // Filtrer les projets en fonction du champ de recherche
      return this.projects.filter(project =>
        project.titre.toLowerCase().includes(this.search.toLowerCase()) ||
        project.sigle.toLowerCase().includes(this.search.toLowerCase())
      );
    }
    return this.projects; // Sinon, renvoyer tous les projets
  }
    },
    mounted() {

  this.fetchProjects()
  
},
methods: {

  openConfirmDialog(actionType, item) {
      this.actionType = actionType;
      this.currentItem = item;
      this.confirmDialog = true;
    },

    // Perform action based on confirmation
    async confirmAction() {
      try {
        if (this.actionType === 'accepter') {
          await this.statusAccept(this.currentItem);
        } else if (this.actionType === 'rejeter') {
          await this.statusRejet(this.currentItem);
        }
        this.confirmDialog = false;  // Close dialog after action
      } catch (error) {
        console.error('Erreur lors de l\'action :', error);
      }
    },

 async statusAccept(item) {
  try {
    const response = await axios.patch(`http://localhost:5000/admin/allProjects/accept/${item.id_projet}`, {
      statut: 'Accepté',
    });

    // Mettre à jour le projet existant dans la liste
    const projectIndex = this.projects.findIndex(project => project.id_projet === item.id_projet);
    if (projectIndex !== -1) {
      this.projects[projectIndex].statut = 'Accepté'; // Changer le statut
      this.projects[projectIndex].date_acceptation = new Date().toLocaleDateString('fr-FR'); // Optionnel
    }

    this.snackbarSuccessAccept = true;
    this.textSuccessAccept = textSuccessAccept;
    
  } catch (error) {
    console.error('Erreur lors de l\'acceptation du projet:', error);
  }
},
async statusRejet(item) {
  try {
    const response = await axios.patch(`http://localhost:5000/admin/allProjects/rejet/${item.id_projet}`, {
      statut: 'Refusé',
    });
    const projectIndex = this.projects.findIndex(project => project.id_projet === item.id_projet);
    if (projectIndex !== -1) {
      this.projects[projectIndex].statut = 'Refusé';
    }
    this.snackbarSuccessReject = false;  // Reset du snackbar
    this.$nextTick(() => {
      this.snackbarSuccessReject = true; // Affiche le snackbar de succès
      this.textSuccessReject = this.textSuccessReject;
      
    });
  } catch (error) {
    console.error('Erreur lors du rejet du projet:', error);
  }
}
,

 async fetchProjects() {
    try {
        const response = await axios.get(`http://localhost:5000/admin/allProjects`);

        this.projects = response.data
            .map(project => {
                const dateObj = new Date(project.date_proposition);
                const dateFormatted = dateObj.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                const timeFormatted = dateObj.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return {
                    ...project,
                    date_proposition: `${dateFormatted} à ${timeFormatted}`,
                    date_proposition_obj: dateObj // Ajoute l'objet Date pour le tri
                };
            })
            .sort((a, b) => b.date_proposition_obj - a.date_proposition_obj); // Trie par date décroissante

        console.log("Projets triés par date de proposition (récent d'abord):", this.projects);
    } catch (err) {
        console.log(err);
    }
},

async viewDetails(itemId) {
  try {
    const response = await axios.get(`http://localhost:5000/admin/allProjects/?id_projet=${itemId}`);
    this.selectedProject = response.data.map(project => ({
      ...project,
      date_proposition: new Date(project.date_proposition).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    })); // Formatage de la date ici
    console.log(this.selectedProject); // Vérifiez la structure des données
    this.dialogDetails = true; // Ouvrir le modal
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du projet:', error);
    this.selectedProject = []; // Réinitialiser en cas d'erreur
    this.dialogDetails = true; // Ouvrir le modal pour montrer l'erreur
  }
},



    
    getStatusColor1(statut) {
      switch (statut) {
        case "Proposé":
          return "blue";
        case "Refusé":
          return "red";
        case "Accepté":
          return "green";
        case "En attente":
          return "orange";
        default:
          return "grey";
      }
    },

},
}
</script>

<style>
  .fade-blur {
  transition: opacity 0.5s ease, filter 0.5s ease;
  opacity: 0;
  filter: blur(10px);
}

.fade-blur-enter-active,
.fade-blur-leave-active {
  opacity: 1;
  filter: blur(0);
}

.fade-blur-enter,
.fade-blur-leave-to {
  opacity: 0;
  filter: blur(10px);
}

.custom-snackbar {
  width: auto; /* Ajuste la largeur à la taille du texte */
  min-width: 150px; /* Largeur minimale si le texte est très court */
  max-width: 400px; /* Largeur maximale pour éviter qu'il ne soit trop large */
  text-align: center; /* Centre le texte */
  margin: 0 auto; /* Centre le snackbar horizontalement */
}

</style>