<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <AdminNav/>
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <v-col cols="12">
          <v-card
            height="58"
            elevation="0"
            style="background-color: white; border-radius: 10px"
          >
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-col cols="10">
                  <p class="monTitle">Tâches du projet</p>
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
              </v-row>
              <v-row style="margin-top: -30px">
                <v-col cols="12">
                  <v-card
                    v-for="project in filteredAndSearchedProjects"
                    :key="project.idproject"
                    class="mb-4"
                  >
                    <v-container>
                      <v-row align="center">
                        <v-col cols="12" sm="8" style="margin-left: -15px">
                          <v-card-title>Titre : {{ project.name }}</v-card-title>
                        </v-col>
                        <v-col cols="12" sm="3" style="margin-left: -15px">
                          <v-card-subtitle>Débuté le : {{ project.dateDebut }}</v-card-subtitle>
                        </v-col>
                        <v-col cols="12" sm="1" style="margin-left: -5px">
                          <v-chip :color="getStatusColor(project.status)" small dark class="justify-center">
                            {{ project.status }}
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-card-subtitle>Nombre de tâches : {{ getTaskCount(project.idproject) }}</v-card-subtitle>
                    <v-row align="center">
                      <v-col cols="11">
                        <v-card-actions>
                          <v-btn
                            class="text-none"
                            color="green"
                            rounded="xl"
                            @click="project.showTasks = !project.showTasks"
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

                      <!-- Détails du projet sélectionné dans un modal -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>Détails du projet : {{ selectedProject?.name }}</v-card-title>
          <v-card-subtitle>Statut : {{ selectedProject?.status }}</v-card-subtitle>
          <v-card-subtitle>Date de début : {{ selectedProject?.dateDebut }}</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <h4>Tâches associées :</h4>
            <v-list>
              <v-list-item-group>
                <v-list-item
                  v-for="task in getTasks(selectedProject?.idproject)"
                  :key="task.id"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ task.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ task.descr }} - Statut : {{ task.status }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="dialog = false">Fermer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
                    </v-row>

                    <v-expand-transition>
                      <div v-show="project.showTasks">
                        <v-divider></v-divider>
                        <v-container>
                          <v-row>
                            <v-col cols="12" style="margin-top: 10px;">
                              <span style="margin-left: 15px; font-size: 20px;">Tâches en cours</span>
                              <template v-if="getTasksByStatus(project.idproject, 'En cours').length">
                                <v-row style="margin-top: 10px;">
                                  <v-col
                                    v-for="task in sortedTasks(getTasksByStatus(project.idproject, 'En cours'))"
                                    :key="task.id"
                                    cols="12"
                                    sm="4"
                                  >
                                    <v-card elevation="3" style="border-radius: 15px">
                                      <br>
                                      <span style="font-weight: bold; font-size: 16px; margin-left: 15px; margin-top: -15px;">Titre : {{ task.name }}</span>
                                      <v-card-subtitle class="task-description" style="margin-top: 10px;">
                                        Description : <br />
                                        {{ task.descr }}
                                      </v-card-subtitle>
                                      <v-card-subtitle style="margin-top: 8px">Débuté le : {{ task.dateDebut }}</v-card-subtitle>
                                      <v-chip :color="getStatusColor(task.status)" small dark class="justify-center" style="margin-top: 8px; margin-left: 15px;">
                                        {{ task.status }}
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
                              <template v-if="getTasksByStatus(project.idproject, 'À faire').length">
                                <v-row style="margin-top: 10px;">
                                  <v-col
                                    v-for="task in sortedTasks(getTasksByStatus(project.idproject, 'À faire'))"
                                    :key="task.id"
                                    cols="12"
                                    sm="4"
                                  >
                                    <v-card elevation="3" style="border-radius: 15px">
                                      <br>
                                      <span style="font-weight: bold; font-size: 16px; margin-left: 15px; margin-top: -15px;">Titre : {{ task.name }}</span>
                                      <v-card-subtitle class="task-description" style="margin-top: 10px;">
                                        Description : <br />
                                        {{ task.descr }}
                                      </v-card-subtitle>
                                      <v-card-subtitle style="margin-top: 8px">Débuté le : {{ task.dateDebut }}</v-card-subtitle>
                                      <v-chip :color="getStatusColor(task.status)" small dark class="justify-center" style="margin-top: 8px; margin-left: 15px;">
                                        {{ task.status }}
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
                              <template v-if="getTasksByStatus(project.idproject, 'Terminé').length">
                                <v-row style="margin-top: 10px;">
                                  <v-col
                                    v-for="task in sortedTasks(getTasksByStatus(project.idproject, 'Terminé'))"
                                    :key="task.id"
                                    cols="12"
                                    sm="4"
                                  >
                                    <v-card elevation="3" style="border-radius: 15px">
                                      <br>
                                      <span style="font-weight: bold; font-size: 16px; margin-left: 15px; margin-top: -15px;">Titre : {{ task.name }}</span>
                                      <v-card-subtitle class="task-description" style="margin-top: 10px;">
                                        Description : <br />
                                        {{ task.descr }}
                                      </v-card-subtitle>
                                      <v-card-subtitle style="margin-top: 8px">Débuté le : {{ task.dateDebut }}</v-card-subtitle>
                                      <v-chip :color="getStatusColor(task.status)" small dark class="justify-center" style="margin-top: 8px; margin-left: 15px;">
                                        {{ task.status }}
                                      </v-chip>
                                      <br><br>
                                    </v-card>
                                  </v-col>
                                </v-row>
                              </template>
                              <template v-else>
                                <br><br>
                                <span style="font-size: 12px; font-style: italic; color: #b9c3c4; margin-left: 20px; margin-top: 20px;">Pas de tâche effectuée en ce moment.</span>
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
import AdminNav from "../../components/admin/AdminNav.vue";

export default {
  components: {
    AdminNav,
  },
  data() {
    return {
      dialog: false, // Pour contrôler l'affichage du modal
      selectedProject: null,
      selectedFilter: "Projet en cours",
      filterOptions: [
        "Projet en cours",
        "Projet à faire",
        "Projet terminé",
        "Tous les projets",
      ],
      search: "",  // Ajout du champ de recherche
      items1: [
        {
          idproject: "1",
          name: "Développement local",
          status: "En cours",
          dateDebut: "2024-10-02",
          showTasks: false,
        },
        {
          idproject: "2",
          name: "Assainissement de l'eau",
          status: "Terminé",
          dateDebut: "2024-09-05",
          showTasks: false,
        },
        {
          idproject: "3",
          name: "Le droit foncier",
          status: "À faire",
          dateDebut: "2024-10-05",
          showTasks: false,
        },
      ],
      tasks: [
        {
          id: 1,
          idproject: "1",
          name: "Analyser les besoins",
          status: "Terminé",
          descr: "C'est l'analyse des besoins sur notre projet",
          dateDebut: "2024-10-01",
          priority: "haute",
        },
        {
          id: 2,
          idproject: "1",
          name: "Développement",
          status: "En cours",
          descr: "C'est le développement de notre territoire",
          dateDebut: "2024-04-15",
          priority: "moyenne",
        },
        {
          id: 3,
          idproject: "2",
          name: "Inspection",
          status: "Terminé",
          descr: "C'est l'inspection de notre territoire",
          dateDebut: "2024-04-15",
          priority: "basse"
        },
        {
          id: 4,
          idproject: "3",
          name: "Évaluation légale",
          status: "À faire",
          descr: "C'est l'évaluation légale de notre territoire",
          dateDebut: "2024-04-15",
          priority: "haute",
        },
        {
          id: 5,
          idproject: "1",
          name: "Priorisation de developpment",
          status: "En cours",
          descr: "C'est l'évaluation légale de notre territoire",
          dateDebut: "2024-04-15",
          priority: "basse",
        },
      ],
    };
  },
  computed: {
    filteredProjects() {
      return this.items1.filter((project) => {
        switch (this.selectedFilter) {
          case "Projet en cours":
            return project.status === "En cours";
          case "Projet à faire":
            return project.status === "À faire";
          case "Projet terminé":
            return project.status === "Terminé";
          case "Tous les projets":
            return true;
          default:
            return true;
        }
      });
    },
    filteredAndSearchedProjects() {
      return this.filteredProjects.filter((project) => {
        return project.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  methods: {
    getTaskCount(idproject) {
      return this.tasks.filter((task) => task.idproject === idproject).length;
    },
    getTasks(idproject) {
      return this.tasks.filter((task) => task.idproject === idproject);
    },
    getTasksByStatus(idproject, status) {
      return this.tasks.filter(
        (task) => task.idproject === idproject && task.status === status
      );
    },
    sortedTasks(tasks) {
      const priorityOrder = { "haute": 1, "moyenne": 2, "basse": 3 };
      return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    },
    getStatusColor(status) {
      switch (status) {
        case "À faire":
          return "blue";
        case "En cours":
          return "orange";
        case "Terminé":
          return "green";
        default:
          return "grey";
      }
    },
    viewDetails(project) {
      this.selectedProject = project; // Met à jour le projet sélectionné
      this.dialog = true; // Ouvre le modal
    },
  },
};
</script>

<style>
.NavBarTest {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.task-description {
  white-space: normal;
  overflow-wrap: break-word;
}
</style>
