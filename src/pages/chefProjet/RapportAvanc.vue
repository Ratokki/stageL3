<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <ChefNav />
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <!-- pour la toolbar -->
        <v-col cols="12">
          <v-card height="58" elevation="0" style="background-color: white; border-radius: 10px">
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-col cols="10">
                  <p>Rapport d'avancement</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <ChefAvatar />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- Affichage du projet du jour -->
        <v-col cols="12">
          <v-card height="auto" elevation="0" style="background-color: white; border-radius: 10px; margin-top: -5px;">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <span style="font-size: 15px;">Projet en ce moment</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-card elevation="4" style="padding: 15px; margin-top: 10px; border-radius: 30px;">
                    <v-list-item class="px-1" height="70">   
      <template v-slot:title><v-btn  icon="mdi-format-list-checks" size="x-small" style="margin-top: -10px;"></v-btn>  <span style="font-size:18px;">{{ projectToday ? projectToday.titre : 'Aucun projet' }}</span></template>
    </v-list-item>

    <v-divider></v-divider>
    <v-card-text class="text-medium-emphasis pa-6">

<div class="mb-2" style="margin-top:-7px;">
  <span>Progrés : </span>
  <span v-if="projectToday && projectToday.pourcentage_avancement !== null" class="text-h5 font-weight-black mb-2">
    {{ projectToday.pourcentage_avancement }}%
  </span>
  <span v-else class="text-h5 font-weight-black mb-2">Non spécifié</span>
</div>


<v-progress-linear
  v-if="projectToday && projectToday.pourcentage_avancement !== null"
  bg-color="surface-variant"
  class="mb-6"
  color="success"
  height="10"
  rounded="pill"
  :model-value="projectToday.pourcentage_avancement"
></v-progress-linear>


      <v-row>
        <!-- Titre à gauche -->
        <v-col cols="4" class="d-flex align-center">
          <span>Debut:</span>
        </v-col>
        <!-- Valeur à droite -->
        <v-col cols="8" class="d-flex justify-end align-center">
          <span>{{ projectToday ? projectToday.date_debut_projet : 'Non spécifié' }}</span>
        </v-col>
      </v-row>
      <v-row style="margin-top: -10px;">
        <!-- Titre à gauche -->
        <v-col cols="4" class="d-flex align-center">
          <span>Fin:</span>
        </v-col>
        <!-- Valeur à droite -->
        <v-col cols="8" class="d-flex justify-end align-center">
          <span>{{ projectToday ? projectToday.date_fin_projet : 'Non spécifié' }}</span>
        </v-col>
      </v-row>
      <v-row style="margin-top: -10px;">
        <!-- Titre à gauche -->
        <v-col cols="6" class="d-flex align-center">
          <span><v-icon color="red">mdi-clock-alert</v-icon> Retard:</span>
        </v-col>
        <!-- Valeur à droite -->
        <v-col cols="6" class="d-flex justify-end align-center">
          <span> jours</span>
        </v-col>
      </v-row>

    </v-card-text>

    <v-card-actions style="margin-top: -10px;">

      <v-chip
  v-if="projectToday && projectToday.statut_avancement"
  :color="getStatusColor(projectToday.statut_avancement)"
  small
  dark
  class="text-none mx-2 mb-2"
  slim
>
  {{ projectToday.statut_avancement }}
</v-chip>

      <v-spacer></v-spacer>
      <v-btn
      @click="openReportModal"
        class="text-none mx-2 mb-2"
        color="primary"
        text="Voir rapport"
        variant="text"
        slim
        rounded
      ></v-btn>
    </v-card-actions>
                    
                  </v-card>
                </v-col>
                <v-col cols="12" sm="8">
  <v-card
    elevation="4"
    style="padding: 15px; margin-top: 10px; border-radius: 10px; height: 350px; overflow-y: auto;"
  >
    <v-card-title>
      <span class="headline" style="font-size: 15px;">Rapport de ces taches</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-list two-line>
  <v-list-item-group v-if="reports && reports.length > 0">
    <v-list-item 
      v-for="report in reports" 
      :key="report.id_rapport" 
      class="d-flex align-center" 
      style="flex-wrap: nowrap;"
    >
     <!-- <v-list-item-avatar class="me-4">
        <v-avatar size="40">
          <v-img :src="getImageUrl(report.profil_employe)" height="64" cover />
        </v-avatar>
      </v-list-item-avatar>
      <v-list-item-content class="flex-grow-1">
        <v-list-item-title>{{ report.nom_complet }}</v-list-item-title>
        <v-list-item-subtitle>Tâche : {{ report.titre }}</v-list-item-subtitle>
        <v-list-item-subtitle>Progrès aujourd'hui : {{ report.pourcentage_avancement }}%</v-list-item-subtitle>
        <v-list-item-subtitle>Date rapport : {{ formatDate(report.date_rapport) }}</v-list-item-subtitle>
      </v-list-item-content> -->
      <v-row>
  <v-col cols="12" class="d-flex align-center">
    <v-list-item>
      <template #prepend>
        <v-avatar>
          <v-img :src="getImageUrl(report.profil_employe)" />
        </v-avatar>
      </template>

      <v-list-item-content>
        <v-list-item-title>{{ report.nom_complet }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ report.titre }} | {{ formatDate(report.date_rapport) }} | {{ report.pourcentage_avancement }}%
        </v-list-item-subtitle>
        <v-progress-linear
  :model-value="report.pourcentage_avancement"
  height="6"
  color="blue"
  rounded
  class="mt-2 progress-limited"
