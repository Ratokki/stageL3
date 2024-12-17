<template>
  <v-container>
   <v-row align="center" class="d-flex flex-wrap">
    <!-- Colonne pour le titre et la date à gauche -->
    <v-col cols="12" sm="8" class="d-flex align-center justify-start">
      <span style="font-size: 15px; margin-right: 10px;">Statistique de la semaine</span>

      <!-- Navigation pour la semaine -->
      <v-btn density="compact" @click="previousWeek" style="min-width: unset; padding: 0; margin-right: 5px;" text elevation="0">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <div><span style="font-size: 12px; color: grey;">{{ formattedWeek }}</span></div>
      <v-btn density="compact" @click="nextWeek" style="min-width: unset; padding: 0; margin-left: 5px;" text elevation="0">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-col>

    <!-- Colonne pour le bouton Download à droite -->
    <v-col cols="12" sm="4" class="d-flex justify-end">
      <v-btn elevation="4" density="compact" @click="imprimer" icon>
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-col>
  </v-row>

    
    <div ref="printSection" style="margin-top: 20px;">
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
          Chef : <span style="color: grey; font-style: italic">{{ projectDetails.nom }} {{ projectDetails.prenom }}</span>
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
                  {{ projectDetails.total_retard }}
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
        
      </v-col>
      
      <v-col cols="12" sm="3" style="margin-left: -40px; margin-top: 12px;">
        <div ref="echartPie" class="echart-container"></div>
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
    </div>

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

/* import * as echarts from "echarts";
import axios from "axios";
//import taskCountCompo from './taskCountCompo.vue';
import * as pdfMake from "pdfmake/build/pdfmake";
import html2canvas from "html2canvas";
import logo from '../../assets/Fiantso.png';

import { format, addDays, subDays, isSameWeek } from 'date-fns' */

import * as echarts from "echarts";
import axios from "axios";

import html2canvas from "html2canvas";
import logo from '../../assets/Fiantso.png';
import { format, addDays, subDays, isSameWeek } from 'date-fns';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";


// Vérifiez si les polices sont bien chargées
console.log("pdfMake vfs :", pdfMake.vfs);

