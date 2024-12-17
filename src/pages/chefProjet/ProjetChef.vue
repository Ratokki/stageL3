<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <ChefNav />
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <!-- Header des projets -->
        <v-col cols="12">
          <v-card height="58" elevation="0" style="background-color: white; border-radius: 10px">
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-col cols="10">
                  <p>Mes projets</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <ChefAvatar />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- Liste des projets -->
        <v-col cols="12">
          <!-- Snackbar pour la confirmation de l'ajout -->
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" top right color="success">
      {{ snackbar.message }}
    </v-snackbar>



          <v-card elevation="0" style="background-color: white; border-radius: 10px">
            <v-container style="margin-top: -6px">
              <span style="margin-left: 15px; font-size: 20px;">Tous mes projets</span>
              <v-row style="margin-top: -5px;">
                <template v-if="Array.isArray(projects) && projects.length">
                  <v-container>
                    <v-col v-for="project in projects" :key="project.id_projet" cols="12" md="12">
                      <v-card class="mx-auto" elevation="4" style="border-radius: 20px;">
                        <v-col class="auto">
  <v-row justify="space-between" align="center">
    <!-- Partie gauche : Informations du projet -->
    <v-col>
      <v-list-item class="px-5" height="70">   
      <template v-slot:title><v-btn  icon="mdi-format-list-checks" size="x-small" style="margin-top: -10px;"></v-btn>  <span style="font-size:18px;">{{ project.titre }} {{ project.sigle }}</span></template>
    </v-list-item>
    </v-col>
   
    
    <!-- Partie droite : Statut du projet -->
    <v-col class="text-right" style="margin-top: -15px;">
      <v-card-item>
        
        <v-chip
                            :color="getStatusColor(project.statut_avancement)"
                            small
                            dark
                            class="justify-center"
                        >
                            {{ project.statut_avancement }}
                        </v-chip>
      </v-card-item>
    </v-col>
  </v-row>
</v-col>
<v-container style="margin-top: -30px;">
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="4"
      >
        <v-sheet class="ma-2 pa-2" style="background-color: #F4F5FA; border-radius: 15px;">
          Debuté le : {{ project.formattedDate }}
        </v-sheet>
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <v-sheet class="ma-2 pa-2" style="background-color: #F4F5FA; border-radius: 15px;">
          Finis le :
        </v-sheet>
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <v-sheet class="ma-2 pa-2" style="background-color: #F4F5FA; border-radius: 15px;">
          Priorité : {{ project.priorite_avancement }}
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
<v-container style="margin-top: -8px">

                        <v-card-actions style="margin-top: -20px;">
                          <v-btn color="primary" class="text-none" rounded="xl" @click="loadTasks(project)" variant="text">
                            Voir tâche
                            <v-icon left>
                              {{ project.showTasks ? "mdi-chevron-up" : "mdi-chevron-down" }}
                            </v-icon>
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn color="green" class="text-none" rounded="xl" variant="flat" @click="openNewTaskModal(project)">
                            Nouveau tâche
                          </v-btn>



                           <!-- Modal pour la création d'une nouvelle tâche -->
  <v-dialog v-model="project.showNewTaskModal" max-width="500px">
  <v-card>
    <v-card-title class="mx-4 mt-4" style="font-size: 22px;">
          <span style="margin-top: 10px;">Ajouter un tâche</span>
        </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field 
              label="Titre"
              v-model="newTask.titre"
              required
              density="comfortable"
              rounded
              variant="outlined"
              ></v-text-field>
          </v-col>
          <v-col cols="6" style="margin-top: -7px;">
            <v-text-field
              label="Statut"
              v-model="newTask.statut"
              readonly
              density="comfortable"
              rounded
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" style="margin-top: -7px;">
            <v-text-field
              label="Date de création"
              :value="currentDate"
              readonly
              density="comfortable"
              rounded
              variant="outlined"
            ></v-text-field>
          </v-col>
          
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions style="margin-top:-10px;">
 
            <v-btn variant="flat" rounded class="text-none" elevation="5" color="white" @click="project.showNewTaskModal = false" style="margin-top: -40px; margin-right: -20px;">
            Fermer
          </v-btn>
          <v-btn :width="90" variant="flat" rounded class="text-none mx-6" color="green" @click="createTask(project)" style="margin-top: -40px; margin-right: 8px;">
            Ajouter
          </v-btn>
          </v-card-actions>
  </v-card>
