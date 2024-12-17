<template>
  <div>
   

      <v-row>
        <v-col cols="12" style="margin-top: auto;">
          <!-- Chevron pour afficher tous les projets -->
      <!-- <v-btn variant="text" icon @click="expandProjects = !expandProjects" class="d-flex align-center">
        <v-icon>{{ expandProjects ? 'mdi-chevron-up' : 'mdi-chevron-down' }} </v-icon> -->
        
                          <v-btn
                            class="text-none"
                            color="green"
                            rounded="xl"
                            @click="expandProjects = !expandProjects"
                            variant="text"
                          >
                            Voir tous les projets
                            <v-icon left>
                              {{ expandProjects ? "mdi-chevron-up" : "mdi-chevron-down" }}
                            </v-icon>
                          </v-btn>
                        
      <!-- </v-btn> -->

      <!-- Expansion panel pour tous les projets en carrousel -->
      <v-expansion-panels v-if="expandProjects" style="width: 100%" elevation="0">
  <v-expansion-panel>
    
    <v-expansion-panel-content>
      <v-carousel hide-delimiters height="auto">
        <v-carousel-item v-for="(chunk, index) in chunkTasks(acceptedProjects)" :key="index">
          <v-container>
<v-row no-gutters>
  
  <v-col v-for="(project, projectIndex) in chunk"
   :key="projectIndex" cols="12" sm="4">
<v-card  
   elevation="3"
   style="border-radius: 20px; height: auto; margin: 10px;"
>
<div style="margin-top: 15px;">
        
        </div>
            <v-card-title>{{ project.titre }}</v-card-title>
            <v-card-subtitle style="margin-top: 10px">Accepté le: {{ project.date_acceptation }}</v-card-subtitle>
            <v-card-subtitle>Proposé le: {{ project.date_proposition }}</v-card-subtitle>
            <v-card-subtitle>Responsable: {{ project.responsable.prenom }} {{ project.responsable.nom }}</v-card-subtitle>
            <v-card-text>
              
              <p>Description: {{ project.description }}</p>
              
            </v-card-text>
            <div style=" margin-left: 20px;">
             <v-avatar size="38">
  <v-img 
    :src="project.responsable.profile" 
    height="38" 
    cover
    @error="project.responsable.profile = null"  
  ></v-img>
  <template v-if="!project.responsable.profile">
    <v-icon color="red" size="24" style="margin-left: -20px;">mdi-help-circle</v-icon>
  </template>
</v-avatar>
</div>
<v-spacer></v-spacer>
<v-chip :color="getStatusColor1(project.statut)" small dark style="margin-top: 8px; margin-left: 15px">
          {{ project.statut }}
        </v-chip>  
        <v-card-actions>
          <v-btn variant="outlined" class="text-none" rounded="xl" color="orange" @click="openAssignModal(project)">
          Assigner
          <v-tooltip activator="parent" location="bottom" class="custom-tooltip">
            Assigner le projet
          </v-tooltip>
        </v-btn>
        </v-card-actions>
                
          </v-card>
   </v-col>
</v-row>
</v-container>
          
        </v-carousel-item>
      </v-carousel>
    </v-expansion-panel-content>
  </v-expansion-panel>
</v-expansion-panels>

    

    <!-- Modal d'assignation d'un utilisateur à un projet -->
    <v-dialog v-model="assignModal" max-width="600px">
  <v-card>
    <v-card-title class="headline" style="margin-top: 10px; margin-right: 5px;">
        <span style="margin-top: 10px;">Assigner un projet</span>
      </v-card-title>

    <v-card-text style="margin-top:10px;">
      
          <v-menu
        v-model="menuVisible"
        :close-on-content-click="false"
        offset-y
      >
        <template #activator="{ props }">
          <v-text-field
            v-bind="props"
            label="Sélectionner un utilisateur"
            v-model="selectedUserText"
            readonly
            @click="menuVisible = true"
            density="comfortable"
            variant="outlined"
            rounded
            class="mx-3"
          ></v-text-field>
        </template>

        <v-list>
          <v-list-item
            v-for="user in acceptedUsers"
            :key="user.idUtilisateur"
            @click="selectUser(user)"
            :value="user.idUtilisateur"
            density="compact"
          >
            <template #prepend>
              <v-avatar>
                <v-icon v-if="!getImageUrl(user.profile)">mdi-account-circle</v-icon>
                <v-img v-else :src="getImageUrl(user.profile)" />
              </v-avatar>
            </template>
            <v-list-item-title>{{ user.prenom }} {{ user.nom }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.nombre_projets || 0 }} projets</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-menu>

      
    </v-card-text>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6" style="margin-top:-35px;">
            <!-- Champ pour la date de début -->
            <v-text-field
              variant="outlined"
              label="Date pour débuter ce projet"
              type="date"
              v-model="startDate"
              density="comfortable"
              rounded
            />
          </v-col>
          <v-col cols="6" style="margin-top:-35px;">
            <v-select
              label="Priorité"
              :items="['Basse', 'Moyenne', 'Haute']"
              v-model="taskPriority"
              density="comfortable"
              rounded
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="6" style="margin-top:-15px;">
            <!-- Champ heure fixe de 7h00 -->
            <v-text-field
              label="Heure"
              value="7:00"
              readonly
              density="comfortable"
              rounded
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" style="margin-top:-15px;">
            <!-- Champ pour la durée en jours -->
            <v-text-field
              label="Durée (en jours)"
              type="number"
              v-model="taskDuration"
              density="comfortable"
              rounded
              variant="outlined"
            ></v-text-field>
          </v-col>

        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions class="mr-2 mb-6">
      
      <v-btn 
        variant="flat" 
        rounded 
        class="text-none" 
        elevation="5" 
        color="white" 
        @click="closeAssignModal"
        style="margin-top: -15px; margin-right: 5px;"
        >
          Annuler
        </v-btn>

        <!-- Confirmation Button for Accepter/Rejeter -->
        <v-btn
        :width="100"
          variant="flat"
          rounded
          class="text-none"
          color="green"
          @click="assignUser"
          style="margin-top: -15px; margin-right: 8px;"
        >
          Assigner
        </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

        </v-col>
      </v-row>

      
  </div>
