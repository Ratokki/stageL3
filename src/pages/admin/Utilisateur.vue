<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <AdminNav />
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
                  <p >Gestion d'utilisateur</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <v-avatar size="40">
                    <img
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                      alt="John"
                    />
                  </v-avatar>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- Liste d'utilisateurs -->
        <v-col cols="12">
          <v-sheet
            elevation="0"
            style="
              background-color: white;
              border-radius: 10px;
              margin-top: -8px;
            "
          >
            <v-container>
              <v-row align="center">
                <!-- Filtres et recherche -->
                <v-sheet class="d-flex justify-space-between align-center pa-4">
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
                    v-model="search"
                    color="success"
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
                  style="
                    color: white;
                    margin-top: -15px;
                    margin-right: 15px;
                    background: linear-gradient(90deg, #9bf560d3, #58d67ed7);
                  "
                  @click="openModal"
                  >Ajouter</v-btn
                >

                <!-- Modal pour Ajouter -->
                <v-dialog v-model="dialog" max-width="500px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Ajouter un utilisateur</span>
                    </v-card-title>
                    <v-card-text>
                      <v-form ref="form">
                        <v-text-field
                          label="Nom"
                          v-model="newItem.name"
                          required
                        ></v-text-field>
                        <v-text-field
                          label="Email"
                          v-model="newItem.mail"
                          required
                        ></v-text-field>
                        <v-select
                          label="Rôle"
                          :items="['Chef de projet', 'Employé', 'Partenaire']"
                          v-model="newItem.role"
                          required
                        ></v-select>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn text @click="closeModal">Annuler</v-btn>
                      <v-btn text @click="addItem">Ajouter</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>

              <!-- Liste de projets -->
              <v-row>
                <v-col cols="12">
                  <v-data-table
                    v-model:search="search"
                    :headers="headers1"
                    :items="filteredItems1"
                    item-value="name"
                    style="border-radius: 15px; margin-top: -20px"
                  >
                    <!-- Profil utilisateur -->
                    <template v-slot:item.profile="{ item }">
                      <v-avatar size="40">
                        <v-img
                          :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.profile}`"
                          height="64"
                          cover
                        ></v-img>
                      </v-avatar>
                    </template>

                    <!-- Rôle utilisateur -->
                    <template v-slot:item.role="{ item }">
                      <v-chip
                        :color="getStatusColor(item.role)"
                        small
                        dark
                        class="justify-center"
                      >
                        {{ item.role }}
                      </v-chip>
                    </template>

                    <!-- Actions -->
                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        variant="text"
                        icon
                        @click="viewDetails(item)"
                        style="margin-left: 5px"
                        dark
                      >
                        <img src="../../assets/eye.png" height="29px" />
                        <v-tooltip
                          activator="parent"
                          location="bottom"
                          class="custom-tooltip"
                        >
                          Voir détails
                        </v-tooltip>
                      </v-btn>
                      <v-btn variant="text" icon @click="editProject(item)">
                        <img src="../../assets/pencil.png" height="29px" />
                        <v-tooltip
                          activator="parent"
                          location="bottom"
                          class="custom-tooltip"
                        >
                          Modifier
                        </v-tooltip>
                      </v-btn>
                      <v-btn variant="text" icon @click="deleteProject(item)">
                        <img src="../../assets/delete.png" height="29px" />
                        <v-tooltip
                          activator="parent"
                          location="bottom"
                          class="custom-tooltip"
                        >
                          Supprimer
                        </v-tooltip>
                      </v-btn>
                      <v-btn variant="text" icon @click="changeStatus(item)">
                        <img src="../../assets/change.png" height="29px" />
                        <v-tooltip
                          activator="parent"
                          location="bottom"
                          class="custom-tooltip"
                        >
                          Changer rôle
                        </v-tooltip>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>

              <!-- Modal pour Détails -->
              <v-dialog v-model="dialogDetails" max-width="500px">
                <v-card>
                  <v-card-title>Détails de l'utilisateur</v-card-title>
                  <v-card-text>
                    <v-avatar size="64" class="mb-3">
                      <v-img
                        :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${selectedUser.profile}`"
                      />
                    </v-avatar>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title
                          >Nom : {{ selectedUser.name }}</v-list-item-title
                        >
                        <v-list-item-subtitle
                          >Email : {{ selectedUser.mail }}</v-list-item-subtitle
                        >
                        <v-list-item-subtitle
                          >Rôle : {{ selectedUser.role }}</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn text @click="dialogDetails = false">Fermer</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <!-- Modal pour Édition -->
              <v-dialog v-model="dialogEdit" max-width="500px">
                <v-card>
                  <v-card-title>Modifier l'utilisateur</v-card-title>
                  <v-card-text>
                    <v-form ref="formEdit">
                      <v-text-field
                        label="Nom"
                        v-model="editItem.name"
                        required
                      ></v-text-field>
                      <v-text-field
                        label="Email"
                        v-model="editItem.mail"
                        required
                      ></v-text-field>
                      <v-select
                        label="Rôle"
                        :items="['Chef de projet', 'Employé', 'Partenaire']"
                        v-model="editItem.role"
                        required
                      ></v-select>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn text @click="dialogEdit = false">Annuler</v-btn>
                    <v-btn text @click="updateItem">Enregistrer</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-container>
          </v-sheet>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AdminNav from "../../components/admin/AdminNav.vue";

export default {
    components: {
        AdminNav,
    },
  data() {
    return {
      dialog: false,
      dialogDetails: false,
      dialogEdit: false,
      newItem: { name: "", mail: "", role: "" },
      editItem: { name: "", mail: "", role: "" },
      selectedUser: {},
      search: "",
      selectedFilter: "Tous les utilisateurs",
      filterOptions: [
        "Tous les utilisateurs",
        "Employé",
        "Chef de projet",
        "Partenaire",
      ],
      headers1: [
        { title: "Profile", key: "profile", align: "start" },
        { title: "Nom", key: "name", align: "start" },
        { title: "Email", key: "mail", align: "start" },
        { title: "Rôle", key: "role", align: "center" },
        { title: "Action", key: "actions", align: "center" },
      ],
      items1: [
        {
          profile: "1.png",
          name: "tokki ervel",
          mail: "tokkiervel@gmail.com",
          role: "Chef de projet",
        },
        {
          profile: "2.png",
          name: "Ra Toky",
          mail: "tokyralaiarivelo@gmail.com",
          role: "Employé",
        },
        {
          profile: "3.png",
          name: "Mr ervel",
          mail: "ervel.toky@gmail.com",
          role: "Partenaire",
        },
      ],
    };
  },
  computed: {
    filteredItems1() {
      if (this.selectedFilter === "Tous les utilisateurs") return this.items1;
      return this.items1.filter((item) => item.role === this.selectedFilter);
    },
  },
  methods: {
    openModal() {
      this.dialog = true;
    },
    closeModal() {
      this.dialog = false;
    },
    addItem() {
      if (this.newItem.name && this.newItem.mail && this.newItem.role) {
        this.items1.push({ ...this.newItem, profile: "default.png" });
        this.closeModal();
        this.newItem = { name: "", mail: "", role: "" };
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
    getStatusColor(role) {
      switch (role) {
        case "Chef de projet":
          return "blue";
        case "Employé":
          return "green";
        case "Partenaire":
          return "orange";
        default:
          return "grey";
      }
    },
  },
};
</script>

<style scoped>
.monTitle {
  font-size: 22px;
  font-weight: 800;
  margin-top: 20px;
}

.monAvatar {
  margin-left: 50px;
}
</style>