</v-dialog>
                  <!-- Modal pour l'assignation de tâche -->
  <v-dialog v-model="showAssignDialog" max-width="600px">
    <v-card>
      <v-card-title>Assigner la tâche</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-radio-group v-model="selectedEmployee" column>
                <v-radio
                  v-for="employee in availableEmployees"
                  :key="employee.idUtilisateur"
                  :label="`${employee.nom} ${employee.prenom} (Tâches non terminées : ${employee.taches_non_terminees})`"
                  :value="employee.idUtilisateur"
                />
              </v-radio-group>
            </v-col>
            <v-col cols="12">
              <v-menu>
        <template v-slot:activator="{ props }">
            <v-text-field density="compact" variant="outlined" v-bind="props" label="Date pour debuter ce tâche"
                          v-model="formattedDate" readonly></v-text-field>
        </template>
        <v-date-picker v-on:update:model-value="changeRoleDate" hide-actions @click.native.stop>
            <template v-slot:header></template>
        </v-date-picker>
    </v-menu>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Heure"
                value="7:00"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Durée (en jours)"
                type="number"
                v-model="taskDuration"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Priorité"
                :items="['Basse', 'Moyenne', 'Haute']"
                v-model="taskPriority"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>

        <v-btn 
        variant="flat" 
        rounded 
        class="text-none" 
        elevation="5" 
        color="white" 
        @click="closeAssignDialog"
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
          @click="assignTask"
          style="margin-top: -15px; margin-right: 8px;"
        >
          Assigner
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

                        </v-card-actions>

                        </v-container>
                        <!-- Liste des tâches par statut -->
                          <v-expand-transition :height="auto">
                            <v-container v-if="project.showTasks && project.tasks">
                              <v-row>
                                <!-- Tâches en cours -->
                               <v-col cols="12" class="mt-2">
  <span style="margin-left: 15px; font-size: 20px;">Tâches en cours</span>
  <template v-if="getTasksByStatus(project.tasks, 'En cours').length">
    <v-carousel :height="auto" progress="#F4F5FA" hide-delimiters style="margin-top: 20px;">
      <v-carousel-item
        v-for="(chunk, index) in chunkTasks(getTasksByStatus(project.tasks, 'En cours'))"
        :key="index"
      >
        <v-sheet height="100%">
          <v-row>
            <v-col v-for="task in chunk" :key="task.id_tache" cols="4">
              <v-card elevation="4" style="border-radius: 20px;" :height="auto">
                <v-card-item>
                  <div>
                    <div class="text-overline mb-1">Titre : {{ task.titre }}</div>
                    <div class="text-caption">Date limite : {{ task.date_limite }}</div>
                    <div class="text-caption">Priorité : {{ task.priorite }}</div>
                    <div class="text-caption">Pourcentage d'avancement : {{ task.pourcentage_avancement }}%</div><br>
                    

                   
                  </div>
                </v-card-item>
                <v-card-actions>
      <div style="margin-top: -8px; margin-left: 8px;">
    <v-avatar size="38">
      <template v-if="task.profile_responsable">
        <v-img :src="task.profile_responsable" height="38" cover></v-img>
      </template>
      <template v-else>
    <v-icon color="red" size="24">mdi-help-circle</v-icon>
  </template>
    </v-avatar>
  </div>
                  <v-spacer></v-spacer>
                  <v-btn color="orange" rounded="xl" variant="outlined" @click="openAssignTaskDialog(task, project)">Reassigner</v-btn>

                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </template>
  <template v-else>
    <v-container>
    <p class="text-caption text-grey" style="font-style: italic;">Pas de tâche en cours en ce moment.</p>
    </v-container>
  </template>
</v-col>

                                <!-- Tâches à faire -->
