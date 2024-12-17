<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <EmployeNav />
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <!-- pour la toolbar -->
        <v-col cols="12">
          <v-card
            height="58"
            elevation="0"
            style="background-color: white; border-radius: 10px"
          >
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-col cols="10">
                  <p>Rapport quotidien</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <EmployeAvatar />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- Message global de reporting -->
        <v-col cols="12">
          <v-card elevation="0" style="background-color: white; border-radius: 10px">
            <v-sheet class="d-flex justify-space-between align-center pa-4">
              <v-container>
                <v-row no-gutters>
                  
                  <v-col cols="12" sm="2">
                    <v-sheet
                      class="ma-2 pa-2"
                      style="background-color: #f4f5fa; border-radius: 15px"
                    >
                      Heure de travail: 8h/j
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-sheet
                      class="ma-2 pa-2"
                      style="background-color: #f4f5fa; border-radius: 15px"
                    >
                      Total retard: {{ totalDelayDays }} heures
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" sm="8">
                    
                      <v-alert v-if="!isReportingWindow" type="info" dense>
                      {{ reportingMessage }}
                    </v-alert>
                    <v-alert v-if="isReportingWindow && !reportSubmitted" type="info" dense>
                      Il vous reste {{ remainingTime }} pour faire le rapport.
                    </v-alert>
                    
                  </v-col>
                </v-row>
                <v-row no-gutters style="margin-top:15px;">
                  <v-col cols="12" sm="4" v-if="tasksToday.length" v-for="task in tasksToday" :key="task.id">
                    <v-card class="monCard ma-2" elevation="4" style="border-radius: 30px;">
                      <v-list-item class="px-5" height="70">   
      <template v-slot:title><v-btn  icon="mdi-format-list-checks" size="x-small" style="margin-top: -10px;"></v-btn>  <span style="font-size:18px;">{{ task.titre }}</span></template>
    </v-list-item>

    <v-divider></v-divider>
                      <v-card-text class="text-medium-emphasis pa-6">
                         
                        <v-row>
        <!-- Titre à gauche -->
        <v-col cols="6" class="d-flex align-center">
          <span>Jours restants:</span>
        </v-col>
        <!-- Valeur à droite -->
        <v-col cols="6" class="d-flex justify-end align-center">
          <span>{{ task.jours_restants }}</span>
        </v-col>
      </v-row>

      <v-row style="margin-top: -10px;">
        <!-- Titre à gauche -->
        <v-col cols="6" class="d-flex align-center">
          <span>Jours écoulés:</span>
        </v-col>
        <!-- Valeur à droite -->
        <v-col cols="6" class="d-flex justify-end align-center">
          <span>{{ task.jours_ecoules }}</span>
        </v-col>
      </v-row>

      <v-row style="margin-top: -10px;">
        <!-- Titre à gauche -->
        <v-col cols="6" class="d-flex align-center">
          <span><v-icon color="red">mdi-clock-alert</v-icon> Retard:</span>
        </v-col>
        <!-- Valeur à droite -->
        <v-col cols="6" class="d-flex justify-end align-center">
          <span>{{ task.jours_de_retard }} jours</span>
        </v-col>
      </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          :disabled="!isReportingWindow || reportSubmitted"
                          color="success"
                          class="text-none mx-3 mb-3"
                          size="small"
                          variant="flat"
                          rounded
                          @click="openReportModal(task.id)"
                        >
                          Rapport
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
        class="text-none mx-3 mb-3"
        color="primary"
        text="Voir détails"
        variant="text"
        slim
        rounded
      ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>

                  <!-- Message si aucune tâche -->
                  <v-col cols="12" sm="4" v-if="!tasksToday.length">
                    <v-card class="ma-2">
                      <v-card-title>Tâches d'aujourd'hui</v-card-title>
                      <v-card-text>Aucune tâche prévue pour aujourd'hui.</v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                
              </v-container>
            </v-sheet>
          </v-card>
        </v-col>

        <!-- Modal pour le rapport journalier -->
        <v-dialog v-model="reportModal" max-width="450px">
          <v-card>
            <v-card-title class="mx-4 mt-4" style="font-size: 22px;">
          <span style="margin-top: 10px;">Soumettre un rapport</span>
        </v-card-title>
            <v-card-text>
              <v-form ref="reportForm" v-model="valid">
                <v-col cols="6">
                  <v-text-field
                  v-model="hoursWorked"
                  label="Heures travaillées"
                  type="number"
                  required
                  :min="1"
                  :max="8"
                  @input="validateHoursWorked"
                  variant="outlined"
                  density="comfortable"
                  rounded
                ></v-text-field>
                </v-col>
                <v-col cols="12" style="margin-top: -20px;">
                  <v-textarea
                  v-model="comment"
                  label="Commentaire"
                  required
                  variant="outlined"
                  density="comfortable"
                  rounded
                ></v-textarea>
                </v-col>
                
              </v-form>
            </v-card-text>
            <v-card-actions style="margin-top: -10px;">
              
              <v-btn variant="flat" rounded class="text-none" elevation="5" color="white" @click="reportModal = false" style="margin-top: -40px; margin-right: -20px;">
            Fermer
          </v-btn>
          <v-btn :width="auto" variant="flat" rounded class="text-none mx-6" color="green" @click="submitReport" style="margin-top: -40px; margin-right: 8px;">
            Soumettre
          </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import EmployeNav from "../../components/employe/EmployeNav.vue";
