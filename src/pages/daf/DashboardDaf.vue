<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <DafNav />
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
                  <DafAvatar />
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
                    <!-- Card pour les projets en cours -->
                    <v-col cols="12" sm="3">
                      <v-hover v-slot:default="{ isHovering }">
                      <v-card
                        class="pa-1 ma-3"
                        :elevation="isHovering ? 5 : 0"
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
                            >
                              {{ projectStats.projets_en_cours }}
                            </v-card-subtitle>
                          </v-col>
                          <v-col class="d-flex justify-end">
                            <v-btn
                              size="25"
                              rounded="xl"
                              icon
                              large
                              elevation="0"
                              style="background-color: #FFC107"
                            >
                              <v-icon small color="white" size="12"
                                >mdi-progress-clock</v-icon
                              >
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-card-text style="margin-bottom: -15px"
                          >En cours</v-card-text
                        >
                        <div style="margin-top: 2px; margin-left: 10px">
                          <v-btn
                            :prepend-icon="'mdi-open-in-new'"
                            variant="plain"
                            class="text-none"
                            style="font-size: 11px; color: grey"
                            >Voir projet</v-btn
                          >
                        </div>
                      </v-card>
                      </v-hover>
                    </v-col>

                    <!-- Card pour les projets terminés -->
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
                            >
                              {{ projectStats.projets_faire }}
                            </v-card-subtitle>
                          </v-col>
                          <v-col class="d-flex justify-end">
                            <v-btn
                              size="25"
                              rounded="xl"
                              icon
                              large
                              elevation="0"
                              style="background-color: #42A5F5"
                            >
                              <v-icon small color="white" size="12"
                                >mdi-checkbox-blank-circle-outline</v-icon
                              >
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-card-text style="margin-bottom: -15px"
                          >À faire</v-card-text
                        >
                        <div style="margin-top: 2px; margin-left: 10px">
                          <v-btn
                            :prepend-icon="'mdi-open-in-new'"
                            variant="plain"
                            class="text-none"
                            style="font-size: 11px; color: grey"
                            >Voir projet</v-btn
                          >
                        </div>
                      </v-card>
                    </v-col>

                    <!-- Card pour les projets proposés -->
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
                            >
                              {{ projectStats.projets_termine }}
                            </v-card-subtitle>
                          </v-col>
                          <v-col class="d-flex justify-end">
                            <v-btn
                              size="25"
                              rounded="xl"
                              icon
                              large
                              elevation="0"
                              style="background-color: #58d67ed7"
                            >
                              <v-icon small color="white" size="12"
                                >mdi-check-circle</v-icon
                              >
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-card-text style="margin-bottom: -15px"
                          >Terminé</v-card-text
                        >
                        <div style="margin-top: 2px; margin-left: 10px">
                          <v-btn
                            :prepend-icon="'mdi-open-in-new'"
                            variant="plain"
                            class="text-none"
                            style="font-size: 11px; color: grey"
                            >Voir projet</v-btn
                          >
                        </div>
                      </v-card>
                    </v-col>

                    <!-- Card pour le total des projets dans projetAvancement -->
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
                            >
                              {{ projectStats.total_avancement }}
                            </v-card-subtitle>
                          </v-col>
                          <v-col class="d-flex justify-end">
                            <v-btn
                              size="25"
                              rounded="xl"
                              icon
                              large
                              elevation="0"
                              style="background-color: #9E9E9E"
                            >
                              <v-icon small color="white" size="12"
                                >mdi-view-dashboard-outline</v-icon
                              >
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-card-text style="margin-bottom: -15px"
                          >Total projets</v-card-text
                        >
                        <div style="margin-top: 2px; margin-left: 10px">
                          <v-btn
                            :prepend-icon="'mdi-open-in-new'"
                            variant="plain"
                            class="text-none"
                            style="font-size: 11px; color: grey"
                            >Voir projet</v-btn
                          >
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
              elevation="0"
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
            <v-col cols="12" sm="12">
              <v-sheet class="pa-2 ma-2" style="border-radius: 10px">
                <StatAvanc/>
              </v-sheet>
            </v-col>
            <!-- pour le budget -->
            <!-- pour le budget -->
