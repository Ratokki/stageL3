<template>
    <div>
        <!-- Modal pour afficher les détails d'un projet -->
        <v-dialog v-model="dialogDetails" max-width="500px">
            <v-card>
                <v-card-title class="headline" style="margin-top: 5px; margin-right: -5px;">
                    <span style="margin-top: 10px;">Détails de projet</span>
                </v-card-title>
                <v-card-text>
                    <div v-if="selectedProject">
                        <v-card-subtitle>Titre : {{ selectedProject.titre }}</v-card-subtitle>
                        <v-card-subtitle>Date de proposition : {{ selectedProject.date_proposition }}</v-card-subtitle>
                        <v-card-subtitle>Statut : {{ selectedProject.statut }}</v-card-subtitle>
                        <v-card-subtitle>Budget : {{ selectedProject.budget }} €</v-card-subtitle>         
                    </div>
                    <div v-else>
                        <v-alert type="error">Aucun détail disponible pour ce projet.</v-alert>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn variant="flat" rounded class="text-none" elevation="5" color="white" @click="dialogDetails = false" style="margin-top: -15px; margin-right: 5px;">
                        Annuler
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-row align="center" style="margin-top: 10px">
            <v-sheet class="d-flex justify-space-between align-center pa-4">
                <v-select v-model="selectedFilter" :items="filterOptions" persistent-hint single-line variant="plain" class="custom-select" style="max-width: 200px; margin-top: -5px; margin-left: 10px;"></v-select>
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

        <!-- Liste de projet -->
        <v-row>
            <v-col cols="12">
                <v-data-table v-model:search="search" :headers="headers1" :items="projects" ref="projectTable" item-value="name" class="scroll-container" style="background-color: white; border-radius: 15px; margin-top: -30px; max-height: 430px; overflow-y: auto;">
                    <template v-slot:item.date_debut="{ item }">
                        {{ formatDate(item.date_debut) }}
                    </template>
                    <template v-slot:item.statut="{ item }">
                        <v-chip :color="getStatusColor(item.statut)" small dark class="justify-center">
                            {{ item.statut }}
                        </v-chip>
                    </template>
                    <template v-slot:item.profile_utilisateur="{ item }">
                        <v-avatar size="38">
                            <v-img :src="item.profile_utilisateur" height="38" cover alt="Image de profil" />
                        </v-avatar>
                    </template>
                    <template v-slot:item.responsable="{ item }">
                        {{ item.nom_responsable }} {{ item.prenom_responsable }}
                    </template>
                     <template v-slot:item.pourcentage="{ item }">
                        <v-progress-circular :model-value="item.pourcentage" color="blue" size="45" width="5">
                            {{ item.pourcentage }}%
                        </v-progress-circular>
                    </template>
                    <template v-slot:item.actions="{ item }">
                            {{ console.log(item) }}
                        <v-btn variant="text" icon @click="viewDetails(item.id_projet)" style="margin-left: 5px" dark>
                            <img src="../../assets/eye.png" height="29px" />
                                <v-tooltip activator="parent" location="bottom" class="custom-tooltip">
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
    data() {
        return {
            projects: [],
            search: '',
            selectedFilter: null,
            filterOptions: [],
            dialogDetails: false,
            selectedProject: null,
            headers1: [
                { text: "Titre", key: "titre", align: "start" },
                { text: "Sigle", key: "sigle", align: "start" },
                { text: "Statut", key: "statut", align: "start" },
                { text: "Date de début", key: "date_debut", align: "center" },
                { text: "Profile", key: "profile_utilisateur", align: "start" },
                { text: "Responsable", key: "responsable", align: "start" },
                { text: "Pourcentage", key: "pourcentage", align: "center" },
                { text: "Action", key: "actions", align: "center", sortable: false },
            ],
        };
    },
    mounted() {
        this.fetchProjects();
    },
    watch: {
        // Déclencher le défilement quand `projects` change
        projects: {
            handler() {
                this.scrollToEnd();
            },
            deep: true,
        },
    },
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            const options = { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric' 
            };
            return date.toLocaleDateString('fr-FR', options);
        },
        async fetchProjects() {
    try {
        const response = await axios.get('http://localhost:5000/admin/avancProject');

        // Compléter l'URL de chaque profil utilisateur et trier par date de début la plus récente
        this.projects = response.data
            .map(item => {
                if (item.profile_utilisateur && !item.profile_utilisateur.startsWith('http')) {
                    item.profile_utilisateur = `http://localhost:5000/${item.profile_utilisateur}`;
                }
                return item;
            })
            .sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut)); // Trier par date de début décroissante

        console.log('Projets triés par date de début la plus récente:', this.projects);
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
    }
}
,
scrollToEnd() {
            this.$nextTick(() => {
                const container = this.$refs.projectTable?.$el?.querySelector(".scroll-container");
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        },


async viewDetails(projectId) {
  console.log("Project ID reçu :", projectId); // Pour débogage
  try {
    const response = await axios.get(
      `http://localhost:5000/admin/allProjects/?id_projet=${projectId}`
    );

    // Affiche les données reçues pour vérification
    console.log("Données reçues de l'API :", response.data);

    // Si la réponse est un tableau, on prend le premier élément
    this.selectedProject = response.data[0] || null;

    // Ouvrir le modal
    this.dialogDetails = true;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du projet:", error);
    this.selectedProject = null; // Aucun détail à afficher en cas d'erreur
    this.dialogDetails = true;  // Afficher quand même le modal pour l'alerte
  }
}

,
        getStatusColor(status) {
            switch (status) {
                case 'À faire':
                    return 'blue';
                case 'En cours':
                    return 'orange';
                case 'Terminé':
                    return 'green';
                case 'En retard':
                    return 'red';
                default:
                    return 'grey';
            }
        },
        editProject(item) {
            // Logique pour éditer le projet
        },
        deleteProject(item) {
            // Logique pour supprimer le projet
        },
        
    }
};
</script>

<style scoped>
/* Cibler les barres de défilement pour les sections spécifiques */
::-webkit-scrollbar {
  width: 0px; /* Cache la scrollbar verticale */
  height: 0px; /* Cache la scrollbar horizontale si nécessaire */
}

::-webkit-scrollbar-thumb {
  background: transparent; /* Aucune couleur pour les thumbs */
}

::-webkit-scrollbar-track {
  background: transparent; /* Fond transparent */
}

.scroll-container {
  scrollbar-width: none; /* Cache la barre de défilement dans Firefox */
  -ms-overflow-style: none; /* Cache la barre de défilement dans Internet Explorer */
  overflow-y: auto; /* Assurez le défilement vertical */
}
</style>



