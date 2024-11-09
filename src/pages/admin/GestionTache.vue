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
      <v-container fluid class="px-6 mt-n2" style="margin-top: -8px">
        <v-col cols="12" style="margin-top: -8px">
          <v-card elevation="0" style="background-color: white; border-radius: 10px; margin-top: -25px">
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
                          <v-card-subtitle>Débuté le : {{ project.date_debut }}</v-card-subtitle>
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
                            color="green"
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
                                    <v-card elevation="3" style="border-radius: 15px">
                                      <br>
                                      <span style="font-weight: bold; font-size: 16px; margin-left: 15px; margin-top: -15px;">Titre : {{ task.titre }}</span>
                                      <v-card-subtitle class="task-description" style="margin-top: 10px;">
                                        Description : <br />
                                        {{ task.descr }}
                                      </v-card-subtitle>
                                      <v-card-subtitle style="margin-top: 8px">Débuté le : {{ task.dateDebut }}</v-card-subtitle>
                                      <v-chip :color="getStatusColor(task.statut)" small dark class="justify-center" style="margin-top: 8px; margin-left: 15px;">
                                        {{ task.statut }}
                                      </v-chip>
                                      <br><br>
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
                                    <v-card elevation="3" style="border-radius: 15px">
                                      <br>
                                      <span style="font-weight: bold; font-size: 16px; margin-left: 15px; margin-top: -15px;">Titre : {{ task.titre }}</span>
                                      <v-card-subtitle class="task-description" style="margin-top: 10px;">
                                        Description : <br />
                                        {{ task.descr }}
                                      </v-card-subtitle>
                                      <v-card-subtitle style="margin-top: 8px">Débuté le : {{ task.dateDebut }}</v-card-subtitle>
                                      <v-chip :color="getStatusColor(task.statut)" small dark class="justify-center" style="margin-top: 8px; margin-left: 15px;">
                                        {{ task.statut }}
                                      </v-chip>
                                      <br><br>
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
                                    <v-card elevation="3" style="border-radius: 15px">
                                      <br>
                                      <span style="font-weight: bold; font-size: 16px; margin-left: 15px; margin-top: -15px;">Titre : {{ task.titre }}</span>
                                      <v-card-subtitle class="task-description" style="margin-top: 10px;">
                                        Description : <br />
                                        {{ task.descr }}
                                      </v-card-subtitle>
                                      <v-card-subtitle style="margin-top: 8px">Débuté le : {{ task.dateDebut }}</v-card-subtitle>
                                      <v-chip :color="getStatusColor(task.statut)" small dark class="justify-center" style="margin-top: 8px; margin-left: 15px;">
                                        {{ task.statut }}
                                      </v-chip>
                                      <br><br>
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
    return this.projects.filter((project) => {
      const matchesFilter =
        this.selectedFilter === "Tous les projets" ||
        project.statut.toLowerCase() === this.selectedFilter.toLowerCase(); // Ignore la casse
      const matchesSearch = project.titre.toLowerCase().includes(this.search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  },
},

  mounted() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await axios.get("http://localhost:5000/admin/avancProject");
        this.projects = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
      }
    },
    async loadTasks(project) {
      project.showTasks = !project.showTasks;
      if (!project.tasks) {
        try {
          const response = await axios.get(
            `http://localhost:5000/admin/avancProject/${project.id_projet}/getTask`
          );
          project.tasks = response.data;
          console.log(`Tâches pour le projet ${project.id_projet}:`, project.tasks);
        } catch (error) {
          console.error("Erreur lors de la récupération des tâches:", error);
        }
      }
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
