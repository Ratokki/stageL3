<template>
<div>
  
    <v-snackbar
      :timeout="2000"
      color="success"
      rounded="pill"
      v-model="snackbarSuccessEdit"
      top
      transition="fade-blur"
    >

       <strong>{{ textSuccessEdit }}</strong>
    </v-snackbar>

    <v-snackbar v-model="snackbarSuccessDel" top color="success" rounded="pill" :timeout="timeout">
      <b>{{ textSuccessDel }}</b>
      <template></template>
    </v-snackbar>

    <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="3000"
    top
  >
    {{ snackbar.message }}
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
                      
                      <v-spacer></v-spacer>

                      <v-btn
          elevation="0"
          class="text-capitalize"
          rounded
          @click="openModal"
          style="color: white; margin-right: 15px; background: linear-gradient(90deg, #9bf560d3, #58d67ed7);"
        >
          Proposer
        </v-btn>
<!-- Modal pour Ajouter -->
      <v-dialog v-model="dialogAdd" max-width="550px">
        <v-card>
          <v-card-title class="mx-4 mt-4" style="font-size: 22px;">
          <span style="margin-top: 10px;">Proposer un nouveau projet</span>
        </v-card-title>
          <v-card-text>
            <v-form ref="form" style="margin-top: 5px;">
              <v-row no-gutters>
                <v-col cols="12" sm="8">
                  <v-text-field class="mx-2" label="Titre" v-model="newItem.titre" density="comfortable" rounded variant="outlined" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field class="mx-2" label="Sigle" v-model="newItem.sigle" density="comfortable" rounded variant="outlined" required></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="8">
                  <v-select class="mx-2" label="choisissez un lieu" :items="['Antananarivo', 'Antsiranana', 'Fianarantsoa', 'Mahajanga' ,'Toamasina','Toliary']" v-model="newItem.lieu" density="comfortable" rounded variant="outlined" required></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field class="mx-2" label="Budget" v-model="newItem.budget" density="comfortable" rounded variant="outlined" required type="number"></v-text-field>
                </v-col>
              </v-row>
                  <v-textarea class="mx-2" label="Description" row-height="20" rows="3" auto-grow v-model="newItem.description" density="comfortable" rounded variant="outlined" required></v-textarea>
              <v-textarea class="mx-2" label="Raison de proposition" row-height="20" rows="3" auto-grow v-model="newItem.raison_proposition" density="comfortable" rounded variant="outlined" required></v-textarea>                           
            </v-form>
          </v-card-text>
          <v-card-actions>
            
            <v-btn variant="flat" rounded class="text-none" elevation="5" color="white" @click="closeModal" style="margin-top: -40px; margin-right: -20px;">
            Fermer
          </v-btn>
          <v-btn :width="90" variant="flat" rounded class="text-none mx-6" color="green" @click="addItem" style="margin-top: -40px; margin-right: 8px;">
            Ajouter
          </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal edit -->
          <v-dialog v-model="dialogDetails" max-width="500px"> 
  <v-card>
    <v-card-title class="mx-4 mt-4" style="font-size: 22px;">
          <span style="margin-top: 5px;">Details de projet</span>
        </v-card-title>
    <v-card-text>
      <div v-if="selectedProject && selectedProject.length > 0" style="margin-top: -10px;">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>
      <strong>Nom :</strong> {{ selectedProject[0].titre }} 
      
    </v-list-item-subtitle>
              <v-list-item-subtitle><strong>Sigle :</strong> {{ selectedProject[0].sigle }}</v-list-item-subtitle>
              <v-list-item-subtitle><strong>Description :</strong> {{ selectedProject[0].description }}</v-list-item-subtitle>
              <v-list-item-subtitle><strong>Lieu :</strong> {{ selectedProject[0].lieu }}</v-list-item-subtitle>
              <v-list-item-subtitle><strong>Budget :</strong> {{ selectedProject[0].budget }} €</v-list-item-subtitle>
              <v-list-item-subtitle><strong>Raison de proposition :</strong> {{ selectedProject[0].raison_proposition }}</v-list-item-subtitle>
              <v-list-item-subtitle><strong>Type de projet :</strong> {{ selectedProject[0].type_projet }}</v-list-item-subtitle>
              <v-list-item-subtitle><strong>Date de proposition :</strong> {{ formatDate(selectedProject[0].date_proposition) }}</v-list-item-subtitle>
              <v-list-item-subtitle><strong>Statut :</strong> {{ selectedProject[0].statut }}</v-list-item-subtitle>
              <v-list-item-subtitle>
                <strong>Date d'acceptation :</strong> 
                {{ selectedProject[0].date_acceptation ? formatDate(selectedProject[0].date_acceptation) : "Ce projet n'est pas encore accepté." }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <strong>Date de refus :</strong> 
                {{ selectedProject[0].date_refus ? formatDate(selectedProject[0].date_refus) : "Ce projet n'est pas encore rejeté." }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <div v-else>
        <v-alert type="error">Aucun détail disponible pour ce projet.</v-alert>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn variant="flat" rounded class="text-none" elevation="5" color="white" @click="dialogDetails = false" style="margin-top: -15px; margin-right: 5px;">
            Fermer
          </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Modal d'édition -->
    <v-dialog v-model="dialogEdit" max-width="550px">
      <v-card>
        <v-card-title class="mx-4 mt-4" style="font-size: 22px;">
          <span style="margin-top: 10px;">Modifier le projet</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" style="margin-top: 5px;">
              <v-row no-gutters>
                <v-col cols="12" sm="8">
                  <v-text-field class="mx-2" label="Titre" v-model="editedProject.titre" density="comfortable" rounded variant="outlined" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field class="mx-2" label="Sigle" v-model="editedProject.sigle" density="comfortable" rounded variant="outlined" required></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="8">
                  <v-select class="mx-2" label="choisissez un lieu" :items="['Antananarivo', 'Antsiranana', 'Fianarantsoa', 'Mahajanga' ,'Toamasina','Toliary']" v-model="editedProject.lieu" density="comfortable" rounded variant="outlined" required></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field class="mx-2" label="Budget" v-model="editedProject.budget" density="comfortable" rounded variant="outlined" required type="number"></v-text-field>
                </v-col>
              </v-row>
                  <v-textarea class="mx-2" label="Description" row-height="20" rows="3" auto-grow v-model="editedProject.description" density="comfortable" rounded variant="outlined" required></v-textarea>
              <v-textarea class="mx-2" label="Raison de proposition" row-height="20" rows="3" auto-grow v-model="editedProject.raison_proposition" density="comfortable" rounded variant="outlined" required></v-textarea>                           
            </v-form>
        </v-card-text>
        <v-card-actions>
          
          <v-btn variant="flat" rounded class="text-none" elevation="5" color="white" @click="dialogEdit = false" style="margin-top: -40px; margin-right: -20px;">
            Fermer
          </v-btn>
          <v-btn :width="auto" variant="flat" rounded class="text-none mx-6" color="green" @click="updateProject()" style="margin-top: -40px; margin-right: 8px;">
            Mettre à jour
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

     <!-- Dialog de confirmation -->
    <v-dialog v-model="dialogDelete" width="400">
      <v-card>
        <v-card-title class="headline" style="margin-top: 5px; margin-right: -5px;">
          <v-icon left>mdi-check-circle-outline</v-icon>
          <span style="margin-top: 10px;">Confirmation</span>
        </v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer ce projet ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" rounded class="text-none" elevation="5" color="white" @click="dialogDelete = false" style="margin-top: -15px; margin-right: 5px;">
            Annuler
          </v-btn>
          <v-btn :width="110" variant="flat" rounded class="text-none" color="green" @click="confirmDelete" :loading="load" style="margin-top: -15px; margin-right: 8px;">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      <template v-slot:item.titre="{ item }">
    <div style="position: relative;">
      <v-badge
        v-if="isNewProject(item.date_proposition)"
        color="#87CEEB"
        content="Nouveau"
        style="position: absolute; top: -10px; left: 0; font-weight: bold;"
        dot
      ></v-badge>
      <span class="white--text" style="font-size: 15px">
        {{ item.titre }}
      </span>
    </div>
  </template>
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
            <v-tooltip
                          activator="parent"
                          location="bottom"
                          class="custom-tooltip"
                        >
                          Modifier
                        </v-tooltip>
          </v-btn>
          <v-btn variant="text" icon @click="openDeleteDialog(item)">
            <img src="../../assets/delete.png" height="29px" />
            <v-tooltip
                          activator="parent"
                          location="bottom"
                          class="custom-tooltip"
                        >
                          Supprimer
                        </v-tooltip>
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

          
        </template>
      </v-data-table>
        </v-col>
    </v-row>
 </div>       
    
</template>

<script>
import axios from 'axios';
export default {
    name: 'proposeUnProjet',
    data() {
      return {
        snackbar: {
      show: false,
      message: '',
      color: 'success', // Par défaut, succès
    },
        dialogAdd: false,
        dialogDelete: false,
      projectToDelete: null,
        load: false,
        textSuccessEdit: 'Modification avec succéss',
        textSuccessDel: 'Suppression avec succéss',
      timeout: 2500,
      snackbarSuccessEdit: false,
      snackbarSuccessDel: false,
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
  statut: '',
  description: '', // Ajouter cette ligne
  raison_proposition: '', // Ajouter cette ligne
  lieu: '', // Ajouter cette ligne
},


      headers: [
        { title: "Titre", key: "titre", align: "start" },
        { title: "Sigle", key: "sigle", align: "start" },
        { title: "Statut", key: "statut", align: "start" },
        { title: "Date de proposition", key: "date_proposition", align: "center" },
       // { title: "Budget", key: "budget", align: "center" },
        { title: "Action", key: "actions", align: "center" },
      ],
      filteredItems: [],
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
      }
    },
    computed : {
      filteredItems() {
    if (this.selectedFilter === "Tous les projets") {
      return this.projects; // Affiche tous les projets
    } else {
      return this.projects.filter(item => {
        return item.statut === this.selectedFilter; // Filtrage par statut
      });
    }
  }
    },
    mounted() {

  this.fetchProjects()
  
},
methods: {

  showSnackbar(message, color) {
    this.snackbar = {
      show: true,
      message: message,
      color: color,
    };
  },

  isNewProject(dateProposition) {
    const proposedDate = new Date(dateProposition);
    const now = new Date();
    const diffTime = now - proposedDate; // Calculer la différence en millisecondes
    const diffHours = diffTime / (1000 * 60 * 60); // Convertir en heures
    return diffHours < 24; // Retourne true si le projet a été proposé il y a moins de 24 heures
  },

  openDeleteDialog(item) {
      this.projectToDelete = item; // Conserver le projet à supprimer
      this.dialogDelete = true; // Ouvrir le dialogue
    },

async fetchProjects() {
  try {
    const response = await axios.get(`http://localhost:5000/admin/allProjects`);
    this.projects = response.data.map(project => ({
      ...project,
      date_proposition: new Date(project.date_proposition).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      date_proposition_raw: new Date(project.date_proposition) // Pour trier facilement
    }));

    // Trier les projets par date (la plus récente en premier)
    this.projects.sort((a, b) => b.date_proposition_raw - a.date_proposition_raw);
  } catch (err) {
    console.error('Erreur lors du chargement des projets :', err);
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

async editProject(item) {
  this.editedProject = { 
    ...item, 
    description: item.description || '', 
    raison_proposition: item.raison_proposition || '', 
  };

  // Récupérer les coordonnées du lieu
  if (this.editedProject.lieu) {
    try {
      const coords = await this.getCoordinatesFromLocation(this.editedProject.lieu);
      this.editedProject.latitude = coords.latitude;
      this.editedProject.longitude = coords.longitude;
    } catch (error) {
      console.error('Erreur lors de la récupération des coordonnées :', error);
    }
  }
  
  this.openEditModal(); 
  this.dialogEdit = true; // Ouvrir le modal
},




async updateProject() {
  this.load = true; // Activer le loader
  try {
    // Mettre à jour la date_proposition à la date actuelle
    this.editedProject.date_proposition = new Date().toISOString();

    const response = await axios.put(`http://localhost:5000/admin/allProjects/${this.editedProject.id_projet}`, {
      titre: this.editedProject.titre,
      sigle: this.editedProject.sigle,
      description: this.editedProject.description, // Ajouter cette ligne
      budget: this.editedProject.budget,
      raison_proposition: this.editedProject.raison_proposition, // Ajouter cette ligne
      date_proposition: this.editedProject.date_proposition,
      lieu: this.editedProject.lieu, // Ajouter cette ligne
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.dialogEdit = false; // Fermer le modal
    this.snackbarSuccessEdit = true;
    this.fetchProjects(); // Rafraîchir la liste des projets
    console.log(response.data.message); // Afficher le message de succès
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
  } finally {
    this.load = false; // Désactiver le loader
  }
},


async confirmDelete() {
  this.load = true; // Démarrer le loader
  if (this.projectToDelete) {
    try {
      await axios.delete(`http://localhost:5000/admin/allProjects/${this.projectToDelete.id_projet}`);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler un délai

      this.fetchProjects(); // Rafraîchir la liste des projets
      this.snackbarSuccessDel = true; // Afficher le snackbar de succès
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      this.load = false; // Désactiver le loader
      this.dialogDelete = false; // Fermer le dialogue
    }
  } else {
    this.load = false; // Désactiver le loader si pas de projet à supprimer
    this.dialogDelete = false; // Fermer le dialogue
  }
},

    closeModal() {
      this.dialogAdd = false;
      this.resetForm();
    },

    openModal() {
      this.dialogAdd = true;
    },
    
  formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  },  
    // Méthode pour réinitialiser le formulaire
    resetForm() {
      this.newItem = {
        titre: "",
        sigle: "",
        description: "",
        lieu: "",
        budget: null,
        raison_proposition: "",
        date_proposition: "",
      };
    },
 async addItem() {
  // Ajouter la date actuelle au champ `date_proposition`
  this.newItem.date_proposition = new Date().toISOString();

  // Vérification des champs obligatoires
  if (
    !this.newItem.titre ||
    !this.newItem.sigle ||
    !this.newItem.description ||
    !this.newItem.budget ||
    !this.newItem.raison_proposition ||
    !this.newItem.lieu
  ) {
    this.showSnackbar('Tous les champs doivent être remplis.', 'error');
    return;
  }

  try {
    // Envoyer le projet au backend
    const response = await axios.post('http://localhost:5000/admin/projets', this.newItem);
    const newProject = response.data; // Récupérer le projet ajouté

    // Ajouter le projet directement à `projects`
    this.projects.unshift({
      ...newProject,
      date_proposition: new Date(newProject.date_proposition).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      date_proposition_raw: new Date(newProject.date_proposition)
    });

    // Fermer le dialogue, réinitialiser le formulaire et afficher un message de succès
    this.resetForm();
    this.dialogAdd = false;
    this.showSnackbar('Projet ajouté avec succès', 'success');
  } catch (error) {
    console.error('Erreur lors de l’ajout du projet :', error);
    this.showSnackbar('Erreur lors de l’ajout du projet', 'error');
  }
},


openEditModal() {
  this.dialogEdit = true; // Ouvrir le modal d'édition
}
,

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

</style>