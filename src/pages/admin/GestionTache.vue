<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <AdminNav />
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <v-col cols="12">
          <v-card height="58" elevation="0" style="background-color: white; border-radius: 10px">
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-col cols="10">
                  <p class="monTitle">Tâches du projet</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <AdminAvatar />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-container>

      <!-- Contenu des projets -->
      <v-container fluid class="px-6 mt-n2">
        <v-col cols="12" style="margin-top: -8px">
          <v-card elevation="0" class="scroll-container" style="background-color: white; border-radius: 10px; margin-top: -25px; max-height: 540px; overflow-y: auto;">
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-sheet class="d-flex justify-space-between align-center pa-4">
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

                <!-- Recherche et Tri -->
                <v-spacer></v-spacer>
                <div>
                  <v-text-field
                    v-model="search"
                    color="success"
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
<v-dialog v-model="dialog" max-width="500px">
  <v-card>
    <v-card-title class="headline" style="margin-top: 5px; margin-right: -5px;">
        <span style="margin-top: 10px;">Détails de projet</span>
      </v-card-title>
    <v-card-text>
      <!-- Détails du projet -->
      <v-card-subtitle>Titre : {{ selectedProject.titre }}</v-card-subtitle>
      <v-card-subtitle>Date de début : {{ selectedProject.formattedDate }}</v-card-subtitle>
      <v-card-subtitle>Statut : {{ selectedProject.statut }}</v-card-subtitle>
      <v-card-subtitle>Description : {{ selectedProject.description }}</v-card-subtitle>
    </v-card-text>
    <v-card-actions>
      <v-btn 
        variant="flat" 
        rounded 
        class="text-none" 
        elevation="5" 
        color="white" 
        @click="dialog = false"
        style="margin-top: -15px; margin-right: 5px;"
        >
          Annuler
        </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

              <!-- Liste des projets -->
              <v-row style="margin-top: -30px">
                <v-col cols="12">
                  <v-card v-for="project in filteredAndSearchedProjects" :key="project.id_projet" class="mb-4">
                    <v-container>
                      <v-row align="center">
                        <v-col cols="12" sm="8" style="margin-left: -15px">
                          <v-card-title>Titre : {{ project.titre }}</v-card-title>
                        </v-col>
                        <v-col cols="12" sm="3" style="margin-left: -15px">
                          <v-card-subtitle>Date de début : {{ project.formattedDate }}</v-card-subtitle>
                        </v-col>
                        <v-col cols="12" sm="1" style="margin-left: -5px">
                          <v-chip :color="getStatusColor(project.statut)" small dark class="justify-center">
                            {{ project.statut }}
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-card-subtitle>Nombre de tâches : {{ getTaskCount(project.id_projet) }}</v-card-subtitle>
                    <v-row align="center">
                      <v-col cols="11">
                        <v-card-actions>
                          <v-btn
                            class="text-none"
                            color="primary"
                            rounded="xl"
                            @click="loadTasks(project)"
                            variant="text"
                          >
                            Voir tâche
                            <v-icon left>
                              {{ project.showTasks ? "mdi-chevron-up" : "mdi-chevron-down" }}
                            </v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-col>
                      <v-col cols="1" style="margin-left: -35px">
                        <v-btn variant="text" icon @click="viewDetails(project)" style="margin-left: 5px" dark>
                          <img src="../../assets/eye.png" height="29px" />
                          <v-tooltip activator="parent" location="bottom" class="custom-tooltip">Voir détails</v-tooltip>
                        </v-btn>
                      </v-col>
                    </v-row>

                    <!-- Tâches associées -->
                    <v-expand-transition>
                      <div v-show="project.showTasks">
                        <v-divider></v-divider>
                        <v-container>
                          <v-row>
                            <v-col cols="12" style="margin-top: 10px;">
                              <span style="margin-left: 15px; font-size: 20px;">Tâches en cours</span>
                              <template v-if="getTasksByStatus(project.id_projet, 'En cours').length">
                                <v-row style="margin-top: 10px;">
  <v-col
    v-for="task in sortedTasks(getTasksByStatus(project.id_projet, 'En cours'))"
    :key="task.id"
    cols="12"
    sm="4"
  >
    <v-card elevation="3" style="border-radius: 15px;">
      <br />
      <span
        style="font-weight: bold; font-size: 16px; margin-left: 15px; margin-top: -15px;"
      >
        Titre : {{ task.titre }}
      </span>
      <v-card-subtitle
        class="task-description"
        style="margin-top: 10px;"
      >
        Avancement : {{ task.pourcentage_avancement }}%
      </v-card-subtitle>
      <!-- Barre de progression -->
      <v-progress-linear
        :model-value="task.pourcentage_avancement"
        height="6"
        :width="20"
        color="primary"
        rounded
        style="margin: 0 15px 10px 15px;"
      ></v-progress-linear>
      <v-card-subtitle style="margin-top: 8px">
        Débuté le : {{ formatDate(task.date_debut) }}
      </v-card-subtitle>
      <v-chip
        :color="getStatusColor(task.statut)"
        small
        dark
        class="justify-center"
        style="margin-top: 8px; margin-left: 15px;"
      >
        {{ task.statut }}
      </v-chip>
      <br /><br />
    </v-card>
  </v-col>
