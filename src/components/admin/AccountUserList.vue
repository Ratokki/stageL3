<template>
  <v-col cols="12">
    <v-sheet elevation="0" style="background-color: white; border-radius: 10px; margin-top: -8px;">
      <v-container>
        <v-row align="center">
          <v-sheet class="d-flex justify-space-between align-center pa-4">
            <v-select v-model="selectedFilter" :items="filterOptions" persistent-hint single-line variant="plain" class="custom-select" style="max-width: 200px; margin-top: -5px"></v-select>
          </v-sheet>
          <v-spacer></v-spacer>
          <div>
            <v-text-field v-model="search" color="success" class="mx-auto" density="comfortable" placeholder="Recherche" prepend-inner-icon="mdi-magnify" style="max-width: 500px; margin-left: -15px" variant="outlined" rounded height="50px" width="300px"></v-text-field>
          </div>
          
        
          <!-- Modal pour Ajouter -->
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title><span class="headline">Ajouter un utilisateur</span></v-card-title>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field label="Nom" v-model="newItem.nom" required></v-text-field>
                  <v-text-field label="Prénom" v-model="newItem.prenom" required></v-text-field>
                  <v-text-field label="Email" v-model="newItem.email" required></v-text-field>
                  <v-select label="Rôle" :items="['Employé', 'Chef de projet', 'Partenaire']" v-model="newItem.role" required></v-select>
                  <v-radio-group v-model="newItem.genre" label="Genre" required>
                    <v-radio label="Homme" value="Homme"></v-radio>
                    <v-radio label="Femme" value="Femme"></v-radio>
                  </v-radio-group>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn text @click="closeModal">Annuler</v-btn>
                <v-btn text @click="addItem">Ajouter</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

<!-- snackbar -->
<v-snackbar
      :timeout="timeout"
      color="white"
      v-model="snackbarSuccessAccept"
      top
      transition="fade-blur"
      class="custom-snackbar"
    >
      <strong style="color: green;">{{ textSuccessAccept }}</strong>

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbarSuccessAccept = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Snackbar pour le rejet -->
    <v-snackbar
      v-model="snackbarSuccessReject"
      top
      color="red"
      rounded="pill"
      :timeout="timeout"
      class="custom-snackbar"
    >
      <b>{{ textSuccessReject }}</b>
      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbarSuccessReject = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar> 

        <v-row>
          <v-col cols="12">
            <v-data-table v-model:search="search" :headers="monHeader" :items="filteredItems" item-value="profile" style="border-radius: 15px; margin-top: -20px"
             :locale="{
    pageText: '{0}-{1} de {2}',
    itemsPerPageText: 'Éléments par page',
    noDataText: 'Aucune donnée disponible',
    nextPage: 'Page suivante',
    prevPage: 'Page précédente'
  }"
            >
              <template v-slot:item.profile="{ item }">
  <v-badge :color="item.status === 'Rejeté' ? 'error' : 'green'" dot>
    <v-avatar size="40">
  <v-img :src="getImageUrl(item.profile)" height="64" cover />



    </v-avatar>
  </v-badge>
</template>

              <template v-slot:item.role="{ item }">
                <v-chip :color="getStatusColor(item.role)" small dark class="justify-center">{{ item.role }}</v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
               
                <v-btn variant="text" icon @click="viewDetails(item)" style="margin-left: 5px" dark>
                  <img src="../../assets/eye.png" height="29px" />
                </v-btn>
          <v-btn
  elevation="0"
  class="text-none"
  :width="80"
  :height="35"
  :variant="item.status === 'Rejeté' ? 'outlined' : 'tonal'"
  style="font-size: 12px;"
  @click="showConfirmDialog(item)" 
  :color="item.status === 'Rejeté' ? 'green' : 'red'"
>
  {{ item.status === 'Rejeté' ? 'Débloquer' : 'Bloquer' }}
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
  <v-img :src="getImageUrl(selectedUser.profile)" />
