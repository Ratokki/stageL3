<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <AdminNav />
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
                  <p class="monTitle">Tableau de bord</p>
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

          <!-- Project Cards -->
          <v-row no-gutters style="margin-top: 7px">
            <v-col cols="12" sm="8">
              <v-sheet
                class="pa-2 ma-2"
                elevation="0"
                style="border-radius: 10px"
              >
                <span style="font-size: 15px; margin-left: 10px"
                  >Nombre de projet</span
                >
                <v-container>
                  <v-row no-gutters>
                    <!-- Card 1 -->
                    <v-col cols="12" sm="3">
                      <v-card
                        class="pa-1 ma-3"
                        elevation="0"
                        style="
                          border-radius: 15px;
                          color: black;
                          background-color: #eaf7ef;
                        "
                      >
                        <v-row
                          class="d-flex justify-space-between align-center"
                        >
                          <v-col class="d-flex align-center">
                            <v-card-subtitle
                              style="
                                font-weight: bold;
                                margin-bottom: -8px;
                                font-size: 20px;
                              "
                              >2</v-card-subtitle
                            >
                          </v-col>
                          <v-col class="d-flex justify-end">
                            <v-btn
                              size="x-small"
                              rounded="xl"
                              icon
                              large
                              elevation="0"
                              style="background-color: #ff8a80"
                            >
                              <v-icon small color="white"
                                >mdi-cash-multiple</v-icon
                              >
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-card-text style="margin-bottom: -15px"
                          >En cours</v-card-text
                        >
                        <div style="margin-top: 10px; margin-left: 10px">
                          <v-icon color="success">mdi-trending-up</v-icon>
                          <span style="font-size: 13px; color: green">50%</span>
                        </div>
                      </v-card>
                    </v-col>
                    <!-- Card 2 -->
                    <v-col cols="12" sm="3">
                      <v-card
                        class="pa-1 ma-3"
                        elevation="0"
                        style="
                          border-radius: 15px;
                          color: black;
                          background-color: #eaf7ef;
                        "
                      >
                        <v-row
                          class="d-flex justify-space-between align-center"
                        >
                          <v-col class="d-flex align-center">
                            <v-card-subtitle
                              style="
                                font-weight: bold;
                                margin-bottom: -8px;
                                font-size: 20px;
                              "
                              >3</v-card-subtitle
                            >
                          </v-col>
                          <v-col class="d-flex justify-end">
                            <v-btn
                              size="x-small"
                              rounded="xl"
                              icon
                              large
                              elevation="0"
                              style="background-color: #58d67ed7"
                            >
                              <v-icon small color="white"
                                >mdi-cash-multiple</v-icon
                              >
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-card-text style="margin-bottom: -15px"
                          >Terminé</v-card-text
                        >
                        <div style="margin-top: 10px; margin-left: 10px">
                          <v-icon color="success">mdi-trending-up</v-icon>
                          <span style="font-size: 13px; color: green">50%</span>
                        </div>
                      </v-card>
                    </v-col>
                    <!-- Card 3 -->
                    <v-col cols="12" sm="3">
                      <v-card
                        class="pa-1 ma-3"
                        elevation="0"
                        style="
                          border-radius: 15px;
                          color: black;
                          background-color: #eaf7ef;
                        "
                      >
                        <v-row
                          class="d-flex justify-space-between align-center"
                        >
                          <v-col class="d-flex align-center">
                            <v-card-subtitle
                              style="
                                font-weight: bold;
                                margin-bottom: -8px;
                                font-size: 20px;
                              "
                              >5</v-card-subtitle
                            >
                          </v-col>
                          <v-col class="d-flex justify-end">
                            <v-btn
                              size="x-small"
                              rounded="xl"
                              icon
                              large
                              elevation="0"
                              style="background-color: #ffa726"
                            >
                              <v-icon small color="white"
                                >mdi-cash-multiple</v-icon
                              >
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-card-text style="margin-bottom: -15px"
                          >Proposé</v-card-text
                        >
                        <div style="margin-top: 10px; margin-left: 10px">
                          <v-icon color="success">mdi-trending-up</v-icon>
                          <span style="font-size: 13px; color: green">50%</span>
                        </div>
                      </v-card>
                    </v-col>
                    <!-- Card 4 -->
                    <v-col cols="12" sm="3">
                      <v-card
                        class="pa-1 ma-3"
                        elevation="0"
                        style="
                          border-radius: 15px;
                          color: black;
                          background-color: #eaf7ef;
                        "
                      >
                        <v-row
                          class="d-flex justify-space-between align-center"
                        >
                          <v-col class="d-flex align-center">
                            <v-card-subtitle
                              style="
                                font-weight: bold;
                                margin-bottom: -8px;
                                font-size: 20px;
                              "
                              >10</v-card-subtitle
                            >
                          </v-col>
                          <v-col class="d-flex justify-end">
                            <v-btn
                              size="x-small"
                              rounded="xl"
                              icon
                              large
                              elevation="0"
                              style="background-color: #ff8a80"
                            >
                              <v-icon small color="white"
                                >mdi-cash-multiple</v-icon
                              >
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-card-text style="margin-bottom: -15px"
                          >Total projets</v-card-text
                        >
                        <div style="margin-top: 10px; margin-left: 10px">
                          <v-icon color="success">mdi-trending-up</v-icon>
                          <span style="font-size: 13px; color: green">50%</span>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
            </v-col>

            <!-- Task Statistics -->
            <v-col cols="12" sm="4">
              <v-sheet
                height="210"
                class="pa-2 ma-2"
                style="border-radius: 10px"
              >
                <v-container>
                  <v-row>
                    <span style="font-size: 15px; margin-left: 10px"
                      >Nombres d'utilisateurs</span
                    >
                  </v-row>
                  <v-row>
                    <UserStatCompo />
                  </v-row>
                </v-container>
              </v-sheet>
            </v-col>
          </v-row>

          <!-- Project Progress Chart -->
          <v-row no-gutters>
            <v-col cols="12" sm="8">
              <v-sheet
                class="pa-2 ma-2"
                elevation="0"
                style="border-radius: 10px"
              >
                <v-row>
                  <!-- Select field pour choisir le projet -->
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="selectedProject"
                      :items="projects"
                      label="Choisir un projet"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
                <!-- Graphique de l'avancement des tâches -->
                <v-row>
                  <v-col cols="12" sm="8">
                    <apexchart
                      type="bar"
                      :options="chartOptions"
                      :series="series"
                      :width="350"
                    ></apexchart>
                  </v-col>
                  <v-col cols="12" sm="4">
  <div style="position: relative; display: flex; justify-content: center; align-items: center;">
    <v-progress-circular
      :model-value="progressPercentage"
      color="#58d67ed7"
      size="135"
      width="12"
      rotate="-90"
    ></v-progress-circular>
    <span style="position: absolute; text-align: center; color: black; font-size: 13px;">
      Avancement <br>
      <span style="font-size: 20px ; color: black;">{{ progressPercentage }}%</span>
    </span>
  </div>