</v-row>

                              </template>
                              <template v-else>
                                <br><br>
                                <span style="font-size: 12px; font-style: italic; color: #b9c3c4; margin-left: 20px; margin-top: 20px;">Pas de tâche en cours en ce moment.</span>
                              </template>
                            </v-col>

                            <v-col cols="12" style="margin-top: 10px;">
                              <span style="margin-left: 15px; font-size: 20px;">Tâches à faire</span>
                              <template v-if="getTasksByStatus(project.id_projet, 'À faire').length">
                                <v-row style="margin-top: 10px;">
  <v-col
    v-for="task in sortedTasks(getTasksByStatus(project.id_projet, 'À faire'))"
    :key="task.id"
    cols="12"
    sm="4"
  >
    <v-card elevation="3" style="border-radius: 15px;">
      <br />
      <span
        style="font-weight: bold; font-size: 16px; margin-left: 15px; margin-top: -15px;"
      >
        Titre : {{ task.titre }}
      </span>
      <v-card-subtitle
        class="task-description"
        style="margin-top: 10px;"
      >
        Avancement : {{ task.pourcentage_avancement }}%
      </v-card-subtitle>
      <!-- Barre de progression -->
      <v-progress-linear
        :model-value="task.pourcentage_avancement"
        height="6"
        color="primary"
        rounded
        style="margin: 0 15px 10px 15px;"
      ></v-progress-linear>
      <v-card-subtitle style="margin-top: 8px">
        Débuté le : {{ formatDate(task.date_debut) }}
      </v-card-subtitle>
      <v-chip
        :color="getStatusColor(task.statut)"
        small
        dark
        class="justify-center"
        style="margin-top: 8px; margin-left: 15px;"
      >
        {{ task.statut }}
      </v-chip>
      <br /><br />
    </v-card>
  </v-col>
</v-row>

                              </template>
                              <template v-else>
                                <br><br>
                                <span style="font-size: 12px; font-style: italic; color:#b9c3c4; margin-left: 20px; margin-top: 20px;">Pas de tâche à faire en ce moment.</span>
                              </template>
                            </v-col>

                            <v-col cols="12" style="margin-top: 10px;">
                              <span style="margin-left: 15px; font-size: 20px;">Tâches effectuées</span>
                              <template v-if="getTasksByStatus(project.id_projet, 'Terminé').length">
                                <v-row style="margin-top: 10px;">
  <v-col
    v-for="task in sortedTasks(getTasksByStatus(project.id_projet, 'Terminé'))"
    :key="task.id"
    cols="12"
    sm="4"
  >
    <v-card elevation="3" style="border-radius: 15px;">
      <br />
      <span
        style="font-weight: bold; font-size: 16px; margin-left: 15px; margin-top: -15px;"
      >
        Titre : {{ task.titre }}
      </span>
      <v-card-subtitle
        class="task-description"
        style="margin-top: 10px;"
      >
        Avancement : {{ task.pourcentage_avancement }}%
      </v-card-subtitle>
      <!-- Barre de progression -->
      <v-progress-linear
        :model-value="task.pourcentage_avancement"
        height="6"
        color="primary"
        rounded
        style="margin: 0 15px 10px 15px;"
      ></v-progress-linear>
      <v-card-subtitle style="margin-top: 8px">
        Débuté le : {{ formatDate(task.date_debut) }}
      </v-card-subtitle>
      <v-chip
        :color="getStatusColor(task.statut)"
        small
        dark
        class="justify-center"
        style="margin-top: 8px; margin-left: 15px;"
      >
        {{ task.statut }}
      </v-chip>
      <br /><br />
    </v-card>
  </v-col>
