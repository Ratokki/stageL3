<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="3">
        <v-select
  v-model="select"
  :hint="selectedProjectHint"
  :items="projects"
  item-title="titre"           
  item-value="id_projet" 
  label="Choisir un projet"
  @change="displaySelectedProject"
  variant="outlined"
  color="primary"
  persistent-hint
></v-select>
         
      </v-col>

      <v-col cols="auto" v-if="projectDetails.priorite">
        <span style="font-size: 14px;">
          Priorité : <span style="color: grey; font-style: italic">{{ projectDetails.priorite }}</span>
        </span>
      </v-col>
      <v-col cols="auto" v-if="projectDetails.date_debut">
        <span style="font-size: 14px;">
          Débuté le: <span style="color: grey; font-style: italic">{{ projectDetails.date_debut }}</span>
        </span>
      </v-col>
      <v-col cols="auto" v-if="projectDetails.date_echeance">
        <span style="font-size: 14px;">
          Fini le : <span style="color: grey; font-style: italic">{{ projectDetails.date_echeance }}</span>
        </span>
      </v-col>
      <v-col cols="auto" v-if="projectDetails.statut_avancement">
        <span style="font-size: 14px;">
          Statut :
          <v-chip
            :color="getStatusColor(projectDetails.statut_avancement)"
            small
            dark
            class="justify-center"
          >
            {{ projectDetails.statut_avancement }}
          </v-chip>
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters>

      <v-col cols="12" sm="8" style="margin-top: 20px;">
        <v-row>
          <v-col cols="12" sm="7">        
        <div ref="echartBar" class="echart-container"></div>
      </v-col>
      
      <v-col cols="12" sm="5" style="margin-top: 5px;">
        <v-card
          class="pa-1 ma-3"
          elevation="0"
          style="border-radius: 15px; color: black; background-color: #eaf7ef;"
          :width="auto"
        >
          <v-container>
            <span>Progrès</span><br />
            <div style="display: flex; align-items: center">
              <v-progress-linear
                v-model="projectDetails.pourcentage_avancement"
                color="#b6e9f8"
                height="8"
                rounded
                style="flex: 1; margin-top: 5px"
                v-if="projectDetails.pourcentage_avancement"
              ></v-progress-linear>
              <span
                v-if="projectDetails.pourcentage_avancement !== 'Non spécifié' && !isNaN(projectDetails.pourcentage_avancement)"
              >
                {{ Math.ceil(projectDetails.pourcentage_avancement) }}%
              </span>
            </div>
            <br />
            <v-row>
              <v-container style="margin-top: -15px">
                <span>Retard</span>
                <v-card-subtitle v-if="projectDetails.total_retard" style="margin-left: -15px">
                  {{ projectDetails.total_retard }} heures
                </v-card-subtitle>
              </v-container>
            </v-row>
            <v-row>
              <v-container style="margin-top: -20px">
                <span>Durée tâche</span>
                <v-card-subtitle v-if="projectDetails.total_duree" style="margin-left: -15px">
                  {{ projectDetails.total_duree }}
                </v-card-subtitle>
              </v-container>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
        </v-row>
        <v-row style="margin-top: -45px;">
          <v-col cols="12" sm="12">
            <v-sheet
          class="pa-1 ma-3"
          elevation="0"
          style="border-radius: 15px; color: black; background-color: #eaf7ef"
          :width="auto"
          :height="auto"
        >
          <v-col cols="12" sm="5" style="margin-top: 5px;">
            <div ref="echartPie" class="echart-container"></div>
          </v-col>
        </v-sheet>
          </v-col>
        </v-row>
      </v-col>
      
      <v-col cols="12" sm="3" style="margin-left: 15px; margin-top: 12px;">
        <v-date-picker
  class="small-date-picker"
  elevation="2"
  @update:model-value="onDateSelected"
  :day-class="highlightStartDate"
