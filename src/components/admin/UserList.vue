<template>
  <v-col cols="12">
    <v-sheet elevation="0" style="background-color: white; border-radius: 10px; margin-top: -8px;">
      <v-container>
        <v-row>
          <v-col v-for="item in filteredItems" :key="item.id" cols="12">
            <v-card :height="90" elevation="0" style="border-radius: 10px; background-color: #F4F5FA;">
              <v-container>
                <v-row>
                  <v-col cols="7" class="d-flex align-center">
                    <v-row>
                      <v-col cols="2" style="margin-left: 12px; margin-top: 5px;">
                        <v-avatar size="40">
                          <v-img :src="getImageUrl(item.profile)" height="40" cover></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col cols="8" style="margin-left: -25px; margin-top: 5px;">
                        <div class="text-left">
                          <span>{{ item.nom }} {{ item.prenom }}</span>
                          <br />
                          <v-card-subtitle style="margin-left: -15px;">{{ item.email }}</v-card-subtitle>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="5" style="margin-top: -18px;">
                    <v-card-actions class="d-flex justify-end">
                      <div class="custom-switch-container">
                        <v-switch
                          v-model="item.statusSwitch"
                          hide-details
                          color="success"
                          class="custom-switch"
                          @change="openConfirmationDialog(item)"
                        >
                          <template v-slot:prepend>
                            <v-icon class="error" :class="{'active': item.statusSwitch === false}">
                              mdi-close-circle
                            </v-icon>
                          </template>
                          <template v-slot:append>
                            <v-icon class="success" :class="{'active': item.statusSwitch === true}">
                              mdi-check-circle
                            </v-icon>
                          </template>
                        </v-switch>
                        <v-chip v-if="item.statusSwitch !== null" :color="item.statusSwitch ? 'success' : 'red'" class="ml-2" text-color="white" variant="outlined" size="small" style="width: 65px; display: flex; justify-content: center; align-items: center;">
                          {{ item.statusSwitch ? 'Accepté' : 'Refusé' }}
                        </v-chip>
                        <v-chip v-if="item.statusSwitch === null" color="grey" class="ml-2" text-color="white" variant="outlined" size="small">
                          Choisir
                        </v-chip>
                      </div>
                    </v-card-actions>
                  </v-col>
                </v-row>
                <v-row align="center" style="margin-top: -35px;">
                  <v-col class="text-right">
                    <v-card-subtitle>Crée le: {{ formatDate(item.createdAt) }}</v-card-subtitle>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <!-- Dialog de confirmation -->
    <v-dialog v-model="confirmDialog" width="400">
      <v-card>
        <v-card-title class="headline" style="margin-top: 5px; margin-right: -5px;">
          <v-icon left>mdi-check-circle-outline</v-icon>
          <span style="margin-top: 10px;">Confirmation</span>
        </v-card-title>
        <v-card-text>
          Etes-vous sûre de faire cette action??
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" rounded class="text-none" elevation="5" color="white" @click="cancelAction" style="margin-top: -15px; margin-right: 5px;">
            Annuler
          </v-btn>
          <v-btn :width="120" variant="flat" rounded class="text-none" :color="actionType === 'accepter' ? 'red' : 'green darken-1'" @click="confirmAction" style="margin-top: -15px; margin-right: 8px;">
            {{ actionType === 'accepter' ? 'Oui,Refuser' : 'Oui,Accepter' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      previousStatus: null,
      confirmDialog: false,
      actionType: '',
      selectedUser: null,
      dialogDetails: false,
      newItem: { nom: "", prenom: "", email: "", role: "", genre: "" },
      search: "",
      selectedFilter: "Tous les utilisateurs",
      filterOptions: ["Tous les utilisateurs", "Employé", "Chef de projet", "Partenaire"],
      items1: [], // Tableau pour les utilisateurs
    };
  },
  mounted() {
    this.fetchUsers(); // Récupérer les utilisateurs lors du montage
  },
  computed: {
    filteredItems() {
      const filtered = this.selectedFilter === "Tous les utilisateurs" ? this.items1 : this.items1.filter(item => item.role === this.selectedFilter);
      return filtered.filter(item => item.nom.toLowerCase().includes(this.search.toLowerCase()));
    },
  },
  methods: {
    openConfirmationDialog(item) {
      this.selectedUser = item;
      this.previousStatus = item.statusSwitch; // Enregistrer l'état actuel du switch
      this.actionType = item.statusSwitch ? 'refuser' : 'accepter'; // Définir l'action en fonction de l'état
      this.confirmDialog = true;
    },
    confirmToggleUserStatus(item) {
      this.selectedUser = item;
      this.actionType = item.statusSwitch ? 'bloquer' : 'débloquer';
      this.confirmDialog = true;
    },
    async confirmAction() {
      const newStatus = this.selectedUser.status === 'Accepté' ? 'Rejeté' : 'Accepté';
      try {
        await axios.put(`http://localhost:5000/admin/acceptUser/${this.selectedUser.id}`, { status: newStatus });
        this.selectedUser.status = newStatus;
        this.selectedUser.statusSwitch = newStatus === 'Accepté';
        this.confirmDialog = false;
      } catch (error) {
        console.error(`Erreur lors du changement de statut de l'utilisateur : ${error}`);
        this.confirmDialog = false;
      }
    },
    cancelAction() {
      this.selectedUser.statusSwitch = this.previousStatus; // Restaurer l'état précédent du switch
      this.confirmDialog = false;
    },
    getImageUrl(profile) {
      if (profile) {
        return `http://localhost:5000/${profile}`; // URL de l'image stockée
      }
      return '/images/default.png'; // Image par défaut si aucune image de profil n'est fournie
    },
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:5000/admin/allUsers'); // Remplacez par votre URL
        this.items1 = response.data.map(user => ({
          id: user.idUtilisateur,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          profile: user.profile || '', // Ne plus utiliser defaultAvatar
          role: user.role,
          createdAt: user.createdAt, // Ajouter la date de création
          status: user.status,
          statusSwitch: user.status === 'Accepté' // Switch basé sur le statut de l'utilisateur
        }));
        this.items1.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    },
    async toggleUserStatus(item) {
  const newStatus = item.status === 'Accepté' ? 'Rejeté' : 'Accepté';
  try {
    await axios.put(`http://localhost:5000/admin/acceptUser/${item.id}`, { status: newStatus });
    // Mettre à jour l'état dans Vue
    this.$set(item, 'status', newStatus); 
    this.$set(item, 'statusSwitch', newStatus === 'Accepté');
  } catch (error) {
    console.error(`Erreur lors du changement de statut de l'utilisateur : ${error}`);
  }
}
,
    viewDetails(item) {
      this.selectedUser = item;
      this.dialogDetails = true;
    },
    formatDate(dateString) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    },
    async deleteProject(item) {
      try {
        await axios.delete(`http://localhost:5000/admin/delUser/${item.id}`);
        this.fetchUsers();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
      }
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
          return "gray";
      }
    }
  },
};
</script>

