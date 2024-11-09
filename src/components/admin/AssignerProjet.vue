<template>
  <div>
    <!-- Titre et carrousel pour les projets récents acceptés -->
    <v-col cols="12" style="margin-top: 20px;">
      
      <span style="margin-left: 15px; font-size: 20px">
        
        <v-badge v-if="recentAcceptedProjectsCount > 0" color="red" :content="recentAcceptedProjectsCount">
 Projets acceptés récents de cette semaine
</v-badge>

      </span>
      <!-- Carrousel pour les projets récents -->
      <v-carousel v-if="recentAcceptedProjects.length" hide-delimiters height="350">
  <v-carousel-item v-for="(chunk, chunkIndex) in chunkTasks(recentAcceptedProjects, 3)" :key="chunkIndex">
    <div style="display: flex;">
      <v-card
      :height="270"
        v-for="(project, projectIndex) in chunk"
        :key="projectIndex"
        elevation="3"
        style="border-radius: 15px; margin: 15px; width: calc(100% / 3 - 30px);"
      >
      <div style="margin-top: 20px;">
        <span style="font-weight: bold; font-size: 16px; margin-left: 15px; margin-top: 25px;">{{ project.titre }}</span>
        </div>
        <v-card-subtitle style="margin-top: 10px">Accepté le: {{ project.date_acceptation }}</v-card-subtitle>
        <v-card-subtitle>Proposé le: {{ project.date_proposition }}</v-card-subtitle>
        <v-card-subtitle>Responsable: {{ project.responsable.prenom }} {{ project.responsable.nom }}</v-card-subtitle>
        <v-card-text>
          <p>Description: {{ project.description }}</p>
        </v-card-text>
        <div style="margin-top: 10px; margin-left: 20px;">
        <v-avatar size="38">
            <v-img :src="project.responsable.profile || 'chemin/vers/image-par-defaut.jpg'" height="38" cover></v-img>
          </v-avatar>
        </div>
        
        <div style=" margin-left: 20px;">
        <v-btn variant="outlined" class="text-none" rounded="xl" color="orange" @click="openAssignModal(project)">
          Assigner
          <v-tooltip activator="parent" location="bottom" class="custom-tooltip">
            Assigner le projet
          </v-tooltip>
        </v-btn>
        </div>
        <v-card-actions>
          
        </v-card-actions>
        
      </v-card>
    </div>
  </v-carousel-item>
</v-carousel>

      <!-- Message quand il n'y a pas de projets récents -->
      <v-col v-else>
        <span style="font-size: 12px; font-style: italic; color:#b9c3c4; margin-left: 20px; margin-top: 20px;">
          Aucun projet accepté trouvé cette semaine.
        </span>
      </v-col>

      </v-col>

      <v-row>
        <v-col cols="12" style="margin-top: -35px;">
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
      <v-carousel hide-delimiters height="300">
        <v-carousel-item v-for="(chunk, index) in chunkTasks(acceptedProjects)" :key="index">
          <v-container>
<v-row>
  
  <v-col v-for="(project, projectIndex) in chunk"
   :key="projectIndex" cols="4">
<v-card  
   elevation="3"
   style="border-radius: 20px; height: 250px;"
>
<div style="margin-top: 20px;">
        <span style="font-weight: bold; font-size: 16px; margin-left: 15px; margin-top: 25px;">{{ project.titre }}</span>
        </div>
           
            <v-card-subtitle style="margin-top: 10px">Accepté le: {{ project.date_acceptation }}</v-card-subtitle>
            <v-card-subtitle>Proposé le: {{ project.date_proposition }}</v-card-subtitle>
            <v-card-subtitle>Responsable: {{ project.responsable.prenom }} {{ project.responsable.nom }}</v-card-subtitle>
            <v-card-text>
              
              <p>Description: {{ project.description }}</p>
              
            </v-card-text>
            <div style=" margin-left: 20px;">
             <v-avatar size="38">
            <v-img :src="project.responsable.profile || 'chemin/vers/image-par-defaut.jpg'" height="38" cover></v-img>
          </v-avatar>
</div>
<v-spacer></v-spacer>
<v-chip :color="getStatusColor1(project.statut)" small dark style="margin-top: 8px; margin-left: 15px">
          {{ project.statut }}
        </v-chip>            
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
        <v-card-title>Assigner un utilisateur à {{ selectedProject ? selectedProject.titre : '' }}</v-card-title>
        <v-card-text>
          <v-radio-group v-model="selectedUser" label="Sélectionner un chef de projet">
            <v-radio
              v-for="user in acceptedUsers"
              :key="user.idUtilisateur"
              :label="`${user.prenom} ${user.nom}`"
              :value="user.idUtilisateur"
            />
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="assignUser">Assigner</v-btn>
          <v-btn color="red darken-1" text @click="closeAssignModal">Annuler</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
        </v-col>
      </v-row>

      
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      projects: [],           // Liste de tous les projets
      assignModal: false,     // Contrôle du modal d'assignation
      selectedProject: null,  // Projet sélectionné pour l'assignation
      acceptedUsers: [],      // Liste des utilisateurs acceptés pour l'assignation
      selectedUser: null,     // Utilisateur sélectionné pour l'assignation
      expandProjects: false,  // Contrôle de l'affichage de tous les projets dans l'expansion panel
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
      return this.recentAcceptedProjects.length; // Compte le nombre de projets récents acceptés
    },
  },
  mounted() {
    this.fetchProjects();
    this.fetchAcceptedUsers();
  },
  methods: {
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

      // Affiche les informations pour vérification
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

    async openAssignModal(project) {
  this.selectedProject = project;
  await this.fetchAcceptedUsers();
  this.assignModal = true;
  this.recentAcceptedProjectsCount = 0; // Réinitialise le compteur à 0
},
    closeAssignModal() {
      this.assignModal = false;
      this.selectedUser = null;
    },
    async assignUser() {
      if (!this.selectedUser || !this.selectedProject) return;
      try {
        await axios.post('http://localhost:5000/admin/assignProject', {
          projectId: this.selectedProject.id_projet,
          userId: this.selectedUser,
        });
        this.closeAssignModal();
        alert('Utilisateur assigné avec succès');
      } catch (error) {
        console.error("Erreur lors de l'assignation de l'utilisateur:", error);
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