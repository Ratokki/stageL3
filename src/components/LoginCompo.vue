<template>
  <div>
    <v-snackbar v-model="snackbar" shaped top :color="snackbarColor" :timeout="timeout">
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false" append-icon="home">
        </v-btn>
      </template>
    </v-snackbar>

    <v-card elevation="4" class="pa-4 login-card">
      <v-form>
        <br />
        <center>
          <span class="login-title">Se connecter</span>
        </center>
        <br />

        <v-text-field
          placeholder="Exemple@gmail.com"
          color="success"
          class="login-input mx-auto"
          v-model="loginForm.email"
          name="email"
          density="comfortable"
          variant="outlined"
          rounded
          dense
          :rules="[emailRule]"
        ></v-text-field>

        <v-text-field
          v-model="loginForm.password"
          color="success"
          class="login-input mx-auto"
          :type="showPass ? 'text' : 'password'"
          @click:append="toggleShowPass"
          :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
          @input="checkFormValidity"
          density="comfortable"
          placeholder="Mot de passe"
          style="max-width: 500px; margin-left: -15px"
          variant="outlined"
          rounded
        ></v-text-field>

        <v-btn
          type="submit"
          elevation="0"
          :style="isFormInvalid ? 'background-color: white;' : 'background: linear-gradient(90deg, #91e658ea, #45af65ef);'"
          class="login-btn"
          @click.prevent="login"
          :loading="load"
          :disabled="isFormInvalid"
          :height="45"
          rounded
        >
          Connexion
        </v-btn>

        <div class="login-links">
          <center>
            <span class="no-account-text">N’a pas encore de compte?</span>
            <a class="signup-link" @click="inscrire()">S'inscrire</a>
          </center>
          <a class="forgot-password" @click="forgetPass()">Mot de passe oublié?</a>
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
      loginForm: {
        email: "",
        password: "",
      },
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "success",
      timeout: 2000,
      load: false,
      showPass: false,
      isFormInvalid: true,
      emailRule: (v) => v.includes("@gmail.com") || 'L\'adresse email doit contenir "@gmail.com"',
    };
  },
  methods: {
    
async login() {
  this.load = true;
  try {
    const response = await axios.post('http://localhost:5000/user/login', this.loginForm);
    const { user, token, status } = response.data; // Récupérez le statut

    if (status === 'En attente') {
      this.snackbarMessage = "Vous devez attendre l'acceptation de l'administration.";
      this.snackbarColor = "warning";
      this.snackbar = true;
      return; // Ne continuez pas après cela
    }

    if (status !== 'Accepté') {
      this.snackbarMessage = "Erreur lors de la connexion. Veuillez réessayer.";
      this.snackbarColor = "warning";
      this.snackbar = true;
      return; // Ne continuez pas après cela
    }

    localStorage.setItem('accessToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('userId', user.id); // Ajouter l'ID utilisateur séparément

    // Vérifier les rôles et rediriger en conséquence
    if (this.loginForm.email === 'tokkiervel@gmail.com' && this.loginForm.password === '123') {
      this.snackbarMessage = `Bienvenue ${this.loginForm.email}`;
      this.$router.push('/admin/dashboard');
    } else if (user.role === 'Chef de projet') {
      this.$router.push('/chefProjet/Projet');
    } else if (user.role === 'Employé') {
      this.$router.push('/employe/Tache');
    }else if (user.role === 'DAF') {
      this.$router.push('/daf/DashboardDaf');
    }else if (user.role === 'Proposeur') {
      this.$router.push('/proposeur/Dashboard');
    }
     else {
      this.snackbarMessage = "Rôle d'utilisateur non reconnu.";
      this.snackbarColor = "warning";
      this.snackbar = true;
    }

    this.snackbarMessage = `Bienvenue ${this.loginForm.email}`;
    this.snackbarColor = "success";
  } catch (err) {
    console.error(err);
    this.snackbarMessage = "Erreur de connexion, veuillez réessayer.";
    this.snackbarColor = "warning";
    this.snackbar = true;
  } finally {
    this.load = false;
  }
},



    toggleShowPass() {
      this.showPass = !this.showPass;
    },
    checkFormValidity() {
      this.isFormInvalid = !this.loginForm.email || !this.loginForm.password;
    },
    inscrire() {
      this.$router.push('/register');// Redirection ou logique pour l'inscription
    },
    forgetPass() {
      // Redirection ou logique pour mot de passe oublié
    },
  },
};
</script>

<style scoped>
.login-card {
  background-color: #ffffff;
  border-radius: 20px;
  margin-top: -10px;
}

.login-title {
  font-size: 25px;
}

.login-input {
  font-size: 14px;
  border-radius: 30px;
}

.login-btn {
  width: 100%;
  color: white;
  border-radius: 30px;
  height: 45px;
  text-transform: capitalize;
}

.login-links {
  margin-top: 20px;
  text-align: center;
}

.no-account-text {
  font-size: 13px;
  color: #3a3a3a;
}

.signup-link {
  color: #1d9a48;
  font-size: 13px;
}

.forgot-password {
  margin-top: 15px;
  text-align: right;
  font-size: 11px;
  opacity: 0.5;
  cursor: pointer;
}

.forgot-password:hover {
  text-decoration: underline;
}
</style>
