<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <EmployeNav />
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <!-- Toolbar -->
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
                  <EmployeAvatar />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- Affichage des tâches -->
        <v-col cols="12">
          <!-- Tâches en cours -->
          <v-card elevation="0" style="background-color: white; border-radius: 10px" class="mb-4">
            <v-card-title style="margin-top: 15px;">Tâches en cours</v-card-title>
            <v-container>
              <v-row>
                <v-col
                  v-for="task in tasksByStatus['En cours']"
                  :key="task.id_tache"
                  cols="12"
                  md="4"
                >
                  <TaskCard :task="task" />
                </v-col>
                <v-col cols="12" v-if="!tasksByStatus['En cours'].length">
                  <p class="text-caption text-grey">Pas de tâche en cours.</p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <!-- Tâches à faire -->
          <v-card elevation="0" style="background-color: white; border-radius: 10px" class="mb-4">
            <v-card-title style="margin-top: 15px;">Tâches à venir</v-card-title>
            <v-container>
              <v-row>
                <v-col
                  v-for="task in tasksByStatus['À faire']"
                  :key="task.id_tache"
                  cols="12"
                  md="4"
                >
                  <TaskCard :task="task" />
                </v-col>
                <v-col cols="12" v-if="!tasksByStatus['À faire'].length">
                  <p class="text-caption text-grey">Pas de tâche à venir.</p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <!-- Tâches terminées -->
          <v-card elevation="0" style="background-color: white; border-radius: 10px" class="mb-4">
            <v-card-title style="margin-top: 15px;">Tâches terminées</v-card-title>
            <v-container>
              <v-row>
                <v-col
                  v-for="task in tasksByStatus['Terminé']"
                  :key="task.id_tache"
                  cols="12"
                  md="4"
                >
                  <TaskCard :task="task" />
                </v-col>
                <v-col cols="12" v-if="!tasksByStatus['Terminé'].length">
                  <p class="text-caption text-grey">Pas de tâche effectuée.</p>
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
import TaskCard from "../../components/employe/TaskCard.vue";
import axios from "axios";

export default {
  components: {
    EmployeNav,
    EmployeAvatar,
    TaskCard
  },
  data() {
    return {
      userTasks: [],
      tasksByStatus: {
        "En cours": [],
        "À faire": [],
        "Terminé": []
      }
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
        .get(`http://localhost:5000/admin/getTasksForUser?userId=${this.userId}`)
        .then((response) => {
          this.userTasks = response.data;
          this.organizeTasksByStatus();
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des tâches de l'utilisateur :",
            error
          );
        });
    },
    organizeTasksByStatus() {
      this.tasksByStatus = {
        "En cours": [],
        "À faire": [],
        "Terminé": []
      };
      this.userTasks.forEach((task) => {
        this.tasksByStatus[task.statut].push(task);
      });
    }
  }
};
</script>

