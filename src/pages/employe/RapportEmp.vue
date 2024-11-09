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

        <!-- la notification -->
        <v-col cols="12">
          <v-card
            elevation="0"
            style="background-color: white; border-radius: 10px"
          >
            <v-sheet class="d-flex justify-space-between align-center pa-4">
              <v-container>
                <v-row no-gutters>
                  <v-col cols="12" sm="4">
                    <v-sheet
                      class="ma-2 pa-2"
                      style="background-color: #f4f5fa; border-radius: 15px"
                    >
                      Rapport le : 17h à 20h
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-sheet
                      class="ma-2 pa-2"
                      style="background-color: #f4f5fa; border-radius: 15px"
                    >
                      heure travail d'une journée : 8h
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-sheet
                      class="ma-2 pa-2"
                      style="background-color: #f4f5fa; border-radius: 15px"
                    >
                      Retard : 0j
                    </v-sheet>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="4" v-if="tasksToday.length" v-for="task in tasksToday" :key="task.id">
                    <v-card class="ma-2">
                      <v-card-title>{{ task.titre }}</v-card-title>
                      <v-card-text>
                        Jours restants: {{ task.jours_restants }}<br />
                        Jours écoulés: {{ task.jours_ecoules }}<br />
                        Retard: {{ task.jours_de_retard }} jours
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          :disabled="!isReportingWindow || reportSubmitted"
                          color="success"
                          class="text-none"
                          size="small"
                          variant="flat"
                          rounded
                          @click="openReportModal(task.id)"
                        >
                          Rapport
                        </v-btn>
                        <v-alert v-if="!isReportingWindow" type="info" dense>
                          {{ reportingMessage }}
                        </v-alert>
                        <v-alert v-if="isReportingWindow && !reportSubmitted" type="info" dense>
                          Il vous reste {{ remainingTime }} pour faire le rapport.
                        </v-alert>
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
        <v-dialog v-model="reportModal" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Soumettre Rapport Journalier</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="reportForm" v-model="valid">
                <v-text-field
                  v-model="hoursWorked"
                  label="Heures travaillées"
                  type="number"
                  required
                ></v-text-field>
                <v-textarea
                  v-model="comment"
                  label="Commentaire"
                  required
                ></v-textarea>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="reportModal = false">Annuler</v-btn>
              <v-btn text @click="submitReport">Soumettre</v-btn>
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
          this.tasksToday = response.data;
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des tâches de l'utilisateur :", error);
        });
    },
    checkReportingWindow() {
      const now = new Date();
      const reportingStart = new Date();
      const reportingEnd = new Date();
      
      reportingStart.setHours(17, 0, 0, 0);
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
  this.selectedTaskId = taskId; // Assurez-vous que c'est bien l'ID numérique
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
    console.log(reportData); // Vérifier que `id_tache` est bien un nombre

    axios.post('http://localhost:5000/admin/insertReport', reportData)
      .then(() => {
        this.reportModal = false;
        this.hoursWorked = 0;
        this.comment = '';
        this.fetchTasksToday();
      })
      .catch(error => {
        console.error("Erreur lors de l'insertion du rapport :", error);
      });
  }
}

  },
};
</script>
