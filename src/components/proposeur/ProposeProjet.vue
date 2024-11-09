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
      <v-dialog v-model="dialogAdd" max-width="600px">
        <v-card>
          <v-card-title>
            Proposer un nouveau projet
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field label="Titre" v-model="newItem.titre" required></v-text-field>
              <v-text-field label="Sigle" v-model="newItem.sigle" required></v-text-field>
              <v-text-field label="Description" v-model="newItem.description" required></v-text-field>
              <v-text-field label="Budget" v-model="newItem.budget" required type="number"></v-text-field>
              <v-textarea label="Raison de proposition" v-model="newItem.raison_proposition" required></v-textarea>
              <v-text-field v-model="newItem.lieu" label="Lieu (Latitude, Longitude)" readonly></v-text-field>
              <div id="map" style="height: 300px"></div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="addItem" color="primary">Ajouter</v-btn>
            <v-btn @click="closeModal" color="secondary">Fermer</v-btn>
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

          <!-- modal edit -->
          <v-dialog v-model="dialogDetails" max-width="500px"> 
  <v-card>
    <v-card-title>Détails de projet</v-card-title>
    <v-card-text>
      <div v-if="selectedProject && selectedProject.length > 0">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
      Nom : {{ selectedProject[0].titre }} 
      <v-badge v-if="isNewProject(selectedProject[0].date_proposition)" color="green" content="Nouveau" overlap>
        <template v-slot:badge>
          <v-icon small>mdi-star</v-icon>
        </template>
      </v-badge>
    </v-list-item-title>
              <v-list-item-subtitle>Sigle : {{ selectedProject[0].sigle }}</v-list-item-subtitle>
              <v-list-item-subtitle>Description : {{ selectedProject[0].description }}</v-list-item-subtitle>
              <v-list-item-subtitle>Lieu : {{ selectedProject[0].lieu }}</v-list-item-subtitle>
              <v-list-item-subtitle>Latitude : {{ selectedProject[0].latitude }}</v-list-item-subtitle>
              <v-list-item-subtitle>Longitude : {{ selectedProject[0].longitude }}</v-list-item-subtitle>
              <v-list-item-subtitle>Budget : {{ selectedProject[0].budget }} €</v-list-item-subtitle>
              <v-list-item-subtitle>Raison de proposition : {{ selectedProject[0].raison_proposition }}</v-list-item-subtitle>
              <v-list-item-subtitle>Type de projet : {{ selectedProject[0].type_projet }}</v-list-item-subtitle>
              <v-list-item-subtitle>Date de proposition : {{ formatDate(selectedProject[0].date_proposition) }}</v-list-item-subtitle>
              <v-list-item-subtitle>Statut : {{ selectedProject[0].statut }}</v-list-item-subtitle>
              <v-list-item-subtitle>
                Date d'acceptation : 
                {{ selectedProject[0].date_acceptation ? formatDate(selectedProject[0].date_acceptation) : "Ce projet n'est pas encore accepté." }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                Date de refus : 
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
      <v-btn text @click="dialogDetails = false">Fermer</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>




<!-- Modal d'édition -->
    <v-dialog v-model="dialogEdit" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Modifier le Projet</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editedProject.titre" label="Titre"></v-text-field>
            <v-text-field v-model="editedProject.sigle" label="Sigle"></v-text-field>
            <v-textarea v-model="editedProject.description" label="Description"></v-textarea>
            <v-text-field v-model="editedProject.budget" label="Budget" type="number"></v-text-field>
            <v-text-field v-model="editedProject.raison_proposition" label="Raison de proposition"></v-text-field>
            <v-text-field v-model="editedProject.lieu" label="Lieu" readonly></v-text-field>
            <!-- <div id="map" style="height: 400px;"></div> -->
            <!-- Ajoutez ici d'autres champs si nécessaire -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="updateProject()">Mettre à jour</v-btn>
          <v-btn color="grey" text @click="dialogEdit = false">Annuler</v-btn>
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
    name: 'proposeUnProjet',
    data() {
      return {
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

    // Mettez à jour les projets et formatez les dates
    this.projects = response.data.map(project => ({
      ...project,
      date_proposition: new Date(project.date_proposition).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      date_proposition_raw: new Date(project.date_proposition) // Ajoutez une version brute de la date pour le tri
    }));

    // Trier les projets par date de proposition (du plus récent au plus ancien)
    this.projects.sort((a, b) => b.date_proposition_raw - a.date_proposition_raw);

    console.log("VOICI", this.projects);
  } catch (err) {
    console.log(err);
  }
}
,

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
    lieu: item.lieu || '', 
  };

  // Récupérer les coordonnées du lieu
  if (this.editedProject.lieu) {
    try {
      const coords = await this.getCoordinatesFromLocation(this.editedProject.lieu);
      this.editedProject.latitude = coords.latitude;
      this.editedProject.longitude = coords.longitude;

      // Centrer la carte sur le lieu
      if (this.marker) {
        this.marker.setLatLng([coords.latitude, coords.longitude]);
        this.map.setView([coords.latitude, coords.longitude], 13);
      } else {
        // Si le marqueur n'est pas initialisé, initiez la carte avec le lieu
        this.initMap(coords.latitude, coords.longitude);
      }
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
      this.$nextTick(() => {
        this.initMap();
      });
    },
    initMap(lat = null, lng = null) {
  if (navigator.geolocation) {

    console.log("Initialisation de la carte...");
  const mapContainer = document.getElementById("map");
  if (!mapContainer) {
    console.error("Le conteneur de la carte n'existe pas !");
    return;
  }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const defaultLat = lat || position.coords.latitude;
        const defaultLng = lng || position.coords.longitude;

        this.map = L.map("map").setView([defaultLat, defaultLng], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap",
        }).addTo(this.map);

        this.marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(this.map);

        // Écouter les événements de clic sur la carte
        this.map.on("click", (e) => {
          this.marker.setLatLng(e.latlng); // Déplacer le marqueur
          this.newItem.location = { lat: e.latlng.lat, lng: e.latlng.lng }; // Mettre à jour les coordonnées
          this.getLocationName(e.latlng.lat, e.latlng.lng); // Obtenir le nom du lieu
        });

        this.marker.on("dragend", () => {
          const position = this.marker.getLatLng();
          this.newItem.location = { lat: position.lat, lng: position.lng };
          this.getLocationName(position.lat, position.lng); // Obtenir le nom du lieu
        });
      },
      (error) => {
        console.error("Erreur de géolocalisation :", error);
        this.initDefaultMap();
      }
    );
  } else {
    this.initDefaultMap();
  }
},
    initDefaultMap() {
      this.map = L.map("map").setView([48.8566, 2.3522], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(this.map);

      this.marker = L.marker([48.8566, 2.3522], { draggable: true }).addTo(
        this.map
      );

      this.map.on("click", (e) => {
  this.marker.setLatLng(e.latlng); // Déplacer le marqueur
  this.newItem.location = { lat: e.latlng.lat, lng: e.latlng.lng }; // Mettre à jour les coordonnées
  this.getLocationName(e.latlng.lat, e.latlng.lng); // Obtenir le nom du lieu et mettre à jour newItem.lieu
});


      this.marker.on("dragend", () => {
        const position = this.marker.getLatLng();
        this.newItem.location = { lat: position.lat, lng: position.lng };
        this.newItem.locationName = `(${position.lat}, ${position.lng})`; // Mettre à jour le champ lieu
      });
    },
 // Méthode pour mettre à jour le champ lieu avec les coordonnées
  updateMapFromLocation() {
    const location = this.newItem.lieu; // Le lieu sélectionné par l'utilisateur
    console.log("Lieu sélectionné :", location);

    // Vérifier si le lieu est vide
    if (!location) {
      alert('Veuillez entrer un lieu.');
      return;
    }

    this.getCoordinatesFromLocation(location)
      .then(coords => {
        console.log("Coordonnées récupérées :", coords);

        // Mise à jour des champs latitude, longitude et lieu avec les coordonnées
        this.newItem.latitude = coords.latitude;
        this.newItem.longitude = coords.longitude;
        this.newItem.lieu = `Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`; // Affiche dans le champ lieu

        // Optionnel : Mise à jour de la carte avec la nouvelle position
        this.marker.setLatLng([coords.latitude, coords.longitude]);
        this.map.setView([coords.latitude, coords.longitude], 13);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des coordonnées :", error);
        alert('Impossible de récupérer les coordonnées pour ce lieu.');
      });
  },

getCoordinatesFromLocation(location) {
  return new Promise((resolve, reject) => {
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`)
      .then(response => {
        if (!response.ok) {
          reject('Erreur lors de la requête vers l\'API de géocodage.');
          return;
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          resolve({ latitude: lat, longitude: lon });
        } else {
          reject('Aucun résultat trouvé pour ce lieu.');
        }
      })
      .catch(error => reject(error));
  });
},

  
getLocationName(lat, lng) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.display_name) {
        this.newItem.lieu = data.display_name;
      } else {
        this.newItem.lieu = `(${lat}, ${lng})`; // Fallback au cas où aucun nom de lieu n'est trouvé
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération du nom du lieu :", error);
      this.newItem.lieu = `(${lat}, ${lng})`;
    });
}
,

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
        latitude: null,
        longitude: null,
        budget: null,
        raison_proposition: "",
        date_proposition: "",
      };
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = null;
      }
    },
  async addItem() {
  // Ajoutez la date actuelle
  this.newItem.date_proposition = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

  console.log("Date de proposition:", this.newItem.date_proposition); 

  try {
    const response = await fetch('http://localhost:5000/admin/projets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titre: this.newItem.titre,
        sigle: this.newItem.sigle,
        description: this.newItem.description,
        budget: this.newItem.budget,
        raison_proposition: this.newItem.raison_proposition,
        date_proposition: this.newItem.date_proposition, // Utilisez la date actuelle
        latitude: this.newItem.latitude,
        longitude: this.newItem.longitude,
        lieu: this.newItem.lieu,
      }),
    });

    if (response.ok) {
      alert('Projet ajouté avec succès !');
      this.resetForm();
    } else {
      alert('Une erreur est survenue lors de l\'ajout du projet.');
    }
  } catch (error) {
    console.error('Erreur lors de la requête :', error);
    alert('Impossible de se connecter au serveur.');
  }
},

openEditModal() {
  this.dialogEdit = true; // Ouvrir le modal d'édition
  this.$nextTick(() => {
    if (!this.map) {
      this.initMap(); // Initialiser la carte si elle n'est pas encore faite
    } else if (this.editedProject.lieu) {
      // Si le lieu est déjà défini, centrer la carte sur ce lieu
      this.getCoordinatesFromLocation(this.editedProject.lieu)
        .then(coords => {
          this.marker.setLatLng([coords.latitude, coords.longitude]);
          this.map.setView([coords.latitude, coords.longitude], 13);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des coordonnées :', error);
        });
    }
  });
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