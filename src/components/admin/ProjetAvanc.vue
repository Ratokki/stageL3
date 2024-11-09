<template>
    <div>
        <v-row align="center" style="margin-top: 10px">
            <v-sheet class="d-flex justify-space-between align-center pa-4">
                <v-select
                    v-model="selectedFilter"
                    :items="filterOptions"
                    persistent-hint
                    single-line
                    variant="plain"
                    class="custom-select"
                    style="max-width: 200px; margin-top: -5px; margin-left: 10px;"
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

        <!-- Liste de projet -->
        <v-row>
            <v-col cols="12">
                <v-data-table
                    v-model:search="search"
                    :headers="headers1"
                    :items="projects"
                    item-value="name"
                    style="border-radius: 15px; margin-top: -20px"
                    
                >
                    <template v-slot:item.date_debut="{ item }">
                        {{ formatDate(item.date_debut) }}
                    </template>
                    <template v-slot:item.statut="{ item }">
                        <v-chip
                            :color="getStatusColor(item.statut)"
                            small
                            dark
                            class="justify-center"
                        >
                            {{ item.statut }}
                        </v-chip>
                    </template>
                    <template v-slot:item.profile_utilisateur="{ item }">
            <v-avatar size="38">
              <v-img :src="item.profile_utilisateur" height="38" cover alt="Image de profil" />
            </v-avatar>
          </template>
                    <template v-slot:item.responsable="{ item }">
                        {{ item.nom_responsable }} {{ item.prenom_responsable }}  <!-- Affiche le nom et prénom -->
                    </template>
                     <template v-slot:item.pourcentage="{ item }">
                        <v-progress-circular
                        
                            :model-value="item.pourcentage"
                            color="blue"
                            size="45"
                            width="5"
                        >
                            {{ item.pourcentage }}%
                        </v-progress-circular>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn variant="text" icon @click="viewDetails(item)" style="margin-left: 5px" dark>
                            <img src="../../assets/eye.png" height="29px" />
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
        viewDetails(item) {
            // Logique pour afficher les détails du projet
        }
    }
};
</script>

<style scoped>
/* Ajoutez votre style ici si nécessaire */
</style>



