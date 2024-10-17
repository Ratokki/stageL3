<template>
  <div>
    <v-container>
      <v-row>
        <!-- Select field pour choisir le projet -->
        <v-col cols="12" sm="6">
          <v-select
            v-model="selectedProject"
            :items="projectList"
            label="Choisir un projet"
            outlined
            dense
          ></v-select>
        </v-col>
      </v-row>

      <!-- Affichage de la date d'échéance -->
      <v-row>
        <v-col>
          <h3>Date d'échéance : {{ selectedProjectDates.end }}</h3>
        </v-col>
      </v-row>

      <!-- Graphique de l'avancement des tâches -->
      <v-row>
        <v-col cols="12">
          <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import moment from "moment";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      // Liste des projets avec leurs dates de début et de fin
      projects: {
        "Projet A": {
          tasks: [5, 8, 12],
          start: "2023-01-01",
          end: "2024-01-01",
        },
        "Projet B": {
          tasks: [3, 7, 10],
          start: "2023-02-01",
          end: "2024-02-01",
        },
        "Projet C": {
          tasks: [4, 5, 9],
          start: "2023-03-01",
          end: "2024-03-01",
        },
        "Projet D": {
          tasks: [2, 6, 8],
          start: "2023-04-01",
          end: "2024-04-01",
        },
      },
      // Liste des noms des projets
      projectList: ["Projet A", "Projet B", "Projet C", "Projet D"],
      // Projet sélectionné (sera mis à jour dynamiquement)
      selectedProject: "",
      // Dates du projet sélectionné
      selectedProjectDates: {
        start: "",
        end: "",
      },
      // Données du graphique
      series: [
        {
          name: "Tâches",
          data: [], // Rempli dynamiquement selon le projet sélectionné
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // place les étiquettes en haut des barres
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
    };
  },
  mounted() {
    this.setRecentProjectAsDefault();
  },
  methods: {
    // Définir le projet en cours récent par défaut
    setRecentProjectAsDefault() {
      const recentProject = this.getMostRecentProject();
      this.selectedProject = recentProject;
      this.updateProjectData(recentProject);
    },
    // Trouver le projet en cours le plus récent basé sur la date de fin
    getMostRecentProject() {
      const currentDate = moment();
      let mostRecentProject = "";
      let mostRecentEndDate = null;

      for (let project in this.projects) {
        const projectEndDate = moment(this.projects[project].end);

        // Si la date de fin est après la date actuelle et est la plus récente
        if (projectEndDate.isAfter(currentDate)) {
          if (!mostRecentEndDate || projectEndDate.isBefore(mostRecentEndDate)) {
            mostRecentProject = project;
            mostRecentEndDate = projectEndDate;
          }
        }
      }

      return mostRecentProject;
    },
    // Mettre à jour les données du projet sélectionné
    updateProjectData(project) {
      this.series[0].data = this.projects[project].tasks;
      this.selectedProjectDates.start = this.projects[project].start;
      this.selectedProjectDates.end = this.projects[project].end;
    },
  },
  watch: {
    // Regarder les changements de projet sélectionné
    selectedProject(newProject) {
      this.updateProjectData(newProject);
    },
  },
};
</script>

<style scoped>
h3 {
  text-align: center;
  color: #555;
}
</style>


