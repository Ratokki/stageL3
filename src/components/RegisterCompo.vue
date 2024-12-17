<template>
  <div>
    <!-- Snackbar pour succès d'inscription -->
    <v-snackbar v-model="snackbar" shaped top color="success" :timeout="timeout">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false" append-icon="home"></v-btn>
      </template>
    </v-snackbar>

    <!-- Snackbar pour mot de passe incorrect -->
    <v-snackbar v-model="snackbarWrongPass" shaped color="warning" :timeout="timeout">
      <v-icon class="mr-3">mdi-alert</v-icon>
      <b>{{ textWrongPass }}</b>
    </v-snackbar>

    <!-- Snackbar pour réussite d'inscription -->
    <v-snackbar v-model="snackbarDoneSignup" shaped top color="success" :timeout="timeout">
      {{ textDoneSignup }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbarDoneSignup = false" append-icon="home"></v-btn>
      </template>
    </v-snackbar>

    <!-- Formulaire d'inscription -->
    <v-card elevation="4" class="pa-4" style="border-radius: 20px;">
      <v-form>
        <br />
        <div class="text-center">
          <span class="monFont">Ajouter un compte</span>
        </div>
        <br />

        <!-- Champs de texte pour nom, prénom, email et mot de passe -->
        <v-text-field v-model="signupForm.nom" placeholder="Nom" color="success" density="comfortable"
          variant="outlined"
          rounded @input="checkFormValidity"></v-text-field>
        <v-text-field v-model="signupForm.prenom" placeholder="Prénom" color="success" density="comfortable"
          variant="outlined"
          rounded @input="checkFormValidity"></v-text-field>
        <v-text-field v-model="signupForm.email" placeholder="Exemple@gmail.com" color="success" density="comfortable"
          variant="outlined"
          rounded :rules="[emailRule]"></v-text-field>
        <v-text-field v-model="signupForm.password" placeholder="Mot de passe" color="success" density="comfortable"
          variant="outlined"
          rounded :type="showPass ? 'text' : 'password'" @click:append="reverse()" :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'" @input="checkFormValidity"></v-text-field>
          <v-select label="Rôle" :items="['Employé', 'Chef de projet', 'Proposeur', 'DAF']" v-model="signupForm.role" density="comfortable" rounded variant="outlined" required></v-select>
          
      <v-select v-model="signupForm.genre" label="Genre" density="comfortable" rounded variant="outlined" :items="['Homme', 'Femme']" required></v-select>
        <v-btn type="submit" color="#1D9A48" style="width: 100%; color: white; border-radius: 30px; height: 45px; background: linear-gradient(90deg, #91e658ea, #45af65ef)" @click.prevent="signup" :loading="load">
          S'inscrire
        </v-btn>

        <div style="margin-top: 20px;" class="text-center">
          <span style="font-size: 13px; color: #3a3a3a;">J'ai déjà un compte ?</span>
          <a class="Forgot-password" style="color: #1D9A48; font-size: 13px;" @click="seConnecter">Se connecter</a>
        </div>
        <br />
      </v-form>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
//import defaultMale from '@/assets/defaultMale.jpg'; // Importer l'image pour homme
//import defaultFemale from '@/assets/defaultFemale.jpg'; // Importer l'image pour femme

export default {
  data() {
    return {
      signupForm: {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        profile: '', // Laisser vide au début
        role: '',
        genre: '',
      },
      snackbar: false,
      text: '',
      timeout: 2000,
      load: false,
      isFormInvalid: true,
      textWrongPass: 'Mauvaise information, veuillez réessayer',
      snackbarWrongPass: false,
      textDoneSignup: 'Compte créé avec succès',
      snackbarDoneSignup: false,
      showPass: false,
      emailRule: v => v.includes('@gmail.com') || "L'adresse email doit contenir '@gmail.com'"
    };
  },

  watch: {
  'signupForm.genre'(newGenre) {
    // Mettre à jour le profil par défaut en fonction du genre sélectionné
    if (newGenre === 'Homme') {
      this.signupForm.profile = 'uploads/defaultMale.jpg';
    } else if (newGenre === 'Femme') {
      this.signupForm.profile = 'uploads/defaultFemale.jpg';
    } else {
      this.signupForm.profile = ''; // Laisser vide si aucune sélection
    }
  }
}
,

  methods: {
    checkFormValidity() {
      const isValid = this.signupForm.nom && this.signupForm.prenom && this.signupForm.email && this.signupForm.password && this.signupForm.role && this.signupForm.genre;
      if (this.isFormInvalid !== !isValid) {
        this.isFormInvalid = !isValid;
      }
    },

    reverse() {
      this.showPass = !this.showPass;
    },

    async signup() {
      try {
        // S'assurer que le profil est défini avant d'envoyer les données
        if (!this.signupForm.profile) {
          this.snackbarWrongPass = true;
          this.textWrongPass = "Veuillez sélectionner un genre.";
          return;
        }

        await axios.post('http://localhost:5000/user/register', this.signupForm);
        this.signupForm = { nom: '', prenom: '', email: '', password: '', profile: '', role: '', genre: '' }; // Réinitialiser le formulaire
        this.snackbarDoneSignup = true;
      } catch (err) {
        console.error("Erreur lors de l'inscription :", err);
        this.snackbarWrongPass = true; // Afficher un snackbar pour indiquer l'erreur
        this.textWrongPass = err.response.data.message || 'Une erreur est survenue'; // Message d'erreur plus clair
      }
      console.log('Inscription en cours:', this.signupForm);
    },

    seConnecter() {
      this.$router.push('/'); // Redirection vers la page de connexion
    }
  }
};
</script>