</template>

<<script>
import axios from 'axios';

export default {
  data() {
    return {
      projects: [],
      assignModal: false,
      selectedProject: null,
      acceptedUsers: [],
      selectedUser: null,
      expandProjects: false,
      startDate: null,
      taskDuration: null,
      taskPriority: null,
      menuVisible: false,
    };
  },
  computed: {
    recentAcceptedProjects() {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return this.projects.filter(
        project =>
          project.statut === 'Accepté' && new Date(project.date_acceptation) >= startOfWeek
      );
    },
    acceptedProjects() {
      return this.projects.filter(project => project.statut === 'Accepté');
    },
    recentAcceptedProjectsCount() {
      return this.recentAcceptedProjects.length;
    },
  },
  mounted() {
    this.fetchProjects();
    this.fetchAcceptedUsers();
  },
  methods: {
selectUser(user) {
    this.selectedUser = user.idUtilisateur;
    this.selectedUserText = `${user.prenom} ${user.nom}`;
    this.menuVisible = false; // Fermer le menu après la sélection
  },
getImageUrl(profile) {
    if (profile.startsWith('uploads')) {
      return `http://localhost:5000/${profile}`;
    } else if (profile.startsWith('/src/assets')) {
      // Remplacer les chemins src/assets par des chemins statiques
      return `/images/${profile.split('/').pop()}`;
    }
    return profile;
  },

   setStartTime() {
  if (this.startDate) {
    const startDateTime = new Date(this.startDate);
    startDateTime.setHours(7, 0, 0);
    this.startDate = startDateTime;
  }
},
    chunkTasks(tasks, chunkSize = 3) {
      const chunks = [];
      for (let i = 0; i < tasks.length; i += chunkSize) {
        chunks.push(tasks.slice(i, i + chunkSize));
      }
      return chunks;
    },
    async fetchAcceptedUsers() {
      try {
        const response = await axios.get('http://localhost:5000/admin/acceptedChefs');
        console.log(response.data);
        this.acceptedUsers = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs acceptés:', error);
      }
    },
    async fetchProjects() {
      try {
        const response = await axios.get('http://localhost:5000/admin/projectAccept');
        this.projects = response.data.map(project => {
          const profileUrl = project.profile_responsable
            ? `http://localhost:5000/${project.profile_responsable}`
            : 'chemin/vers/image-par-defaut.jpg';

          console.log(`Profil du responsable pour le projet ${project.titre}:`, profileUrl);

          return {
            ...project,
            responsable: {
              prenom: project.prenom_responsable,
              nom: project.nom_responsable,
              profile: profileUrl,
            },
            date_acceptation: new Date(project.date_acceptation).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            date_proposition: new Date(project.date_proposition).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          };
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
      }
    },
    openAssignModal(project) {
  console.log("Projet reçu dans openAssignModal:", project); // Confirmer l'objet reçu
  if (!project || !project.id_projet) {
    console.error("Erreur : le projet sélectionné est invalide ou n'a pas d'ID");
    return;
  }
  this.selectedProject = project;
  this.assignModal = true;
},
    closeAssignModal() {
      this.assignModal = false;
      this.selectedProject = null;
      this.selectedUser = null;
      this.startDate = null;
      this.taskDuration = null;
      this.taskPriority = null;
    },
    async assignUser() {
  if (!this.selectedProject || !this.selectedProject.id_projet) {
    alert("Projet non sélectionné ou sans ID valide.");
    return;
  }

  const payload = {
    projectId: this.selectedProject.id_projet,
    userId: this.selectedUser,
    startDate: this.startDate,
    duration: this.taskDuration,
    priority: this.taskPriority,
  };

  console.log("Payload envoyé :", payload);

  try {
    const response = await axios.post('http://localhost:5000/admin/assignProject', payload);
    this.$emit('snackbar', { message: response.data.message, color: 'green' });
    this.closeAssignModal();
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de l'assignation";
    console.error("Erreur de la requête:", error.response?.data);
    this.$emit('snackbar', { message, color: 'red' });
  }
},
    getStatusColor1(statut) {
      switch (statut) {
        case 'Proposé': return 'blue';
        case 'Refusé': return 'red';
        case 'Accepté': return 'green';
        case 'En attente': return 'orange';
        default: return 'grey';
      }
    },
  },
};
</script>

<style scoped>
.v-carousel-item {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
</style>
