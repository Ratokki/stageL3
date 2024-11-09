<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <AdminNav />
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <v-col cols="12">
          <v-card
            height="58"
            elevation="0"
            style="background-color: white; border-radius: 10px"
          >
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-col cols="10">
                  <p>Budget</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <AdminAvatar/>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-container>

      <v-container fluid class="px-6 mt-n2" style="">
        <v-col cols="12">
          <v-card
            elevation="0"
            style="
              background-color: white;
              border-radius: 10px;
              margin-top: -25px;
            "
          >
            <v-container style="margin-top: -6px">
              <div>
                <v-tabs v-model="tab" color="deep-purple-accent-4" lazy>
                  <v-tab :value="1" class="text-capitalize"
                    >Listes des projet</v-tab
                  >
                  <v-tab :value="2" class="text-capitalize"
                    >Proposer un projet</v-tab
                  >
                  <v-tab :value="3" class="text-capitalize">Assignation</v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">
                  <v-tab-item value="1" v-show="tab === 1">
                    <v-row align="center" style="margin-top: 10px">
                      <v-sheet
                        class="d-flex justify-space-between align-center pa-4"
                      >
                        <v-select
                          v-model="selectedFilter"
                          :items="filterOptions"
                          persistent-hint
                          single-line
                          variant="plain"
                          class="custom-select"
                          style="
                            max-width: 200px;
                            margin-top: -5px;
                            margin-left: 10px;
                          "
                        ></v-select>
                      </v-sheet>

                      <v-spacer></v-spacer>
                      <div>
                        <v-text-field
                          color="success"
                          v-model="search"
                          class="mx-auto"
                          density="comfortable"
                          placeholder="Recherche"
                          prepend-inner-icon="mdi-magnify"
                          style="max-width: 500px; margin-left: -15px"
                          variant="outlined"
                          rounded
                          height="50px"
                          width="300px"
                        ></v-text-field>
                      </div>
                      <div style="margin-left: 18px">
                        <v-autocomplete
                          color="success"
                          class="mx-auto"
                          density="comfortable"
                          rounded
                          chips
                          clearable
                          label="Trier par"
                          :items="['Date', 'Statut', 'Nom']"
                          variant="underlined"
                          width="195px"
                          style="margin-left: -40px; max-width: 250px"
                        ></v-autocomplete>
                      </div>
                      <v-spacer></v-spacer>

                      
                    </v-row>

                    <!-- Liste de projet -->
                    <v-row>
                      <v-col cols="12">
                        <v-data-table
                          v-model:search="search"
                          :headers="headers1"
                          :items="filteredItems1"
                          item-value="name"
                          style="border-radius: 15px; margin-top: -20px"
                        >
                          <template v-slot:item.task="{ item }">
                            <v-avatar color="green" size="24">
                              <span class="white--text" style="font-size: 10px">
                                {{ item.task }}
                              </span>
                            </v-avatar>
                          </template>

                          <template v-slot:item.status="{ item }">
                            <v-chip
                              :color="getStatusColor(item.status)"
                              small
                              dark
                              class="justify-center"
                            >
                              {{ item.status }}
                            </v-chip>
                          </template>

                          <template v-slot:item.actions="{ item }">
                            <v-btn
                              variant="text"
                              icon
                              @click="editProject(item)"
                            >
                              <img
                                src="../../assets/pencil.png"
                                height="29px"
                              />
                            </v-btn>
                            <v-btn
                              variant="text"
                              icon
                              @click="deleteProject(item)"
                            >
                              <img
                                src="../../assets/delete.png"
                                height="29px"
                              />
                            </v-btn>
                            <v-btn
                              variant="text"
                              icon
                              @click="viewDetails(item)"
                              style="margin-left: 5px"
                              dark
                            >
                              <img src="../../assets/eye.png" height="29px" />
                            </v-btn>

                            <!-- Modal pour Détails -->
                            <v-dialog v-model="dialogDetails" max-width="500px">
                              <v-card>
                                <v-card-title>Détails de projet</v-card-title>
                                <v-card-text>
                                  <v-list-item>
                                    <v-list-item-content>
                                      <v-list-item-title
                                        >Nom :
                                        {{
                                          selectedUser.name
                                        }}</v-list-item-title
                                      >
                                      <v-list-item-subtitle
                                        >Date début :
                                        {{
                                          selectedUser.startDate
                                        }}</v-list-item-subtitle
                                      >
                                      <v-list-item-subtitle
                                        >Responsable :
                                        {{
                                          selectedUser.manager
                                        }}</v-list-item-subtitle
                                      >
                                      <v-list-item-subtitle
                                        >Statut :
                                        {{
                                          selectedUser.status
                                        }}</v-list-item-subtitle
                                      >
                                      <v-list-item-subtitle
                                        >Nombre de tâches :
                                        {{
                                          selectedUser.task
                                        }}</v-list-item-subtitle
                                      >
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-card-text>
                                <v-card-actions>
                                  <v-btn text @click="dialogDetails = false"
                                    >Fermer</v-btn
                                  >
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-tab-item>

                  <!-- Tab 2 -->

                  <v-tab-item value="2" v-show="tab === 2">
                    <v-row align="center" style="margin-top: 10px">
                      <v-sheet
                        class="d-flex justify-space-between align-center pa-4"
                      >
                        <v-select
                          v-model="selectedFilter"
                          :items="filterOptions"
                          persistent-hint
                          single-line
                          variant="plain"
                          class="custom-select"
                          style="max-width: 200px; margin-top: -5px"
                        ></v-select>
                      </v-sheet>

                      <v-spacer></v-spacer>
                      <div>
                        <v-text-field
                          color="success"
                          v-model="search"
                          class="mx-auto"
                          density="comfortable"
                          placeholder="Recherche"
                          prepend-inner-icon="mdi-magnify"
                          style="max-width: 500px; margin-left: -15px"
                          variant="outlined"
                          rounded
                          height="50px"
                          width="300px"
                        ></v-text-field>
                      </div>
                      <div style="margin-left: 18px">
                        <v-autocomplete
                          color="success"
                          class="mx-auto"
                          density="comfortable"
                          rounded
                          chips
                          clearable
                          label="Trier par"
                          :items="['Date', 'Statut', 'Nom']"
                          variant="underlined"
                          width="195px"
                          style="margin-left: -40px; max-width: 250px"
                        ></v-autocomplete>
                      </div>
                      <v-spacer></v-spacer>

                      <v-btn
                        elevation="0"
                        class="text-capitalize"
                        rounded
                        @click="openModal"
                        style="
                          color: white;
                          margin-top: -15px;
                          margin-right: 15px;
                          background: linear-gradient(
                            90deg,
                            #9bf560d3,
                            #58d67ed7
                          );
                        "
                        >Ajouter</v-btn
                      >
