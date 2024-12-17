<template>
  <div>
    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <v-avatar class="monAvatar" size="40" v-bind="props">
          <v-img :src="getImageUrl(userProfileImage)" height="64" cover></v-img>
        </v-avatar>
      </template>
      <v-list>
        <v-list-item @click="modalProfile">
          <v-list-item-title><v-icon>mdi-account</v-icon> Voir profil</v-list-item-title>
        </v-list-item>
        <v-list-item @click="modalEdit">
          <v-list-item-title><v-icon>mdi-account-edit</v-icon> Modifier compte</v-list-item-title>
        </v-list-item>
        <v-list-item @click="deconnexion">
          <v-list-item-title><v-icon>mdi-logout</v-icon> Se déconnecter</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Modal Mon compte -->
    <v-dialog v-model="modalVisibleCompte" max-width="400px">
      <v-card>
        <v-card-title class="mx-4 mt-4" style="font-size: 22px;">
          <span style="margin-top: 10px;">Mon compte</span>
        </v-card-title>
        <v-card-text>
          <v-avatar size="64" class="mb-3">
            <v-img :src="getImageUrl(userProfileImage)" height="64" cover></v-img>
          </v-avatar>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle><strong>Nom :</strong> {{ nom }}</v-list-item-subtitle>
              <v-list-item-subtitle><strong>Prénom :</strong> {{ prenom }}</v-list-item-subtitle>
              <v-list-item-subtitle><strong>Email :</strong> {{ email }}</v-list-item-subtitle>
              <v-list-item-subtitle><strong>Genre :</strong> {{ genre }}</v-list-item-subtitle> <!-- Ajout du genre -->
              <v-list-item-subtitle><strong>Rôle :</strong> {{ role }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="flat" rounded class="text-none" elevation="5" color="white" @click="fermerModalCompte" style="margin-top: -20px; margin-right: 10px;">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Modifier le profil -->
    <v-dialog v-model="modalVisibleEdit" max-width="500px">
      <v-card>
        <v-card-title class="mx-4 mt-4" style="font-size: 22px;">
          <span style="margin-top: 10px;">Modifier votre profile</span>
        </v-card-title>
        <v-card-text>
          
          <v-form ref="form" style="margin-top: 5px;" v-model="formValid">
            <v-container style="margin-top: -15px;">
              <v-avatar size="100" class="mb-3 mx-auto">
                <v-img :src="imagePreview || getImageUrl(userProfileImage)" height="100" cover></v-img>
              </v-avatar>
              <div class="circle-icon-container">
                <v-file-input
                  v-model="profileImage"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  @change="onImageSelected"
                  hide-input
                  class="camera-icon-file-input"
                ></v-file-input>
              </div>
            </v-container>
              <v-row no-gutters>
                <v-col cols="12" sm="12">
                  <v-text-field class="mx-2" label="Nom" v-model="nom" density="comfortable" rounded variant="outlined" required></v-text-field>
                </v-col>               
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="12">
                  <v-text-field class="mx-2" label="Prénom" v-model="prenom" density="comfortable" rounded variant="outlined" required></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="12">
                  <v-text-field class="mx-2" label="Email" v-model="email" density="comfortable" rounded variant="outlined" required></v-text-field>
                </v-col>              
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="6">
                <v-select class="mx-2" v-model="role" label="Rôle" density="comfortable" rounded variant="outlined" :items="['Employé']" required></v-select>
                </v-col>
                <v-col cols="12" sm="6">
               <v-select class="mx-2" v-model="genre" label="Genre" density="comfortable" rounded variant="outlined" :items="['Homme', 'Femme']" required></v-select>
                </v-col>
              </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" rounded class="text-none" elevation="5" color="white" @click="fermerModalEdit" style="margin-top: -40px; margin-right: -20px;">
            Fermer
          </v-btn>
          <v-btn :width="auto" variant="flat" rounded class="text-none mx-6" color="green" @click="handleSubmit" style="margin-top: -40px; margin-right: 8px;">
            Modifier
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      modalVisibleCompte: false,
      modalVisibleEdit: false,
      formValid: false,
      nom: '',
      prenom: '',
      email: '',
      role: '',
      genre: '', // Ajout du genre
      profileImage: null,
      imagePreview: null,
      userId: null, // Pour stocker l'ID de l'utilisateur
      snackbar: {
      show: false,
      message: '',
      color: 'success', // Par défaut, succès
    },
        textSuccessEdit: 'Modification avec succéss',
      timeout: 2500,
      snackbarSuccessEdit: false,
    };
  },
  computed: {
    userProfileImage() {
      const userData = JSON.parse(localStorage.getItem('userData'));
      return userData?.profile ? this.getImageUrl(userData.profile) : null;
    }
  },
  mounted() {
  const storedUserData = JSON.parse(localStorage.getItem('userData'));
  console.log("Données utilisateur récupérées :", storedUserData); // Debugging
  if (storedUserData) {
    this.nom = storedUserData.nom;
    this.prenom = storedUserData.prenom;
    this.email = storedUserData.email;
    this.role = storedUserData.role;
    this.genre = storedUserData.genre;  // Ajout du genre
    this.imagePreview = `http://localhost:5000/${storedUserData.profile}`;
    this.userId = storedUserData.idUtilisateur; // Correction ici
    this.checkUserId(); // Vérifiez si l'ID de l'utilisateur est dans localStorage
  }
},

  methods: {
    getImageUrl(profile) {
      if (profile.startsWith('uploads')) {
        return `http://localhost:5000/${profile}`;
      } else if (profile.startsWith('/src/assets')) {
        return `/images/${profile.split('/').pop()}`;
      }
      return profile;
    },
    checkUserId() {
  const storedUserData = JSON.parse(localStorage.getItem('userData'));
  if (storedUserData && storedUserData.idUtilisateur) { // Vérifiez avec la bonne clé
    console.log("ID utilisateur connecté :", storedUserData.idUtilisateur);
    // Vous pouvez ajouter d'autres logiques ici si nécessaire
  } else {
    console.log("Aucun ID utilisateur trouvé dans localStorage.");
  }
},
    modalProfile() {
      this.modalVisibleCompte = true;
    },
    modalEdit() {
      this.modalVisibleEdit = true;
    },
    fermerModalEdit() {
      this.modalVisibleEdit = false;
    },
    fermerModalCompte() {
      this.modalVisibleCompte = false;
    },
    onImageSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.profileImage = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    async handleSubmit() {
      if (this.$refs.form.validate()) {
        const formData = new FormData();
        formData.append('nom', this.nom);
        formData.append('prenom', this.prenom);
        formData.append('email', this.email);
        formData.append('role', this.role);
        formData.append('genre', this.genre); // Inclure le genre

        if (this.profileImage) {
          formData.append('profile', this.profileImage);
        }

        try {
          const response = await axios.put(`http://localhost:5000/user/${this.userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          if (response.data && response.data.profileUrl) {
            const updatedUserData = {
              nom: this.nom,
              prenom: this.prenom,
              email: this.email,
              role: this.role,
              genre: this.genre,
              profile: response.data.profileUrl,
              id: this.userId // Conservez l'ID de l'utilisateur
            };

            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            this.imagePreview = null;
            this.modalVisibleEdit = false;
            this.snackbarSuccessEdit = true;
            this.$toast.success("Profil mis à jour avec succès.");
          } else {
            this.$toast.error("Erreur lors de la mise à jour du profil.");
          }
        } catch (error) {
          this.$toast.error("Erreur lors de la mise à jour du profil.");
        }
      }
    },
    deconnexion() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
      this.$router.push('/');
    }
  }
};
</script>