<v-col cols="12" sm="4">
    <v-sheet class="pa-2 ma-2" style="border-radius: 10px" :height="322">
      <v-container fluid>
        <v-row>
          <v-col cols="auto">
            <span style="font-size: 15px">Budget</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card
              class="pa-3"
              elevation="0"
              style="
                border-radius: 15px;
                color: black;
                background-color: #eaf7ef;
                height: 100%;
              "
            >
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="12">
                        <span>Total budget des projets</span>
                      </v-col>
                    </v-row>
                    <v-row align="center" style="margin-top: -15px;">
                      <v-col cols="8">
                        <span>{{ totalBudget }}$</span>
                      </v-col>
                      <v-col cols="4" class="text-right" style="margin-top: -5px;">
                        <v-icon @click="showDetails = !showDetails">mdi-chevron-down</v-icon>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>

        <v-expansion-panels v-if="showDetails" class="mt-2">
          <v-expansion-panel>
            <v-expansion-panel-content>
              <v-row>
                <v-container>
                  <v-col cols="12">
                    <div v-for="(budget, index) in budgets" :key="index">
                      <span style="font-size: 13px;">{{ budget.type_projet }}</span><br>
                      <span>{{ budget.total_budget }}$</span><br><br>
                    </div>
                  </v-col>
                </v-container>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-sheet>
  </v-col>

            <v-col cols="12" sm="4">
  <v-sheet class="pa-2 ma-2" style="border-radius: 10px;" :height="322">
    <v-container>
      <v-row>
        <v-col cols="10">
          <span style="font-size: 15px">Tâche effectuée par employé</span>
        </v-col>
        <v-col cols="2">
          <v-btn density="compact" icon="mdi-dots-horizontal"></v-btn>
        </v-col>
      </v-row>
      <br />
      <!-- Conteneur défilant -->
      <div style="height: 240px; overflow-y: auto; overflow-x: hidden; margin-left: 10px; padding-right: 8px;" class="containerScroll">
        <!-- Tâches d'aujourd'hui -->
        <span>Aujourd'hui</span>
        <v-row
          v-for="(item, index) in items"
          :key="index"
          align="center"
          style="margin-top: -30px;"
        >
          <v-container></v-container>
          <v-col cols="2">
            <v-avatar class="monAvatar" size="32">
              <v-img :src="item.img" />
            </v-avatar>
          </v-col>
          <v-col>
            <v-row>
              <span
                style="font-size: 12px; margin-left: 5px; color: grey;"
              >{{ item.name }}</span>
            </v-row>
            <v-row>
              <v-progress-linear
                :model-value="item.skill"
                color="#b6e9f8"
                height="8"
                background-color="transparent"
                rounded
                style="margin-top: 5px;"
              ></v-progress-linear>
            </v-row>
          </v-col>
          <v-col cols="auto">
            <span style="font-size: 15px;">{{ Math.ceil(item.skill) }}%</span>
          </v-col>
        </v-row>

        <!-- Tâches d'hier -->
        <div style="margin-top: 15px;">
          <span>Hier</span>
        </div>
        <v-row
          v-for="(item1, index1) in items1"
          :key="index1"
          align="center"
          style="margin-top: -20px;"
        >
          <v-container></v-container>
          <v-col cols="2">
            <v-avatar class="monAvatar" size="32">
              <v-img :src="item1.img" />
            </v-avatar>
          </v-col>
          <v-col>
            <v-row>
              <span
                style="font-size: 12px; margin-left: 5px; color: grey;"
              >{{ item1.name }}</span>
            </v-row>
            <v-row>
              <v-progress-linear
                :model-value="item1.skill"
                color="#b6e9f8"
                height="8"
                background-color="transparent"
                rounded
                style="margin-top: 5px;"
              ></v-progress-linear>
            </v-row>
          </v-col>
          <v-col cols="auto">
            <span style="font-size: 15px;">{{ Math.ceil(item1.skill) }}%</span>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-sheet>