></v-date-picker>
      </v-col>
      
    </v-row>

    
    <v-row no-gutters style="margin-top: -15px;">
      <v-col cols="11">
        <v-card-actions>
          <v-btn
            class="text-none"
            color="green"
            rounded="xl"
            @click="showTasks = !showTasks"
            variant="text"
          >
            Voir tâches
            <v-icon left>
              {{ showTasks ? "mdi-chevron-up" : "mdi-chevron-down" }}
            </v-icon>
            <span v-if="projectTasks.length > 0"> (Total : {{ projectTasks.length }})</span>
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>

    <v-expansion-panels class="mt-4" v-if="showTasks">
      <v-expansion-panel>
        <v-expansion-panel-content>
          <v-data-table :items="projectTasks" class="elevation-1" hide-default-footer>
            <template v-slot:item.progress="{ item }">
              <v-progress-circular :value="item.pourcentage_avancement" color="blue" size="50" width="5">
                {{ item.pourcentage_avancement }}%
              </v-progress-circular>
            </template>
            <template v-slot:item.date_debut="{ item }">
              {{ item.date_debut || 'Non défini' }}
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
//import taskCountCompo from './taskCountCompo.vue';

export default {
  /*components: {
    taskCountCompo
  },*/
  data() {
    return {
      selectedDate: null,
      select: null, // Variable pour v-model du sélecteur
      projects: [], // Liste des projets
      projectTasks: [],
      showTasks: false,
      projectDetails: {
         titre: '',
        sigle: '',
        priorite: 'Non spécifié',
        date_debut: null,
        date_echeance: 'Non spécifié',
        statut_avancement: 'Non spécifié',
        total_retard: 'Non spécifié',
        total_duree: 'Non spécifié',
        pourcentage_avancement: 'Non spécifié',
      },
      barChartOptions: {
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] },
        yAxis: { type: "value" },
        series: [{
          type: "bar",
          barWidth: "45%",
          showBackground: true,
          backgroundStyle: {
            color: "#eaf7ef",
            borderRadius: 20
          },
          data: [0, 0, 0, 0, 0, 0, 0], // Par défaut à 0 pour chaque jour
          itemStyle: {
            color: "#58d67ed7",
            borderRadius: 20 // Applique le border-radius de 20px
          },
        }],
      },
      pieChartOptions: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "5%",
          left: "center",
        },
        series: [
          {
            name: "Statut des tâches",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: true,
              position: "outside",
              formatter: "{b}: {d}%",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "18",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: [], // Données à mettre à jour dynamiquement
          },
        ],
      },
      pieChartInstance: null,
    };
  },
  mounted() {
    this.fetchProjects();
    this.fetchTaskStatusData();
  },
  watch: {
    select(newVal) {
      this.displaySelectedProject();
      this.fetchTaskStatusData();
    },
  },
  computed: {
  selectedProjectHint() {
    const selectedProject = this.projects.find(project => project.id_projet === this.select);
    return selectedProject ? `${selectedProject.sigle}, ${selectedProject.titre}` : '';
  },
},
  methods: {
    async onDateSelected(date) {
      console.log("Date sélectionnée :", date);
      this.selectedDate = date;
      await this.fetchDailyProgress(date);
    },
    async fetchDailyProgress(date) {
      if (!this.select) return;

      try {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        const response = await axios.get(`http://localhost:5000/admin/project/daily-progress`, {
          params: {
            id_projet: this.select,
            date: formattedDate,
          },
        });

        // Détermine le jour de la semaine (0 = Dimanche, 1 = Lundi, etc.)
        const dayIndex = new Date(date).getDay();
        
        // Met à jour le graphique en plaçant le pourcentage d'avancement pour le jour correct
        this.updateWeeklyProgressChart(response.data, dayIndex);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'avancement journalier :", error);
      }
    },
    
    async fetchWeeklyProgress() {
      if (!this.select) return;

      try {
        const response = await axios.get(`http://localhost:5000/admin/project/weekly-progress`, {
          params: { id_projet: this.select },
        });
        this.updateWeeklyProgressChart(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'avancement hebdomadaire :", error);
      }
    },
    updateWeeklyProgressChart(progressData, dayIndex = null) {
      console.log("Données pour mise à jour du graphique :", progressData);

      const progressPercentage = [0, 0, 0, 0, 0, 0, 0];

      if (dayIndex !== null) {
        // Si dayIndex est défini, mettre le pourcentage uniquement pour le jour sélectionné
        progressPercentage[dayIndex] = progressData.pourcentage_avancement || 0;
      } else {
        // Sinon, affiche l'avancement pour chaque jour de la semaine
        progressData.forEach((entry, index) => {
          progressPercentage[index] = entry.pourcentage_avancement_jour || 0;
        });
      }

      this.barChartOptions.series[0].data = progressPercentage;

      this.$nextTick(() => {
        const chartDom = this.$refs.echartBar;
        if (!this.myChart) {
          this.myChart = echarts.init(chartDom);
        } else {
          this.myChart.dispose();
          this.myChart = echarts.init(chartDom);
        }
        this.myChart.setOption(this.barChartOptions);
      });
    },
    async fetchProjects() {
  try {
    const response = await axios.get('http://localhost:5000/admin/project');
    console.log("Données des projets reçues :", response.data);

    if (!Array.isArray(response.data) || !response.data.every(item => typeof item === 'object')) {
      console.error('Invalid data format:', response.data);
      return;
    }

    // Transformation des données pour assurer `titre` et `id_projet`
    this.projects = response.data
      .filter(project => project.statut === 'Accepté')
      .map(project => ({
        titre: project.titre || "Titre non défini",
        id_projet: project.id_projet,
        sigle: project.sigle,
        priorite: project.priorite,
        date_debut: project.date_debut,
        date_echeance: project.date_echeance,
        statut_avancement: project.statut_avancement,
        total_retard: project.total_retard,
        total_duree: project.total_duree,
        pourcentage_avancement: project.pourcentage_avancement,
      }));
    
    console.log("Projets disponibles après transformation :", this.projects);

    // Définir le premier projet comme valeur par défaut
    if (this.projects.length > 0) {
      this.select = this.projects[0].id_projet;
      this.displaySelectedProject(); // Appeler la fonction pour afficher les détails du projet par défaut
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
},

   displaySelectedProject() {
  const selectedProject = this.projects.find(project => project.id_projet === this.select);
  console.log("Projet sélectionné :", selectedProject);

  if (selectedProject) {
    this.projectDetails = {
      priorite: selectedProject.priorite || 'Non spécifié',
      date_debut: selectedProject.date_debut
        ? new Date(selectedProject.date_debut).toLocaleDateString()
        : 'Non spécifié',
      date_echeance: selectedProject.date_echeance
        ? new Date(selectedProject.date_echeance).toLocaleDateString()
        : 'Non spécifié',
      statut_avancement: selectedProject.statut_avancement || 'Non spécifié',
      total_retard: selectedProject.total_retard || 'Non spécifié',
      total_duree: selectedProject.total_duree || 'Non spécifié',
      pourcentage_avancement: selectedProject.pourcentage_avancement || 0,
    };
    console.log("Détails du projet sélectionné :", this.projectDetails);
    this.fetchWeeklyProgress();
    this.fetchTasksForProject(this.select);
  } else {
    console.log("Aucun projet trouvé avec cet ID :", this.select);
  }
},



    highlightStartDate(date) {
  return this.projectDetails.date_debut &&
    new Date(this.projectDetails.date_debut).toLocaleDateString() === date.toLocaleDateString()
    ? 'highlight-start-date'
    : '';
},
    async fetchTasksForProject(projectId) {
    try {
      const response = await axios.get(`http://localhost:5000/admin/task/${projectId}`);
      this.projectTasks = response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches :", error);
    }
  },
 async fetchTaskStatusData() {
  if (!this.select) return;

  try {
    const response = await axios.get(`http://localhost:5000/admin/project/${this.select}/tasks-status`);
    this.pieChartOptions.series[0].data = response.data.map(task => ({
      value: task.count,
      name: task.status,
    }));
    this.updatePieChart();
  } catch (error) {
    console.error("Erreur lors de la récupération du statut des tâches :", error);
  }
},
updatePieChart() {
  this.$nextTick(() => {
    const chartDom = this.$refs.echartPie;
    if (!this.pieChartInstance) {
      this.pieChartInstance = echarts.init(chartDom);
    }
    this.pieChartInstance.setOption(this.pieChartOptions);
  });
}
,
    getStatusColor(status) {
      switch (status) {
        case 'À faire': return 'blue';
        case 'En cours': return 'orange';
        case 'Terminé': return 'green';
        case 'En retard': return 'red';
        default: return 'grey';
      }
    },
  },
};
</script>

<style scoped>
.echart-container {
  width: 410px;
  height: 320px;
  margin-top: -38px;
  color: #58d67ed7;
}
.small-date-picker {
  width: 310px;   /* Ajuste la largeur */
  height: 445px;  /* Ajuste la hauteur */
  font-size: 10px;
}
.small-date-picker .v-date-picker {
  width: 100%;
  height: 100%;
}
.highlight-start-date {
  border: 2px solid green;
  border-radius: 50%;
  background-color: #e6ffe6; /* Couleur de fond pour la date de début */
}

.small-date-picker .v-date-picker-header {
  font-size: 15px;
}

</style>