</v-avatar>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Nom : {{ selectedUser.nom }}</v-list-item-title>
                  <v-list-item-title>Prénom : {{ selectedUser.prenom }}</v-list-item-title>
                  <v-list-item-subtitle>Email : {{ selectedUser.email }}</v-list-item-subtitle>
                  <v-list-item-subtitle>Rôle : {{ selectedUser.role }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
            <v-card-actions><v-btn text @click="dialogDetails = false">Fermer</v-btn></v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal edit -->
        <v-dialog v-model="dialogEdit" max-width="500px">
  <v-card>
    <v-card-title><span class="headline">Modifier l'utilisateur</span></v-card-title>
    <v-card-text>
      <v-form ref="form">
        <!-- Affichage de l'image actuelle -->
        <v-avatar size="64" class="mb-3">
           <v-img :src="getImageUrl(editedItem.profile || 'uploads/default-image.png')" cover></v-img>
        </v-avatar>
        
        <!-- Champ de sélection de fichier pour la nouvelle image -->
        <v-file-input
          label="Image de profil"
          accept="image/*"
          prepend-icon="mdi-camera"
          @change="onImageSelected"
          hide-input
        ></v-file-input>

        <!-- Autres champs de formulaire -->
        <v-text-field label="Nom" v-model="editedItem.nom" required></v-text-field>
        <v-text-field label="Prénom" v-model="editedItem.prenom" required></v-text-field>
        <v-text-field label="Email" v-model="editedItem.email" required></v-text-field>
        <v-select label="Rôle" :items="['Employé', 'Chef de projet', 'Partenaire']" v-model="editedItem.role" required></v-select>
        <v-radio-group v-model="editedItem.genre" label="Genre" required>
          <v-radio label="Homme" value="Homme"></v-radio>
          <v-radio label="Femme" value="Femme"></v-radio>
        </v-radio-group>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="closeEditModal">Annuler</v-btn>
      <v-btn text @click="updateUser">Modifier</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="confirmDialog" width="400">
  <v-card>
    <!-- Card Title with Outlined Confirmation Icon -->
    <v-card-title class="headline" style="margin-top: 5px; margin-right: -5px;">
      <v-icon left>mdi-check-circle-outline</v-icon>
      <span style="margin-top: 10px;">Confirmation</span>
    </v-card-title>

    <!-- Confirmation Text -->
    <v-card-text>
      Êtes-vous sûr de vouloir {{ actionType }} cet utilisateur ?
    </v-card-text>

    <!-- Card Actions -->
    <v-card-actions>
      <v-spacer></v-spacer>

      <!-- Cancel Button -->
      <v-btn 
        variant="flat" 
        rounded 
        class="text-none" 
        elevation="5" 
        color="white" 
        @click="confirmDialog = false"
        style="margin-top: -15px; margin-right: 5px;"
      >
        Annuler
      </v-btn>

      <!-- Dynamic Block/Unblock Button -->
      <v-btn 
        :width="100"
        variant="flat" 
        rounded 
        class="text-none" 
        :color="actionType === 'débloquer' ? 'green darken-1' : 'red'" 
        @click="confirmAction"
        style="margin-top: -15px; margin-right: 8px;"
      >
        {{ actionType === 'débloquer' ? 'Débloquer' : 'Bloquer' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>




      </v-container>
    </v-sheet>
  </v-col>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      textSuccessAccept: 'Projet accepté avec succés',
      textSuccessReject: 'Projet rejété',
      timeout: 3000,
      snackbarSuccessAccept: false,
      snackbarSuccessReject: false,
      confirmDialog: false,
      actionType: '', // 'bloquer' or 'débloquer'
      selectedUser: null,
      dialog: false,
      dialogDetails: false,
      newItem: { nom: "", prenom: "", email: "", role: "", genre: "", status: "" },
      dialogEdit: false,
      editedItem: { nom: "", prenom: "", email: "", role: "", genre: "", profile: "" },
      newProfileImage: null, // Variable pour stocker l'image sélectionnée
      search: "",
      selectedFilter: "Tous les utilisateurs",
      filterOptions: [
        "Tous les utilisateurs",
        "Employé",
        "Chef de projet",
        "Partenaire",
      ],
      monHeader: [
      { title: "Profile", key: "profile", align: "start" },
      { title: "Nom", key: "nom", align: "start" },
      { title: "Prénom", key: "prenom", align: "start" },
      { title: "Email", key: "email", align: "start" },
      { title: "Rôle", key: "role", align: "center" },
      { title: "Statut", key: "status", align: "center" },
      { title: "Action", key: "actions", align: "center" },
    ],
      items: [],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  computed: {
    filteredItems() {
      if (this.selectedFilter === "Tous les utilisateurs") return this.items;
      return this.items.filter(item => item.role === this.selectedFilter);
    },
  },
  methods: {
    getImageUrl(profile) {
    if (profile.startsWith('uploads')) {
      return `http://localhost:5000/${profile}`;
    } else if (profile.startsWith('/src/assets')) {
      // Remplacer les chemins src/assets par des chemins statiques
      return `/images/${profile.split('/').pop()}`;
    }
    return profile;
  },
  showConfirmDialog(user) {
      this.selectedUser = user;
      this.actionType = user.status === 'Rejeté' ? 'débloquer' : 'bloquer';
      this.confirmDialog = true;
    },
    async confirmAction() {
    const newStatus = this.selectedUser.status === 'Rejeté' ? 'Accepté' : 'Rejeté';

    try {
      await axios.post(`http://localhost:5000/admin/userStatus/${this.selectedUser.idUtilisateur}`, {
        status: newStatus
      });

      this.fetchUsers(); // Refresh the user list after update
      this.confirmDialog = false; // Close the dialog after the action

      // Affichage de la snackbar appropriée
      if (newStatus === 'Accepté') {
        this.textSuccessAccept = 'Utilisateur débloqué avec succès';
        this.snackbarSuccessAccept = true;
      } else {
        this.textSuccessReject = 'Utilisateur bloqué avec succès';
        this.snackbarSuccessReject = true;
      }
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de l'utilisateur :", error);
    }
  },
    closeEditModal() {
      this.dialogEdit = false;
    },
    editUser(item) {
      this.editedItem = { ...item };
      this.dialogEdit = true;
      this.newProfileImage = null; // Réinitialiser l'image
    },
    onImageSelected(event) {
  const file = event.target.files[0];
  if (file) {
    this.newProfileImage = file;
    this.editedItem.profile = URL.createObjectURL(file); // Prévisualisation
  } else {
    // Assurez-vous que cette partie charge une image par défaut si aucune image n'est sélectionnée
    this.editedItem.profile = this.editedItem.genre === 'Homme' 
      ? 'uploads/defaultMale.png' 
      : 'uploads/defaultFemale.png'; 
  }
}
,
    async updateUser() {
      try {
        let formData = new FormData();
        formData.append("nom", this.editedItem.nom);
        formData.append("prenom", this.editedItem.prenom);
        formData.append("email", this.editedItem.email);
        formData.append("role", this.editedItem.role);
        formData.append("genre", this.editedItem.genre);

        // Ajout de l'image si elle a été modifiée
        if (this.newProfileImage) {
          formData.append("profile", this.newProfileImage);
        } else {
          // Utilisation de l'image par défaut si aucune nouvelle image n'est sélectionnée
          const defaultImage = this.editedItem.genre === 'Homme' 
            ? require('@/assets/defaultMale.png') 
            : require('@/assets/defaultFemale.png');
          formData.append("profile", defaultImage);
        }

        await axios.put(`http://localhost:5000/user/${this.editedItem.idUtilisateur}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        this.fetchUsers(); // Actualiser la liste
        this.dialogEdit = false;
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      }
    },
    async fetchUsers() {
    try {
      const response = await axios.get('http://localhost:5000/admin/accountUsers');
      
      // Trier par date de création en décroissant pour afficher le dernier ajout en haut
      this.items = response.data.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation));
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  },
    openModal() {
      this.dialog = true;
    },
    closeModal() {
      this.dialog = false;
    },
    async addItem() {
      if (this.newItem.nom && this.newItem.email && this.newItem.role && this.newItem.genre) {
        try {
          const profileImage = this.newItem.genre === 'Homme' 
            ? require('@/assets/defaultMale.png') 
            : require('@/assets/defaultFemale.png');

          await axios.post('http://localhost:5000/admin/addUser', {
            ...this.newItem,
            profile: profileImage,
          });
          this.fetchUsers();
          this.closeModal();
          this.newItem = { nom: "", prenom: "", email: "", role: "", genre: "" };
        } catch (error) {
          console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        }
      }
    },
    async toggleBlockUser(user) {
      const newStatus = user.status === 'Rejeté' ? 'Accepté' : 'Rejeté';

      try {
        await axios.post(`http://localhost:5000/admin/userStatus/${user.idUtilisateur}`, {
          status: newStatus
        });

        await this.fetchUsers(); // Mettez à jour la liste des utilisateurs
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de l'utilisateur :", error);
      }
    },
    viewDetails(item) {
      this.selectedUser = item;
      this.dialogDetails = true;
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
          return "red";
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
