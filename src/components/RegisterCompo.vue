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
        <!-- Remplacer l'élément <center> par une classe Vuetify pour centrer -->
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

export default {
  data() {
    return {
      signupForm: {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        profile: 'mdi-user'
      },
      snackbar: false,
      text: '', // Mettre à jour dynamiquement le message de bienvenue après l'inscription
      timeout: 2000,
      load: false,
      isFormInvalid: true,
      textWrongPass: 'Mauvaise information, veuillez reéssayer',
      snackbarWrongPass: false,
      textDoneSignup: 'Compte créé avec succès',
      snackbarDoneSignup: false,
      showPass: false,
      emailRule: v => v.includes('@gmail.com') || "L'adresse email doit contenir '@gmail.com'"
    };
  },

  methods: {
    checkFormValidity() {
      // Validation du formulaire, mise à jour uniquement si nécessaire
      const isValid = this.signupForm.nom && this.signupForm.prenom && this.signupForm.email && this.signupForm.password;
      if (this.isFormInvalid !== !isValid) {
        this.isFormInvalid = !isValid;
      }
    },

    reverse() {
      this.showPass = !this.showPass;
    },

    async signup() {
            try {
                await axios.post('http://localhost:5000/user/register', this.signupForm)
                this.loginForm = { name: '', userName: '', email: '', password: '', numTelephone: '', profile: '' };
                this.signupForm.email = '',
                this.signupForm.name = '',
                this.signupForm.numTelephone = '',
                this.signupForm.password = '',
                this.signupForm.userName = '',
                this.snackbarDoneSignup = true
            }
            catch (err) {
                // alert('Erreur lors de la inscri');
            }
            // Ajoutez votre logique d'inscription ici
            console.log('Inscription en cours:', this.signupForm);
        },

    seConnecter() {
      this.$router.push('/login'); // Redirection vers la page de connexion
    }
  }
};
</script>

<style scoped>
.Forgot-password:hover {
  text-decoration: underline;
}

.monFont {
  font-size: 25px;
  font-family: 'ABeeZee';
}
</style>