></v-progress-linear>
      </v-list-item-content>
    </v-list-item>
  </v-col>
</v-row>




    </v-list-item>
  </v-list-item-group>
  <v-alert v-else type="info" color="blue" dense>
    Aucun rapport disponible pour ce projet.
  </v-alert>
</v-list>
    </v-card-text>

  </v-card>
</v-col>


              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- Modal pour afficher les rapports -->
        <v-dialog v-model="reportDialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Rapports du projet</span>
            </v-card-title>
            <v-card-text>
              <v-list two-line>
                <v-list-item-group v-if="reports && reports.length > 0">
                  <v-list-item v-for="report in reports" :key="report.id_rapport">
                    <v-list-item-content>
                      <v-list-item-title>{{ formatDate(report.date_rapport) }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ report.commentaire }}<br>
                        <strong>Heures travaillées:</strong> {{ report.heures_travaillees }} <br>
                        <strong>Avancement:</strong> {{ report.pourcentage_avancement }}%<br>
                        <strong>Retard:</strong> {{ report.retard_jours }} jours
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
                <v-alert v-else type="info" color="blue" dense>
                  Aucun rapport disponible pour ce projet.
                </v-alert>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="closeReportModal" color="blue">Fermer</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ChefNav from "../../components/chefProjet/ChefNav.vue";
import ChefAvatar from "../../components/chefProjet/ChefAvatar.vue";
import axios from "axios";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default {
  components: {
    ChefNav,
    ChefAvatar
  },
  data() {
    return {
      projectToday: null, // Stockage du projet en cours aujourd'hui
      reports: [], // Stockage des rapports récupérés
      userId: null, // L'ID de l'utilisateur
      reportDialog: false // État du modal des rapports
    };
  },
  created() {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      this.userId = storedUserData.idUtilisateur;
      this.getProjectsNow();
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      return format(new Date(date), "d MMMM yyyy", { locale: fr });
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
    getProjectsNow() {
  axios
    .get("http://localhost:5000/admin/projets/projectNowForChef", { params: { userId: this.userId } })
    .then((response) => {
      if (response.data.length > 0) {
        const project = response.data[0];
        const dateOptions = { day: "numeric", month: "long", year: "numeric" };
        project.date_debut_projet = project.date_debut_projet
          ? new Date(project.date_debut_projet).toLocaleDateString("fr-FR", dateOptions)
          : "Non spécifié";
        project.date_fin_projet = project.date_fin_projet
          ? new Date(project.date_fin_projet).toLocaleDateString("fr-FR", dateOptions)
          : "Non spécifié";
        project.pourcentage_avancement = project.pourcentage_avancement || 0;
        this.projectToday = project;

        // Charger les rapports pour le projet en cours
        this.fetchReports();
      } else {
        this.projectToday = {
          titre: "Aucun projet",
          pourcentage_avancement: null,
          date_debut_projet: null,
          date_fin_projet: null,
          statut_avancement: null,
        };
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des projets :", error);
    });
},

    // Fonction pour ouvrir le modal
    openReportModal() {
      this.fetchReports();
      this.reportDialog = true;
    },

    // Fonction pour fermer le modal
    closeReportModal() {
      this.reportDialog = false;
    },

    // Récupérer les rapports pour ce projet
    fetchReports() {
  if (this.projectToday && this.projectToday.id_projet) {
    axios
      .get(`http://localhost:5000/admin/projets/rapportForChef/${this.projectToday.id_projet}`)
      .then((response) => {
        console.log("Données récupérées :", response.data); // Ajout de console.log pour afficher les données
        this.reports = response.data.map((report) => ({
          ...report,
          nom_complet: `${report.prenom_employe} ${report.nom_employe}`,
        }));
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des rapports :", error);
      });
  }
},

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

  }
};
</script>
<style scoped>
  .v-list-item-avatar {
  min-width: 50px; /* Ajustez selon la taille de l'avatar */
}

.v-list-item-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.progress-limited {
  width: 75%;
}


</style>