<style scoped>
.custom-switch-container {
  display: flex;
  justify-content: flex-start;
  align-items: center; /* Aligner le switch et le chip verticalement */
}
.custom-switch .v-input--selection-controls__ripple {
  background-color: transparent; /* Pour enlever l'effet de fond sur le switch */
}

.custom-switch .v-input--selection-controls__input {
  height: 10px; /* Hauteur personnalisée du bouton switch */
  width: 10px; /* Largeur personnalisée du bouton switch */
}

/* Personnalisation des couleurs du switch */
.custom-switch .v-switch--active .v-input--selection-controls__input {
  background-color: #4caf50; /* Vert pour "accepté" */
}

.custom-switch .v-input--selection-controls__input {
  background-color: #f44336; /* Rouge pour "rejeté" */
}

.v-icon {
  font-size: 24px;
  transition: color 0.3s ease, opacity 0.3s ease;
  opacity: 0.1; /* Icônes inactives */
}

.success.active {
  color: rgb(1, 161, 1);
  opacity: 1;
}

.success {
  color: lightgreen; /* Couleur plus pâle quand inactif */
}

.error.active {
  color: red;
  opacity: 1;
}

.error {
  color: lightcoral; /* Couleur plus pâle quand inactif */
}

.v-icon:not(.active) {
  opacity: 0.3;
  color: grey; /* Ajoute une couleur grise pour les icônes inactives */
}


.ml-2 {
  margin-left: 8px; /* Espacement entre le switch et le chip */
}
</style>