<v-col cols="12" class="mt-2">
  <span style="margin-left: 15px; font-size: 20px;">Tâches à faire</span>
  <template v-if="getTasksByStatus(project.tasks, 'À faire').length">
    <v-carousel height="auto" progress="#F4F5FA" hide-delimiters style="margin-top: 20px;">
      <v-carousel-item
        v-for="(chunk, index) in chunkTasks(getTasksByStatus(project.tasks, 'À faire'))"
        :key="index"
      >
        <v-sheet height="100%">
          <v-row>
            <v-col v-for="task in chunk" :key="task.id_tache" cols="4">
              <v-card elevation="4" style="border-radius: 20px;" :height="auto">
                <v-card-item>
                  <div>
                    <div class="text-overline mb-1">Titre : {{ task.titre }}</div>
                    <div class="text-caption">Date limite : {{ task.date_limite }}</div>
                    <div class="text-caption">Priorité : {{ task.priorite }}</div>
                    <div class="text-caption">Pourcentage d'avancement : {{ task.pourcentage_avancement }}%</div><br>
                    

                   
                  </div>
                </v-card-item>
                <v-card-actions>
      <div style="margin-top: -8px; margin-left: 8px;">
    <v-avatar size="38">
      <template v-if="task.profile_responsable">
        <v-img :src="task.profile_responsable" height="38" cover></v-img>
      </template>
      <template v-else>
    <v-icon color="red" size="24">mdi-help-circle</v-icon>
  </template>
    </v-avatar>
  </div>
                  <v-spacer></v-spacer>
                  <v-btn color="orange" rounded="xl" variant="outlined" @click="openAssignTaskDialog(task, project)">Reassigner</v-btn>

                  <!-- Modal pour l'assignation de tâche -->
  <v-dialog v-model="showAssignDialog" max-width="600px">
    <v-card>
      <v-card-title>Assigner la tâche</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-radio-group v-model="selectedEmployee" column>
                <v-radio
                  v-for="employee in availableEmployees"
                  :key="employee.idUtilisateur"
                  :label="`${employee.nom} ${employee.prenom} (Tâches non terminées : ${employee.taches_non_terminees})`"
                  :value="employee.idUtilisateur"
                />
              </v-radio-group>
            </v-col>
            <v-col cols="12">
              <v-menu>
        <template v-slot:activator="{ props }">
            <v-text-field density="compact" variant="outlined" v-bind="props" label="Date"
                          v-model="formattedDate" readonly></v-text-field>
        </template>
        <v-date-picker v-on:update:model-value="changeRoleDate" hide-actions @click.native.stop>
            <template v-slot:header></template>
        </v-date-picker>
    </v-menu>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Heure"
                value="7:00"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Durée (en jours)"
                type="number"
                v-model="taskDuration"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Priorité"
                :items="['Basse', 'Moyenne', 'Haute']"
                v-model="taskPriority"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="assignTask">Confirmer</v-btn>
        <v-btn text @click="closeAssignDialog">Annuler</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </template>
  <template v-else>
    <v-container>
    <p class="text-caption text-grey" style="font-style: italic;">Pas de tâche à faire en ce moment.</p>
    </v-container>
  </template>