</v-col>


            <!-- Pour les nouveaus -->
            <v-col cols="12" sm="4">
              <v-sheet class="pa-2 ma-2" style="border-radius: 10px" :height="322">
                <v-container>
                  <v-row>
                    <v-col cols="auto">
                     <span style="font-size: 15px"
                        >Nouveaux récents</span
                      >
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row no-gutters>
            
          </v-row>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import DafNav from "../../components/daf/DafNav.vue";
import DafAvatar from "../../components/daf/DafAvatar.vue";
import UserStatCompo from "../../components/admin/UserStatCompo.vue";

import StatAvanc from '../../components/admin/statAvanc.vue';
import axios from 'axios';

export default {
  components: {
    DafNav,
    DafAvatar,
    UserStatCompo,
    StatAvanc,
  },
  data() {
    return {
      showDetails: false,
      totalBudget: 0,
      budgets: [],
     
      projectStats: {
        projets_en_cours: 0,
        projets_termine: 0,
        projets_faire: 0,
        total_avancement: 0,
      },
      items: [
      ],
      items1: [
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
  this.fetchProjectStats();
  this.fetchBudgetData();
  this.fetchEmployeeStats();
  this.fetchEmployeeStatsPrevious();
},
  watch: {
    selectedProject(newProject) {
      this.series[0].data = this.projectTasks[newProject];
    },
  },
  created() {
    this.fetchProjectStats();
  },
  methods: {
     async fetchBudgetData() {
      try {
        const response = await axios.get('http://localhost:5000/admin/budget');
        const budgetData = response.data.budgets;

        // Récupérer le budget total et les budgets par type
        this.totalBudget = budgetData.find(b => b.type_projet === 'Tous').total_budget || 0;
        this.budgets = budgetData.filter(b => b.type_projet !== 'Tous');
      } catch (error) {
        console.error("Erreur lors de la récupération des données de budget:", error);
      }
    },
    async fetchProjectStats() {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/statProject"
        ); // Remplace avec le bon endpoint
        console.log("Données de projet:", response.data); // Log des données
        this.projectStats = { ...response.data };

      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques de projet:",
          error
        );
      }
    },
    async fetchEmployeeStats() {
  try {
      const response = await axios.get("http://localhost:5000/admin/employeStat");
      console.log("Données des employés aujourd'hui:", response.data);
      const baseUrl = "http://localhost:5000/";
      this.items = response.data.map(item => ({
          name: item.nom_complet,
          skill: item.avancement_moyen,
          img: item.profile_employe ? `${baseUrl}${item.profile_employe}` : 'default-profile.jpg'
      }));
  } catch (error) {
      console.error("Erreur lors de la récupération des statistiques des employés :", error.message);
  }
}
,
async fetchEmployeeStatsPrevious() {
  try {
      const response = await axios.get("http://localhost:5000/admin/employeStatPrevious");
      console.log("Données des employés hier:", response.data);
      const baseUrl = "http://localhost:5000/";
      this.items1 = response.data.map(item1 => ({
          name: item1.nom_complet,
          skill: item1.avancement_moyen,
          img: item1.profile_employe ? `${baseUrl}${item1.profile_employe}` : 'default-profile.jpg'
      }));
  } catch (error) {
      console.error("Erreur lors de la récupération des statistiques des employés :", error.message);
  }
}

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
.containerScroll::-webkit-scrollbar {
  width: 6px;
}

.containerScroll::-webkit-scrollbar-thumb {
  background-color: #edf0fa; /* Couleur de la barre */
  border-radius: 10px;
}

.containerScroll::-webkit-scrollbar-thumb:hover {
  background-color: #ececec; /* Couleur de la barre lors du survol */
}
</style>