</v-row>

                              </template>
                              <template v-else>
                                <br><br>
                                <span style="font-size: 12px; font-style: italic; color:#b9c3c4; margin-left: 20px; margin-top: 20px;">Pas de tâche effectuée en ce moment.</span>
                              </template>
                            </v-col>
                          </v-row>
                        </v-container>
                      </div>
                    </v-expand-transition>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import AdminNav from "../../components/admin/AdminNav.vue";
import AdminAvatar from "../../components/admin/AdminAvatar.vue";

export default {
  components: {
    AdminNav,
    AdminAvatar,
  },
  data() {
    return {
      dialog: false,
      selectedProject: null,
      selectedFilter: "Tous les projets",
      filterOptions: ["Tous les projets","En cours", "À faire", "Terminé"],
      search: "",
      projects: [],
    };
  },
  computed: {
  filteredAndSearchedProjects() {
      return this.sortedProjects.filter((project) => {
        const matchesFilter =
          this.selectedFilter === "Tous les projets" ||
          project.statut.toLowerCase() === this.selectedFilter.toLowerCase(); // Ignore la casse
        const matchesSearch = project.titre.toLowerCase().includes(this.search.toLowerCase());
        return matchesFilter && matchesSearch;
      });
    },
    sortedProjects() {
      // Trie les projets par date_debut (plus récent en premier)
      return [...this.projects].sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));
    },
},

  mounted() {
    this.fetchProjects();
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("fr-FR", options);
    },
     async fetchProjects() {
      try {
        const response = await axios.get("http://localhost:5000/admin/avancProject");
        this.projects = response.data.map((project) => ({
          ...project,
          formattedDate: this.formatDate(project.date_debut),
        }));

        for (let project of this.projects) {
          const taskResponse = await axios.get(
            `http://localhost:5000/admin/avancProject/${project.id_projet}/getTask`
          );
          project.tasks = taskResponse.data.map((task) => ({
            ...task,
            formattedDate: this.formatDate(task.date_debut),
          }));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
      }
    },

    async loadTasks(project) {
  // Basculer l'état de l'affichage des tâches
  project.showTasks = !project.showTasks;

  // Basculer l'état de l'icône de la flèche
  project.isOpen = !project.isOpen;

  if (!project.tasks) {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/avancProject/${project.id_projet}/getTask`
      );
      
      // Vérifiez la réponse de l'API
      console.log("Réponse de l'API:", response);

      // Vérifiez si les tâches sont présentes dans la réponse
      if (response.data && response.data.length > 0) {
        project.tasks = response.data.map((task) => ({
          ...task,
          formattedDate: this.formatDate(task.date_debut),
        }));

        // Vérification des détails de chaque tâche
        console.log("Détails des tâches pour le projet:", project.id_projet);
        project.tasks.forEach((task, index) => {
          console.log(`Tâche ${index + 1}:`, task);
        });
      } else {
        console.log("Aucune tâche trouvée pour ce projet.");
      }

    } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
    }
  }
},
    sortedTasks(tasks) {
      if (!tasks || tasks.length === 0) return [];
      // Trie les tâches par dateDebut (plus récent en premier)
      return [...tasks].sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));
    },
    getStatusColor(status) {
      return status === "À faire" ? "blue" : status === "En cours" ? "orange" : "green";
    },
    getTaskCount(id_projet) {
      const project = this.projects.find((p) => p.id_projet === id_projet);
      return project?.tasks?.length || 0;
    },
    viewDetails(project) {
      this.selectedProject = project;
      this.dialog = true;
    },
    getTasksByStatus(id_projet, status) {
  const project = this.projects.find((p) => p.id_projet === id_projet);
  if (!project || !project.tasks) {
    return []; // Renvoie un tableau vide si le projet ou les tâches n'existent pas
  }
  return project.tasks.filter(task => task.statut === status) || [];
}
,
  },
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

/* Assurez-vous que les styles fonctionnent sur d'autres navigateurs */
.scroll-container {
  scrollbar-width: none; /* Firefox : Cache la scrollbar */
  -ms-overflow-style: none; /* IE 10+ : Cache la scrollbar */
}
</style>