<v-dialog v-model="dialog" max-width="600px">
  <v-card>
    <v-card-title>
      Ajouter un projet
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          label="Titre"
          v-model="newItem.titre"
          required
        ></v-text-field>

        <v-text-field
          label="Sigle"
          v-model="newItem.sigle"
          required
        ></v-text-field>

        <v-text-field
          label="Description"
          v-model="newItem.description"
          required
        ></v-text-field>

        <v-text-field
          label="Budget"
          v-model="newItem.budget"
          required
          type="number"
        ></v-text-field>

        <v-textarea
          label="Raison de proposition"
          v-model="newItem.raison_proposition"
          required
        ></v-textarea>

        <!-- Champ Lieu qui affiche les coordonnées -->
        <v-text-field
          v-model="newItem.lieu"
          label="Lieu (Latitude, Longitude)"
          readonly
        ></v-text-field>

        <!-- Champs Latitude et Longitude masqués mais toujours mis à jour -->
        <v-text-field
          v-model="newItem.latitude"
          label="Latitude"
          readonly
          style="display:none"
        ></v-text-field>

        <v-text-field
          v-model="newItem.longitude"
          label="Longitude"
          readonly
          style="display:none"
        ></v-text-field>

        <!-- Carte pour la sélection du lieu -->
        <div id="map" style="height: 300px"></div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="addItem" color="primary">Ajouter</v-btn>
      <v-btn @click="closeModal" color="secondary">Fermer</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

                    </v-row>

                    <!-- Liste de projet proposé -->
                    <v-row>
                      <v-col cols="12">
                        <v-data-table
                          v-model:search="search"
                          :headers="headers2"
                          :items="items2"
                          item-value="titre"
                          style="border-radius: 15px; margin-top: -20px"
                        >
                          <template v-slot:item.sigle="{ item }">
                            <span class="white--text" style="font-size: 15px">
                              {{ item.sigle }}
                            </span>
                          </template>

                          <template v-slot:item.status="{ item }">
                            <v-chip
                              :color="getStatusColor1(item.status)"
                              small
                              dark
                              class="justify-center"
                            >
                              {{ item.status }}
                            </v-chip>
                          </template>

                          <template v-slot:item.actions="{ item }">
                            <v-btn
                              v-if="item.status === 'Proposé'"
                              elevation="0"
                              class="text-capitalize"
                              rounded
                              @click="togglePublish(item)"
                              style="
                                color: white;
                                margin-top: -15px;
                                margin-right: 15px;
                                background: linear-gradient(
                                  90deg,
                                  #9bf560d3,
                                  #58d67ed7
                                );
                              "
                            >
                              {{
                                item.status === "Proposé"
                                  ? "publier"
                                  : "depublier"
                              }}
                            </v-btn>
                            <v-btn
                              variant="text"
                              icon
                              @click="editProject(item)"
                            >
                              <img
                                src="../../assets/pencil.png"
                                height="29px"
                              />
                            </v-btn>
                            <v-btn
                              variant="text"
                              icon
                              @click="deleteProject(item)"
                            >
                              <img
                                src="../../assets/delete.png"
                                height="29px"
                              />
                            </v-btn>
                            <v-btn
                              variant="text"
                              icon
                              @click="viewDetails(item)"
                              style="margin-left: 5px"
                              dark
                            >
                              <img src="../../assets/eye.png" height="29px" />
                            </v-btn>

                            <!-- Modal pour Détails -->
                            <v-dialog v-model="dialogDetails" max-width="500px">
                              <v-card>
                                <v-card-title>Détails de projet</v-card-title>
                                <v-card-text>
                                  <v-list-item>
                                    <v-list-item-content>
                                      <v-list-item-title
                                        >Nom :
                                        {{
                                          selectedUser.name
                                        }}</v-list-item-title
                                      >
                                      <v-list-item-subtitle
                                        >Date début :
                                        {{
                                          selectedUser.startDate
                                        }}</v-list-item-subtitle
                                      >
                                      <v-list-item-subtitle
                                        >Responsable :
                                        {{
                                          selectedUser.manager
                                        }}</v-list-item-subtitle
                                      >
                                      <v-list-item-subtitle
                                        >Statut :
                                        {{
                                          selectedUser.status
                                        }}</v-list-item-subtitle
                                      >
                                      <v-list-item-subtitle
                                        >Nombre de tâches :
                                        {{
                                          selectedUser.task
                                        }}</v-list-item-subtitle
                                      >
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-card-text>
                                <v-card-actions>
                                  <v-btn text @click="dialogDetails = false"
                                    >Fermer</v-btn
                                  >
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-tab-item>

                  <v-tab-item value="3" v-show="tab === 3">
                    <!-- tab 3 -->

                    <!-- en tete -->

                    <!-- liste de projet à assigner -->
                    <!-- liste de projet à assigner -->
                    <v-row style="margin-top: 20px">
                      <v-col cols="12">
                        <span style="margin-left: 15px; font-size: 20px"
                          >Projets acceptés récents de cette semaine</span
                        >
                        <v-row style="margin-top: 8px">
                          <v-col
                            v-for="project in recentAcceptedProjects"
                            :key="project.titre"
                            cols="12"
                            md="4"
                          >
                            <v-card elevation="3" style="border-radius: 15px">
                              <br />
                              <span
                                style="
                                  font-weight: bold;
                                  font-size: 16px;
                                  margin-left: 15px;
                                  margin-top: -15px;
                                "
                                >Titre : {{ project.titre }}</span
                              >
                              <v-card-subtitle style="margin-top: 10px"
                                >Accepté le:
                                {{ project.dateAccept }}</v-card-subtitle
                              >
                              <v-card-subtitle
                                >Proposé le:
                                {{ project.proposDate }}</v-card-subtitle
                              >
                              <v-card-text>
                                <p>Statut: {{ project.status }}</p>
                                <p>Description: {{ project.descr }}</p>
                              </v-card-text>
                              <v-row>
                                <v-col cols="9">
                                  <v-chip
                                    :color="getStatusColor1(project.status)"
                                    small
                                    dark
                                    class="justify-center"
                                    style="margin-top: 8px; margin-left: 15px"
                                  >
                                    {{ project.status }}
                                  </v-chip>
                                </v-col>
                                <v-col cols="3">
                                  <v-btn
                                    variant="text"
                                    icon
                                    @click="openAssignModal(project)"
                                    style="margin-left: 5px"
                                    dark
                                  >
                                    <img
                                      src="../../assets/change.png"
                                      height="29px"
                                    />
                                    <v-tooltip
                                      activator="parent"
                                      location="bottom"
                                      class="custom-tooltip"
                                    >
                                      Assigner le projet
                                    </v-tooltip>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-card>
                          </v-col>
                          <v-col v-if="recentAcceptedProjects.length === 0">
                            <p>Aucun projet accepté récent trouvé.</p>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12" style="margin-top: 20px">
                        <span style="margin-left: 15px; font-size: 20px"
                          >Tous les projets acceptés</span
                        >
                        <v-row style="margin-top: 8px">
                          <v-col
                            v-for="project in allAcceptedProjects"
                            :key="project.titre"
                            cols="12"
                            md="4"
                          >
                            <v-card elevation="3" style="border-radius: 15px">
                              <br />
                              <span
                                style="
                                  font-weight: bold;
                                  font-size: 16px;
                                  margin-left: 15px;
                                  margin-top: -15px;
                                "
                                >Titre : {{ project.titre }}</span
                              >
                              <v-card-subtitle style="margin-top: 10px"
                                >Accepté le:
                                {{ project.dateAccept }}</v-card-subtitle
                              >
                              <v-card-subtitle
                                >Proposé le:
                                {{ project.proposDate }}</v-card-subtitle
                              >
                              <v-card-text>
                                <p>Statut: {{ project.status }}</p>
                                <p>Description: {{ project.descr }}</p>
                              </v-card-text>
                              <v-row>
                                <v-col cols="9">
                                  <v-chip
                                    :color="getStatusColor1(project.status)"
                                    small
                                    dark
                                    class="justify-center"
                                    style="margin-top: 8px; margin-left: 15px"
                                  >
                                    {{ project.status }}
                                  </v-chip>
                                </v-col>
                                <v-col cols="3">
                                  <v-btn
                                    variant="text"
                                    icon
                                    @click="openAssignModal(project)"
                                    style="margin-left: 5px"
                                    dark
                                  >
                                    <img
                                      src="../../assets/change.png"
                                      height="29px"
                                    />
                                    <v-tooltip
                                      activator="parent"
                                      location="bottom"
                                      class="custom-tooltip"
                                    >
                                      Assigner le projet
                                    </v-tooltip>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <!-- Modal pour Assignation -->
                    <v-dialog v-model="assignDialog" max-width="500px">
                      <v-card>
                        <v-card-title
                          >Assigner des utilisateurs à
                          {{ selectedProject.name }}</v-card-title
                        >
                        <v-card-text>
                          <v-select
                            v-model="selectedUsers"
                            :items="users"
                            item-text="name"
                            item-value="id"
                            label="Sélectionnez des utilisateurs"
                            multiple
                          ></v-select>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn text @click="assignUsers">Assigner</v-btn>
                          <v-btn text @click="assignDialog = false"
                            >Annuler</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-tab-item>
                </v-tabs-items>
              </div>
            </v-container>
          </v-card>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import AdminNav from "../../components/admin/AdminNav.vue";