import EmployeAvatar from "../../components/employe/EmployeAvatar.vue";
import axios from 'axios';

export default {
  components: {
    EmployeNav,
    EmployeAvatar,
  },
  data() {
    return {
      tasksToday: [],
      reportModal: false,
      selectedTaskId: null,
      hoursWorked: 0,
      comment: '',
      valid: false,
      isReportingWindow: false,
      reportingMessage: '',
      totalDelayDays: 0,
      remainingTime: '',
      reportSubmitted: false,
    };
  },
  created() {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      this.userId = storedUserData.idUtilisateur;
      this.fetchTasksToday();
      this.checkReportingWindow();
      setInterval(this.checkReportingWindow, 1000); // Vérifie chaque seconde pour un compte à rebours dynamique
    }
  },
  methods: {
    fetchTasksToday() {
  axios
    .get(`http://localhost:5000/admin/taskNow?userId=${this.userId}`)
    .then(response => {
      // Filtrer les tâches pour exclure celles avec un rapport soumis
      this.tasksToday = response.data.filter(task => !task.rapport_submitted);
      this.calculateTotalDelay();
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des tâches de l'utilisateur :", error);
    });
},

    checkReportingWindow() {
      const now = new Date();
      const reportingStart = new Date();
      const reportingEnd = new Date();
      
      reportingStart.setHours(14, 0, 0, 0);
      reportingEnd.setHours(20, 0, 0, 0);

      if (now >= reportingStart && now <= reportingEnd) {
        this.isReportingWindow = true;
        this.reportingMessage = 'Vous pouvez soumettre votre rapport jusqu\'à 20h.';
        this.updateRemainingTime(reportingEnd - now);
      } else {
        this.isReportingWindow = false;
        if (now < reportingStart) {
          const timeDiff = reportingStart - now;
          const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
          const seconds = Math.floor((timeDiff / 1000) % 60);
          this.reportingMessage = `Vous devez attendre ${hours}h ${minutes}m ${seconds}s pour pouvoir faire le rapport.`;
        } else {
          this.reportingMessage = 'C\'est trop tard pour aujourd\'hui. Veuillez attendre demain.';
        }
      }
    },
    validateHoursWorked() {
    if (this.hoursWorked < 1) {
      this.hoursWorked = 1;
    } else if (this.hoursWorked > 8) {
      this.hoursWorked = 8;
    }
  },
    calculateTotalDelay() {
      // Calculez la somme des jours de retard de toutes les tâches
      this.totalDelayDays = this.tasksToday.reduce((total, task) => total + task.jours_de_retard, 0);
    },
    updateRemainingTime(ms) {
      const interval = setInterval(() => {
        if (ms <= 0) {
          clearInterval(interval);
          this.remainingTime = 'Le créneau est terminé.';
        } else {
          const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((ms / (1000 * 60)) % 60);
          const seconds = Math.floor((ms / 1000) % 60);
          this.remainingTime = `${hours}h ${minutes}m ${seconds}s`;
        }
        ms -= 1000;
      }, 1000);
    },
    openReportModal(taskId) {
      this.selectedTaskId = taskId;
      this.reportModal = true;
    },
    submitReport() {
  if (this.$refs.reportForm.validate()) {
    const reportData = {
      id_tache: this.selectedTaskId,
      id_employe: this.userId,
      heures_travaillees: this.hoursWorked,
      commentaire: this.comment,
    };

    axios.post('http://localhost:5000/admin/insertReport', reportData)
      .then(() => {
        this.reportModal = false;
        this.hoursWorked = 0;
        this.comment = '';
        // Retirer la tâche de `tasksToday` directement
        this.tasksToday = this.tasksToday.filter(task => task.id !== this.selectedTaskId);
      })
      .catch(error => {
        console.error("Erreur lors de l'insertion du rapport :", error);
      });
  }
}


  },
};
</script>

<style scoped>
/* Ajoutez des styles spécifiques à la carte des tâches si nécessaire */
.monCard {
  border-radius: 10px;
  transition: transform 0.2s ease-in-out;
}
.monCard:hover {
  transform: scale(1.02);
}
</style>