</v-col>



                                <!-- Tâches terminées -->
                                <v-col cols="12" class="mt-4">
  <span style="margin-left: 15px; font-size: 20px;">Tâches terminé</span>
  <template v-if="getTasksByStatus(project.tasks, 'Terminé').length">
    <v-carousel :height="auto" progress="#F4F5FA" hide-delimiters style="margin-top: 20px;">
      <v-carousel-item
        v-for="(chunk, index) in chunkTasks(getTasksByStatus(project.tasks, 'Terminé'))"
        :key="index"
      >
        <v-sheet height="100%">
          <v-row>
            <v-col v-for="task in chunk" :key="task.id_tache" cols="4">
              <v-card elevation="4" style="border-radius: 20px;" :height="auto">
                <v-card-item>
                  <div>
                    <div class="text-overline mb-1">Titre : {{ task.titre }}</div>
                    <div class="text-caption">Date limite : {{ task.date_limite }}</div>
                    <div class="text-caption">Priorité : {{ task.priorite }}</div>
                    <div class="text-caption">Pourcentage d'avancement : {{ task.pourcentage_avancement }}%</div><br>
                    

                   
                  </div>
                </v-card-item>
                <v-card-actions>
      <div style="margin-top: -8px; margin-left: 8px;">
    <v-avatar size="38">
      <template v-if="task.profile_responsable">
        <v-img :src="task.profile_responsable" height="38" cover></v-img>
      </template>
      <template v-else>
    <v-icon color="red" size="24">mdi-help-circle</v-icon>
  </template>
    </v-avatar>
  </div>
                  <v-spacer></v-spacer>
                  <v-btn color="orange" rounded="xl" variant="outlined" @click="openAssignTaskDialog(task, project)">Reassigner</v-btn>

                  <!-- Modal pour l'assignation de tâche -->
  <v-dialog v-model="showAssignDialog" max-width="600px">
    <v-card>
      <v-card-title>Assigner la tâche</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-radio-group v-model="selectedEmployee" column>
                <v-radio
                  v-for="employee in availableEmployees"
                  :key="employee.idUtilisateur"
                  :label="`${employee.nom} ${employee.prenom} (Tâches non terminées : ${employee.taches_non_terminees})`"
                  :value="employee.idUtilisateur"
                />
              </v-radio-group>
            </v-col>
            <v-col cols="12">
              <v-menu>
        <template v-slot:activator="{ props }">
            <v-text-field density="compact" variant="outlined" v-bind="props" label="Date"
                          v-model="formattedDate" readonly></v-text-field>
        </template>
        <v-date-picker v-on:update:model-value="changeRoleDate" hide-actions @click.native.stop>
            <template v-slot:header></template>
        </v-date-picker>
    </v-menu>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Heure"
                value="7:00"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Durée (en jours)"
                type="number"
                v-model="taskDuration"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Priorité"
                :items="['Basse', 'Moyenne', 'Haute']"
                v-model="taskPriority"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="assignTask">Confirmer</v-btn>
        <v-btn text @click="closeAssignDialog">Annuler</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </template>
  <template v-else>
    <v-container>
    <p class="text-caption text-grey" style="font-style: italic;">Pas de tâche terminé en ce moment.</p>
    </v-container>
  </template>
</v-col>

                                <!-- Nouveau tache -->
                                <v-col cols="12" class="mt-4">
  <span style="margin-left: 15px; font-size: 20px;">Nouveau tâche</span>
  <template v-if="getTasksByStatus(project.tasks, 'En création').length">
    <v-carousel :height="auto" progress="#F4F5FA" hide-delimiters style="margin-top: 20px;">
      <v-carousel-item
        v-for="(chunk, index) in chunkTasks(getTasksByStatus(project.tasks, 'En création'))"
        :key="index"
      >
        <v-sheet height="100%">
          <v-row>
            <v-col v-for="task in chunk" :key="task.id_tache" cols="4">
              <v-card elevation="4" style="border-radius: 20px;" :height="auto">
                <v-card-item>
                  <div>
                    <div class="text-overline mb-1">Titre : {{ task.titre }}</div>
                    <div class="text-caption">Date limite : {{ task.date_limite }}</div>
                    <div class="text-caption">Priorité : {{ task.priorite }}</div>
                    <div class="text-caption">Pourcentage d'avancement : {{ task.pourcentage_avancement }}%</div><br>
                    

                   
                  </div>
                </v-card-item>
                <v-card-actions>
      <div style="margin-top: -8px; margin-left: 8px;">
    <v-avatar size="38">
      <template v-if="task.profile_responsable">
        <v-img :src="task.profile_responsable" height="38" cover></v-img>
      </template>
      <template v-else>
    <v-icon color="red" size="24">mdi-help-circle</v-icon>
  </template>
    </v-avatar>
  </div>
                  <v-spacer></v-spacer>
                  <v-btn color="orange" rounded="xl" variant="outlined" @click="openAssignTaskDialog(task, project)">Assigner</v-btn>

                  <!-- Modal pour l'assignation de tâche -->
  <v-dialog v-model="showAssignDialog" max-width="600px">
    <v-card>
      <v-card-title>Assigner la tâche</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-radio-group v-model="selectedEmployee" column>
                <v-radio
                  v-for="employee in availableEmployees"
                  :key="employee.idUtilisateur"
                  :label="`${employee.nom} ${employee.prenom} (Tâches non terminées : ${employee.taches_non_terminees})`"
                  :value="employee.idUtilisateur"
                />
              </v-radio-group>
            </v-col>
            <v-col cols="12">
              <v-menu>
        <template v-slot:activator="{ props }">
            <v-text-field density="compact" variant="outlined" v-bind="props" label="Date"
                          v-model="formattedDate" readonly></v-text-field>
        </template>
        <v-date-picker v-on:update:model-value="changeRoleDate" hide-actions @click.native.stop>
            <template v-slot:header></template>
        </v-date-picker>
    </v-menu>
            </v-col>
            
            <v-col cols="6">
              <v-text-field
                label="Durée (en jours)"
                type="number"
                v-model="taskDuration"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Priorité"
                :items="['Basse', 'Moyenne', 'Haute']"
                v-model="taskPriority"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="assignTask">Confirmer</v-btn>
        <v-btn text @click="closeAssignDialog">Annuler</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </template>
  <template v-else>
    <v-container>
    <p class="text-caption text-grey" style="font-style: italic;">Pas de nouveau tâche en ce moment.</p>
    </v-container>
  </template>