export default {
 
  data() {
    return {
    startOfWeek: this.getCurrentMonday(),
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
      myChart: null,
      pieChartOptions: {
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} tâches ({d}%)", // Affiche "Statut des tâches <br> À faire: 7 tâches (35%)"
  },
  legend: {
    bottom: "5%",
    left: "center",
  },
  series: [
    {
      name: "Statut des tâches", // Nom de la série
      type: "pie",
      radius: ["20%", "60%"], // Définir les rayons interne et externe
      roseType: "radius", // Active le style Nightingale Chart
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: true,
        position: "outside",
        formatter: "{c}", // Affiche "À faire: 7"
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
    this.fetchWeeklyProgress();
  },
  watch: {
    select(newVal) {
      this.displaySelectedProject();
      this.fetchTaskStatusData();
    },
     startOfWeek(newVal) {
        this.fetchWeeklyProgress();
    }
  },
  computed: {
  selectedProjectHint() {
    const selectedProject = this.projects.find(project => project.id_projet === this.select);
    return selectedProject ? `${selectedProject.sigle}` : '';
  },
  formattedWeek() {
      const endOfWeek = addDays(this.startOfWeek, 6)
      return `${format(this.startOfWeek, 'dd MMM yyyy')} - ${format(endOfWeek, 'dd MMM yyyy')}`
    }
},
  methods: {
getImageUrl(profile) {
      if (profile.startsWith('uploads')) {
        return `http://localhost:5000/${profile}`;
      } else if (profile.startsWith('/src/assets')) {
        return `/images/${profile.split('/').pop()}`;
      }
      return profile;
    },
    convertHoursToDays(hours) {
    if (typeof hours !== 'number' || hours <= 0) {
      return 'Non spécifié';
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return `${days} jours${remainingHours > 0 ? ` et ${remainingHours} heures` : ''}`;
    } else {
      return `${remainingHours} heures`;
    }
  },

  getCurrentMonday() {
      const today = new Date()
      const day = today.getDay()
      const distanceToMonday = day === 0 ? -6 : 1 - day
      return addDays(today, distanceToMonday)
    },
    previousWeek() {
      this.startOfWeek = subDays(this.startOfWeek, 7)
    },
    nextWeek() {
      this.startOfWeek = addDays(this.startOfWeek, 7)
    },
    isInSelectedWeek(day) {
      return isSameWeek(new Date(day.date), this.startOfWeek, { weekStartsOn: 1 })
    },

formatDate(dateString) {
      if (!dateString) return 'Non défini';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    },

    loadImageAsBase64() {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = logo;  // Utiliser le chemin importé

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = (error) => {
      console.error("Erreur de chargement de l'image :", error);
      reject(error);
    };
  });
}
,

    // Méthode d'impression pour générer le PDF
   // Méthode d'impression pour générer le PDF 
async imprimer() {
  // Charger l'image du logo en base64
  const logoBase64 = await this.loadImageAsBase64('../../assets/Fiantso.png'); // Assurez-vous que le chemin est correct

  // Récupérer le contenu du graphique en tant qu'image
  const chartElement = this.$refs.echartBar;
  let chartImage = null;

  if (chartElement) {
    // Utilisation de html2canvas pour capturer le graphique avec l'option 'willReadFrequently'
    chartImage = await html2canvas(chartElement, {
      willReadFrequently: true, // Optimisation de la performance pour lecture fréquente
    }).then((canvas) => {
      return canvas.toDataURL("image/png");
    });
  }

  // Calculer la semaine pour le titre
  const projectTitle = this.projectDetails.titre;
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())); // Début de la semaine (dimanche)
  const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6)); // Fin de la semaine (samedi)

  const startDate = startOfWeek.toLocaleDateString('fr-FR'); // Formatage de la date
  const endDate = endOfWeek.toLocaleDateString('fr-FR'); // Formatage de la date

  // Définir le contenu du PDF
  const pdfContent = [
    {
      image: logoBase64,
      width: 50,
      alignment: 'right',
      margin: [0, 10, 20, 10], 
    },
    {
      text: `L'avancement de projet la semaine de ${startDate} à ${endDate}`,
      style: 'header',
      margin: [0, 10, 0, 20],
    },
    { text: 'Priorité : ' + this.projectDetails.priorite, margin: [0, 10, 0, 5] },
    { text: 'Débuté le : ' + this.projectDetails.date_debut, margin: [0, 0, 0, 5] },
    { text: 'Fini le : ' + this.projectDetails.date_echeance, margin: [0, 0, 0, 5] },
    { text: 'Statut d\'avancement : ' + this.projectDetails.statut_avancement, margin: [0, 0, 0, 5] },
    { text: 'Retard : ' + this.projectDetails.total_retard, margin: [0, 0, 0, 5] },
    { text: 'Durée tâche : ' + this.projectDetails.total_duree, margin: [0, 0, 0, 10] },
    { text: 'Progrès : ' + this.projectDetails.pourcentage_avancement + '%', margin: [0, 0, 0, 10] },
    { image: chartImage, width: 400, alignment: 'center', margin: [0, 20, 0, 10] },
  ];
  

  // Configuration du style du PDF avec une police intégrée
  const pdfStyles = {
    header: { fontSize: 18, margin: [0, 0, 0, 10] },
    subheader: { fontSize: 15, margin: [0, 10, 0, 5] },
    
  };



  const pdf = pdfMake.createPdf({
    content: pdfContent,
    styles: pdfStyles,
    defaultStyle: {


  },
  });

  // Télécharger le PDF
  pdf.download(`${projectTitle}_rapport.pdf`);
},


    async onDateSelected(date) {
      console.log("Date sélectionnée :", date);
      this.selectedDate = date;
      await this.fetchDailyProgress(date);
    },
  
 getDayIndex(date) {
      // On obtient l'index du jour avec getDay(), mais pour l'affichage sur le graphique, 
      // on ajuste l'index pour que dimanche corresponde à 6 (dim dans le graphique)
      const day = new Date(date).getDay();
      return (day === 0) ? 6 : day - 1; // Dimanche devient 6, Lundi devient 0, etc.
    },
     async fetchDailyProgress(date) {
      if (!this.select) return;

      try {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        const response = await axios.get('http://localhost:5000/admin/project/daily-progress', {
          params: {
            id_projet: this.select,
            date: formattedDate,
          },
        });

        // Calcul de l'index du jour de la semaine
        const dayIndex = this.getDayIndex(date);
        this.updateWeeklyProgressChart(response.data, dayIndex);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'avancement journalier :", error);
      }
    },
    
     async fetchWeeklyProgress() {
    if (!this.select) return;

    try {
      // Récupérer les dates de début et de fin de la semaine
      const startDate = format(this.startOfWeek, 'yyyy-MM-dd');
      const endDate = format(addDays(this.startOfWeek, 6), 'yyyy-MM-dd');

      // Appel API avec les dates de début et de fin
      const response = await axios.get('http://localhost:5000/admin/project/weekly-progress', {
        params: {
          id_projet: this.select,
          startDate: startDate,
          endDate: endDate
        }
      });

      console.log('Données de l\'API :', response.data);
      this.updateWeeklyProgressChart(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'avancement hebdomadaire :", error);
    }
  },
   updateWeeklyProgressChart(progressData) {
  console.log("Données pour mise à jour du graphique :", progressData);

  // Tableau pour les pourcentages d'avancement pour chaque jour de la semaine
  const progressPercentage = [0, 0, 0, 0, 0, 0, 0];

  // Tableau de correspondance entre nom des jours et index
  const daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  // Parcourir les données de l'API et remplir progressPercentage
  progressData.forEach((entry) => {
    const dayIndex = daysOfWeek.indexOf(entry.jour_nom.toLowerCase());
    if (dayIndex !== -1) {
      progressPercentage[dayIndex] = entry.pourcentage_avancement_jour || 0;
    }
  });

  // Mettre à jour la série de données pour le graphique
  this.barChartOptions.series[0].data = progressPercentage;

  this.$nextTick(() => {
    const chartDom = this.$refs.echartBar;
    if (chartDom) {
      if (this.myChart) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(chartDom);
      this.myChart.setOption(this.barChartOptions, true);
    }
  });
}
,
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
        nom: project.nom,
        prenom: project.prenom,
        profile: project.profile,
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
      titre: selectedProject.titre,
      priorite: selectedProject.priorite || 'Non spécifié',
      nom: selectedProject.nom,
      prenom: selectedProject.prenom,
      profile: selectedProject.profile,
      date_debut: selectedProject.date_debut
        ? new Date(selectedProject.date_debut).toLocaleDateString()
        : 'Non spécifié',
      date_echeance: selectedProject.date_echeance
        ? new Date(selectedProject.date_echeance).toLocaleDateString()
        : 'Non spécifié',
      statut_avancement: selectedProject.statut_avancement || 'Non spécifié',
      total_retard: this.convertHoursToDays(selectedProject.total_retard),
      total_duree: this.convertHoursToDays(selectedProject.total_duree),
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
    
    // Transformation des données pour le graphique
    this.pieChartOptions.series[0].data = response.data.map(task => ({
      value: task.count, // Nombre de tâches
      name: task.statut, // Nom du statut
    }));
    
    this.updatePieChart(); // Si vous avez une méthode pour rafraîchir le graphique
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

.highlight-day {
  background-color: #2196F3; /* Bleu Vuetify */
  color: white;
  border-radius: 50%;
}

</style>