import AdminAvatar from "../../components/admin/AdminAvatar.vue";

export default {
  components: {
    AdminNav,
    AdminAvatar,
  },
  data() {
    return {
      tab: 1,
      selectedUsers: [],
      assignDialog: false,
      dialog: false,
      users: [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
        { id: 3, name: "User 3" },
      ],
      dialogDetails: false,
      dialogEdit: false,
      newItem: {
        titre: "",
        sigle: "",
        description: "",
        lieu: "",
        latitude: null,
        longitude: null,
        budget: null,
        raison_proposition: "",
        date_proposition: "",
      },
      editItem: {
        titre: "",
        sigle: "",
        description: "",
        lieu: "",
        latitude: null,
        longitude: null,
        budget: null,
        raison_proposition: "",
        date_proposition: "",
      },
      map: null,
      marker: null,
      search: "",
      selectedUser: {},
      selectedFilter: "Tous les projets", // Updated to be a string, not an object
      filterOptions: [
        "Tous les projets",
        "Projet en cours",
        "Projet à faire",
        "Projet terminé",
      ],
      headers1: [
        { title: "Nom", key: "name", align: "start" },
        { title: "Date début", key: "startDate", align: "start" },
        { title: "Responsable", key: "manager", align: "start" },
        { title: "Statut", key: "status", align: "center" },
        { title: "Total tâche", key: "task", align: "center" },
        { title: "Action", key: "actions", align: "center" },
      ],

      items1: [
        {
          name: "Développement local",
          startDate: "2024-05-01",
          manager: "John Doe",
          status: "En cours",
          task: "3",
        },
        {
          name: "Assainissement de l'eau",
          startDate: "2024-06-01",
          manager: "Tokki Ervel",
          status: "Terminé",
          task: "2",
        },
        {
          name: "Le droit foncier",
          startDate: "2024-05-01",
          manager: "John Doe",
          status: "A faire",
          task: "10",
        },
      ],
      headers2: [
        { title: "Titre", key: "titre", align: "start" },
        { title: "Sigle", key: "sigle", align: "start" },
        { title: "Statut", key: "status", align: "start" },
        { title: "Date de proposition", key: "proposDate", align: "center" },
        { title: "Budget", key: "budget", align: "center" },
        { title: "Action", key: "actions", align: "center" },
      ],
      items2: [
        {
          titre: "Projet proposé1",
          proposDate: "2024-05-01",
          descr: "C'est un projet proposé numero1",
          sigle: "PP1",
          budget: "500$",
          status: "Proposé",
          partenaire: "Mr ervel",
        },
        {
          titre: "Projet proposé2",
          proposDate: "2024-05-01",
          dateAccept: "2024-10-07",
          descr: "C'est un projet proposé numero2",
          sigle: "PP2",
          budget: "1500$",
          status: "Accepté",
          partenaire: "Mr ervel",
        },
        {
          titre: "Projet proposé3",
          proposDate: "2024-05-01",
          descr: "C'est un projet proposé numero3",
          sigle: "PP3",
          budget: "800$",
          status: "Rejeté",
          partenaire: "Mr ervel",
        },
        {
          titre: "Projet proposé4",
          proposDate: "2024-10-02",
          dateAccept: "2024-10-08",
          descr: "C'est un projet proposé numero4",
          sigle: "PP4",
          budget: "1000$",
          status: "Accepté",
          partenaire: "Mr ervel",
        },
      ],
    };
  },
  
  computed: {
    filteredItems1() {
      if (this.selectedFilter === "Tous les projets") {
        return this.items1;
      } else if (this.selectedFilter === "Projet en cours") {
        return this.items1.filter((item) => ["En cours"].includes(item.status));
      } else if (this.selectedFilter === "Projet terminé") {
        return this.items1.filter((item) => ["Terminé"].includes(item.status));
      } else if (this.selectedFilter === "Projet à faire") {
        return this.items1.filter((item) => ["A faire"].includes(item.status));
      }
    },
    recentAcceptedProjects() {
      console.log("All Projects in items2:", this.items2); // Pour voir le contenu de items2
      const recentProjects = this.items2.filter(
        (project) =>
          project.status === "Accepté" && this.isRecent(project.dateAccept)
      );
      console.log("Recent Accepted Projects:", recentProjects); // Pour vérifier les projets filtrés
      return recentProjects;
    },
    allAcceptedProjects() {
      return this.items2.filter((project) => project.status === "Accepté");
    },
  },
  methods: {
    isRecent(date) {
      const projectDate = new Date(date);
      const now = new Date();
      console.log("Project Date:", projectDate); // Vérifiez si la date est correcte
      console.log("Now:", now); // Vérifiez la date actuelle
      return (
        projectDate >=
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      );
    },
    openAssignModal(project) {
      this.selectedProject = project;
      this.selectedUsers = [];
      this.assignDialog = true;
    },
    assignUsers() {
      // Logic for assigning users
      this.assignDialog = false;
      console.log(
        `Assigned users: ${this.selectedUsers} to project: ${this.selectedProject.name}`
      );
    },
    openModal() {
      this.dialog = true;
      this.$nextTick(() => {
        this.initMap();
      });
    },
    initMap() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            this.map = L.map("map").setView([lat, lng], 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              attribution: "© OpenStreetMap",
            }).addTo(this.map);

            this.marker = L.marker([lat, lng], { draggable: true }).addTo(
              this.map
            );

            // Écouter les événements de clic sur la carte
            this.map.on("click", (e) => {
              this.marker.setLatLng(e.latlng); // Déplacer le marqueur
              this.newItem.location = { lat: e.latlng.lat, lng: e.latlng.lng }; // Mettre à jour les coordonnées
              this.getLocationName(e.latlng.lat, e.latlng.lng); // Obtenir le nom du lieu
            });

            this.marker.on("dragend", () => {
              const position = this.marker.getLatLng();
              this.newItem.location = { lat: position.lat, lng: position.lng };
              this.getLocationName(position.lat, position.lng); // Obtenir le nom du lieu
            });
          },
          (error) => {
            console.error("Erreur de géolocalisation :", error);
            this.initDefaultMap();
          }
        );
      } else {
        this.initDefaultMap();
      }
    },
    initDefaultMap() {
      this.map = L.map("map").setView([48.8566, 2.3522], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(this.map);

      this.marker = L.marker([48.8566, 2.3522], { draggable: true }).addTo(
        this.map
      );

      this.map.on("click", (e) => {
  this.marker.setLatLng(e.latlng); // Déplacer le marqueur
  this.newItem.location = { lat: e.latlng.lat, lng: e.latlng.lng }; // Mettre à jour les coordonnées
  this.getLocationName(e.latlng.lat, e.latlng.lng); // Obtenir le nom du lieu et mettre à jour newItem.lieu
});


      this.marker.on("dragend", () => {
        const position = this.marker.getLatLng();
        this.newItem.location = { lat: position.lat, lng: position.lng };
        this.newItem.locationName = `(${position.lat}, ${position.lng})`; // Mettre à jour le champ lieu
      });
    },
 // Méthode pour mettre à jour le champ lieu avec les coordonnées
  updateMapFromLocation() {
    const location = this.newItem.lieu; // Le lieu sélectionné par l'utilisateur
    console.log("Lieu sélectionné :", location);

    // Vérifier si le lieu est vide
    if (!location) {
      alert('Veuillez entrer un lieu.');
      return;
    }

    this.getCoordinatesFromLocation(location)
      .then(coords => {
        console.log("Coordonnées récupérées :", coords);

        // Mise à jour des champs latitude, longitude et lieu avec les coordonnées
        this.newItem.latitude = coords.latitude;
        this.newItem.longitude = coords.longitude;
        this.newItem.lieu = `Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`; // Affiche dans le champ lieu

        // Optionnel : Mise à jour de la carte avec la nouvelle position
        this.marker.setLatLng([coords.latitude, coords.longitude]);
        this.map.setView([coords.latitude, coords.longitude], 13);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des coordonnées :", error);
        alert('Impossible de récupérer les coordonnées pour ce lieu.');
      });
  },

getCoordinatesFromLocation(location) {
    return new Promise((resolve, reject) => {
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`)
        .then(response => {
          if (!response.ok) {
            reject('Erreur lors de la requête vers l\'API de géocodage.');
            return;
          }
          return response.json();
        })
        .then(data => {
          if (data.length > 0) {
            // Récupérer les coordonnées du premier résultat
            const { lat, lon } = data[0];
            resolve({ latitude: lat, longitude: lon });
          } else {
            reject('Aucun résultat trouvé pour ce lieu.');
          }
        })
        .catch(error => reject(error));
    });
  },
  
getLocationName(lat, lng) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.display_name) {
        this.newItem.lieu = data.display_name;
      } else {
        this.newItem.lieu = `(${lat}, ${lng})`; // Fallback au cas où aucun nom de lieu n'est trouvé
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération du nom du lieu :", error);
      this.newItem.lieu = `(${lat}, ${lng})`;
    });
}
,

    closeModal() {
      this.dialog = false;
      this.resetForm();
    },
    // Méthode pour réinitialiser le formulaire
    resetForm() {
      this.newItem = {
        titre: "",
        sigle: "",
        description: "",
        lieu: "",
        latitude: null,
        longitude: null,
        budget: null,
        raison_proposition: "",
        date_proposition: "",
      };
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = null;
      }
    },
  async addItem() {
  // Ajoutez la date actuelle
  this.newItem.date_proposition = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

  console.log("Date de proposition:", this.newItem.date_proposition); 

  try {
    const response = await fetch('http://localhost:5000/admin/projets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titre: this.newItem.titre,
        sigle: this.newItem.sigle,
        description: this.newItem.description,
        budget: this.newItem.budget,
        raison_proposition: this.newItem.raison_proposition,
        date_proposition: this.newItem.date_proposition, // Utilisez la date actuelle
        latitude: this.newItem.latitude,
        longitude: this.newItem.longitude,
        lieu: this.newItem.lieu,
      }),
    });

    if (response.ok) {
      alert('Projet ajouté avec succès !');
      this.resetForm();
    } else {
      alert('Une erreur est survenue lors de l\'ajout du projet.');
    }
  } catch (error) {
    console.error('Erreur lors de la requête :', error);
    alert('Impossible de se connecter au serveur.');
  }
},


    viewDetails(item) {
      this.selectedUser = item;
      this.dialogDetails = true;
    },
    editProject(item) {
      this.editItem = { ...item };
      this.dialogEdit = true;
    },
    deleteProject(item) {
      this.items1 = this.items1.filter((i) => i !== item);
    },
    updateItem() {
      const index = this.items1.findIndex((i) => i.name === this.editItem.name);
      if (index !== -1) this.items1[index] = { ...this.editItem };
      this.dialogEdit = false;
    },
    getStatusColor(status) {
      switch (status) {
        case "En cours":
          return "red";
        case "A faire":
          return "blue";
        case "Terminé":
          return "green";
        case "En cours":
        case "À faire":
          return "orange";
        default:
          return "grey";
      }
    },
    getStatusColor1(status) {
      switch (status) {
        case "Proposé":
          return "blue";
        case "Rejeté":
          return "red";
        case "Accepté":
          return "green";
        case "en attente":
          return "orange";
        default:
          return "grey";
      }
    },
    togglePublish(item) {
      if (item.status === "Proposé") {
        item.status = "en attente";
      } else {
        item.status = "Proposé";
      }
    },
    viewDetails(item) {
      // Logique pour voir les détails
    },
    editProject(item) {
      // Logique pour éditer un projet
    },
    deleteProject(item) {
      // Logique pour supprimer un projet
    },
    archiveProject(item) {
      // Logique pour archiver un projet
    },
    changeStatus(item) {
      // Logique pour changer le statut d'un projet
    },
  },
};
</script>