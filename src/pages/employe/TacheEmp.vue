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
                  <p>Mes tâches</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <EmployeAvatar/>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- Affichage des tâches de l'utilisateur -->
        <v-col cols="12">
          <v-card
            
            elevation="0"
            style="background-color: white; border-radius: 10px"
          >
            <v-container style="margin-top: -6px">
              <v-row align="center">
        <v-col cols="12" v-if="userTasks.length">
          <v-row>
            <v-col v-for="task in userTasks" :key="task.id_tache" cols="12" md="4">
              <v-card class="mb-4">
                <v-card-title>{{ task.titre }}</v-card-title>
                <v-card-subtitle>Date limite : {{ task.date_limite }}</v-card-subtitle>
                <v-card-text>
                  <div>Priorité : {{ task.priorite }}</div>
                  <div>Avancement : {{ task.pourcentage_avancement }}%</div>
                </v-card-text>
                <v-card-actions>
                  <v-chip
                    v-if="task.date_debut"
                    color="green"
                    text-color="white"
                  >
                    Déjà commencé
                  </v-chip>
                  <v-btn
                    v-else
                    color="primary"
                    @click="startTask(task.id)"
                  >
                    Commencer
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" v-else>
          <p class="text-caption text-grey">Aucune tâche assignée pour le moment.</p>
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
import EmployeNav from "../../components/employe/EmployeNav.vue";
import EmployeAvatar from "../../components/employe/EmployeAvatar.vue";
import axios from 'axios';

export default {
  components: {
    EmployeNav,
    EmployeAvatar
  },
  data() {
    return {
      userTasks: []
    };
  },
  created() {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      this.userId = storedUserData.idUtilisateur;
      this.getUserTasks();
    }
  },
  methods: {
    getUserTasks() {
    axios
      .get(`http://localhost:5000/admin/getTasksForUser?userId=${this.userId}`) // utilisation de query string
      .then(response => {
        this.userTasks = response.data;
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des tâches de l'utilisateur :", error);
      });
  },
  startTask(taskId) {
      axios
        .put("http://localhost:5000/admin/taskStart", { taskId })
        .then(response => {
          // Met à jour la date_debut de la tâche dans la liste
          const task = this.userTasks.find(t => t.id === taskId);
          if (task) {
            task.date_debut = response.data.date_debut;
          }
        })
        .catch(error => {
          console.error("Erreur lors de la mise à jour de la tâche :", error);
        });
    }
  }
};
</script>