</v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <div id="map" style="height: 300px"></div>
                  </v-col>
                  <!-- je veux que tu montre le map ici  -->
                </v-row>
              </v-sheet>
            </v-col>

            <v-col cols="12" sm="4">
              <v-sheet class="pa-2 ma-2" style="border-radius: 10px">
                <v-container>
                  <v-row>
                    <v-col cols="10">
                      <span style="font-size: 15px"
                        >Tâche effectué par employé</span
                      >
                    </v-col>
                    <v-col cols="2">
                      <v-btn
                        density="compact"
                        icon="mdi-dots-horizontal"
                      ></v-btn>
                    </v-col>
                  </v-row>
                  <br />
                  <div>
                    <v-row
                      v-for="(item, index) in items"
                      :key="index"
                      align="center"
                    >
                      <v-col cols="2">
                        <v-avatar class="monAvatar" size="32">
                          <v-img
                            :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.img}`"
                          />
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <v-row>
                          <span
                            style="
                              font-size: 12px;
                              margin-left: 5px;
                              color: grey;
                            "
                            >{{ item.name }}</span
                          >
                        </v-row>
                        <v-row>
                          <v-progress-linear
                            :model-value="item.skill"
                            color="#b6e9f8"
                            height="8"
                            background-color="transparent"
                            rounded
                            style="margin-top: 5px"
                          ></v-progress-linear>
                        </v-row>
                      </v-col>
                      <v-col cols="auto">
                        <span style="font-size: 15px"
                          >{{ Math.ceil(item.skill) }}%</span
                        >
                      </v-col>
                    </v-row>
                  </div>
                </v-container>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AdminNav from "../../components/admin/AdminNav.vue";
import UserStatCompo from "../../components/admin/UserStatCompo.vue";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    AdminNav,
    UserStatCompo,
    apexchart: VueApexCharts, // Enregistrement local de ApexCharts
  },
  data() {
    return {
      items: [
        {
          name: "Employé 1",
          img: "1.png", // Assurez-vous que les images existent et sont accessibles
          skill: 75, // Niveau de progression de la tâche en pourcentage
        },
        {
          name: "Employé 2",
          img: "2.png",
          skill: 50,
        },
        {
          name: "Employé 3",
          img: "3.png",
          skill: 90,
        },
      ],
      projects: ["Projet A", "Projet B", "Projet C", "Projet D"],
      selectedProject: "Projet A", // Projet par défaut
      projectTasks: {
        "Projet A": [5, 8, 12],
        "Projet B": [8, 7, 10],
        "Projet C": [4, 12, 9],
        "Projet D": [2, 6, 8],
      },
      projectLocations: {
        "Projet A": [48.858844, 2.294351], // Tour Eiffel, Paris
        "Projet B": [51.5074, -0.1278], // Londres
        "Projet C": [40.7128, -74.006], // New York
        "Projet D": [34.0522, -118.2437], // Los Angeles
      },
      series: [
        {
          name: "Tâches",
          data: [5, 8, 12], // Tâches pour le projet A par défaut
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 200,
        },
        plotOptions: {
          bar: {
            barHeight: "10%",
            columnWidth: "30%",
            borderRadius: 10,
            vertical: true,
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val;
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },
        xaxis: {
          categories: ["À faire", "En cours", "Terminé"],
        },
      },
      progressPercentage: 0, // Pourcentage de progression à calculer
    };
  },
  mounted() {
    this.calculateProgress();
    this.initMap();
  },
  watch: {
    selectedProject(newProject) {
      this.series[0].data = this.projectTasks[newProject];
      this.calculateProgress();
      this.updateMap(newProject); // Met à jour la carte lorsque le projet change
    },
  },
  methods: {
    calculateProgress() {
      const tasks = this.projectTasks[this.selectedProject];
      const totalTasks = tasks.reduce((sum, value) => sum + value, 0);
      const completedTasks = tasks[2]; // "Terminé" est à l'index 2
      this.progressPercentage = ((completedTasks / totalTasks) * 100).toFixed(
        2
      );
    },
    
    initMap() {
      this.map = L.map("map").setView(
        this.projectLocations[this.selectedProject],
        10
      ); // Initialiser la carte
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      this.updateMap(this.selectedProject); // Afficher le lieu du projet par défaut
    },
    updateMap(project) {
      const [lat, lng] = this.projectLocations[project];
      this.map.setView([lat, lng], 10); // Mettre à jour la vue de la carte
      L.marker([lat, lng]).addTo(this.map).bindPopup(`${project}`).openPopup(); // Ajouter un marqueur
    },
  },
};
</script>

<style scoped>
.battery-bar {
  background-color: grey; /* Couleur du fond de la batterie */
  border: 1px solid black; /* Bordure pour imiter l'effet de batterie */
  border-radius: 6px;
  position: relative;
}

.battery-percentage {
  position: absolute;
  right: 10px;
  top: -5px;
  color: white;
}
#map {
  height: 400px; /* Ajuster la hauteur de la carte */
  width: 100%; /* S'assurer que la carte occupe toute la largeur */
}
</style>