</v-col>
                              </v-row>
                            </v-container>
                          </v-expand-transition>
                      </v-card>
                    </v-col>
                  </v-container>
                </template>
                <template v-else>
                  <v-container>
<p class="text-caption text-grey" style="font-style: italic;">Vous n'avez pas encore de projet</p>
                  </v-container>
    
  </template>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ChefNav from "../../components/chefProjet/ChefNav.vue";
import ChefAvatar from "../../components/chefProjet/ChefAvatar.vue";
import axios from 'axios';

export default {
  props: {
        format: String
    },
  components: {
    ChefNav,
    ChefAvatar
  },
  data() {
    return {
      showNewTaskModal: false,
      date: null,
      projects: [],
      newTask: {
        titre: '',
        duree: null,
        statut: 'En création', 
        pourcentage_avancement: 0,
        priorite: 'Moyenne',
        id_projet: null
      },
      snackbar: {
        show: false,
        message: 'Tâche ajoutée avec succès!',
        timeout: 3000
      },
      availableEmployees: [],
    selectedEmployee: null,
    showAssignDialog: false,
    currentTask: null,
    };
  },
  created() {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      this.userId = storedUserData.idUtilisateur;
      this.getProjectsByUser();
    }
  },
  computed: {
        formattedDate() {
            if (!this.date) return null;
            let format = this.format || "%Y-%m-%d";
            format = format.replace('%Y', this.date.getYear() + 1900)
                .replace('%m', (this.date.getMonth() + 1 + "").padStart(2, "0"))
                .replace('%d', (this.date.getDate() + "").padStart(2, "0"));
            return format;
        },
    },
  methods: {
    changeRoleDate(date) {
            this.date = date
        },
   
    
    openAssignTaskDialog(task, project) {
  this.currentTask = task;
  this.currentProject = project; // Assure-toi que currentProject est défini
  this.showAssignDialog = true;
  this.fetchAvailableEmployees();

},
  closeAssignDialog() {
    this.showAssignDialog = false;
    this.selectedEmployee = null;
  },
 fetchAvailableEmployees() {
  axios.get("http://localhost:5000/admin/getAvailableEmployees")
    .then(response => {
      this.availableEmployees = response.data;
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des employés disponibles:", error);
    });
},
assignTask() {
    if (!this.currentTask || !this.selectedEmployee) {
      console.error("Aucune tâche ou employé sélectionné pour l'assignation.");
      return;
    }

    const taskData = {
      id: this.currentTask.id, // Utilisez `currentTask.id` ici
      id_responsable: this.selectedEmployee,
      date_debut: this.formattedDate,
      duree: this.taskDuration,
      priorite: this.taskPriority
    };

    axios.put(`http://localhost:5000/admin//assignTaskforUser`, taskData)
      .then((response) => {
        this.loadTasks(this.currentProject); // Recharger les tâches pour le projet en cours
        this.closeAssignDialog();
      })
      .catch((error) => {
        console.error("Erreur lors de l'assignation de la tâche :", error);
      });
},

  closeAssignDialog() {
    this.showAssignDialog = false;
    this.selectedEmployee = null;
    this.formattedDate = null;
    this.taskDuration = null;
    this.taskPriority = null;
  },
    getProjectsByUser() {
  axios.get("http://localhost:5000/admin/projectChef", { params: { userId: this.userId } })
    .then((response) => {
      this.projects = response.data
        .map(project => {
          // Formater la date de début d'avancement au format souhaité
          const formattedDate = project.date_debut_avancement
            ? new Date(project.date_debut_avancement).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            : 'Non spécifié';
          
          return {
            ...project,
            date_debut_avancement: new Date(project.date_debut_avancement), // Conserve l'objet Date pour le tri
            formattedDate, // Utiliser `formattedDate` pour l'affichage de la date formatée
            showTasks: false // Initialiser showTasks
          };
        })
        .sort((a, b) => b.date_debut_avancement - a.date_debut_avancement); // Tri par date de début (du plus récent au plus ancien)
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des projets :", error);
    });
},


 loadTasks(project) {
  if (!project || typeof project.showTasks === 'undefined') {
    console.error("Le projet n'est pas défini ou showTasks est indéfini.");
    return;
  }

  if (!project.showTasks) {
    axios.get(`http://localhost:5000/admin/avancProject/${project.id_projet}/getTask`)
      .then((response) => {
        project.tasks = response.data;

        project.tasks.forEach(task => {
          // Préfixer l'URL si elle n'est pas complète
          if (task.profile_responsable && !task.profile_responsable.startsWith('http')) {
            task.profile_responsable = `http://localhost:5000/${task.profile_responsable}`;
          }
          console.log("URL complète de l'image du responsable:", task.profile_responsable);
        });

        project.showTasks = true;
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des tâches :", error);
      });
  } else {
    project.showTasks = false;
  }
}
,
    getTasksByStatus(tasks, status) {
      return tasks.filter(task => task.statut === status);
    },
    openNewTaskModal(project) {
      project.showNewTaskModal = true;
      this.newTask.id_projet = project.id_projet;
    },
    createTask(project) {
  const taskData = {
    titre: this.newTask.titre,
    statut: this.newTask.statut,
  };

  axios.post(`http://localhost:5000/admin/avancProject/${project.id_projet}/createTask`, taskData)
    .then((response) => {
      this.loadTasks(project);
      this.resetNewTaskForm();
      project.showNewTaskModal = false;
    })
    .catch((error) => {
      console.error("Erreur lors de la création de la tâche :", error);
    });
},

    resetNewTaskForm() {
      this.newTask = {
        titre: "",
        duree: null,
        statut: "En création",
        pourcentage_avancement: 0,
        priorite: "Moyenne",
        id_projet: null
      };
    },
    chunkTasks(tasks, chunkSize = 3) {
    const chunks = [];
    for (let i = 0; i < tasks.length; i += chunkSize) {
      chunks.push(tasks.slice(i, i + chunkSize));
    }
    return chunks;
  },
  getStatusColor(status) {
            switch (status) {
                case 'À faire':
                    return 'blue';
                case 'En cours':
                    return 'orange';
                case 'Terminé':
                    return 'green';
                case 'En retard':
                    return 'red';
                default:
                    return 'grey';
            }
        },
  }
};
</script>
<style scoped>
.v-carousel__controls__prev,
.v-carousel__controls__next {
  background-color: rgba(255, 255, 255, 0.2); /* Couleur de fond transparente */
  backdrop-filter: blur(5px); /* Effet de flou */
  border-radius: 50%; /* Rendu circulaire */
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>