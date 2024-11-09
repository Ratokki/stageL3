<template>
  <div>
    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <v-avatar class="monAvatar" size="40" v-bind="props">
          <v-img src="../../assets/admin.jpeg" height="64" cover></v-img>
        </v-avatar>
      </template>
      <v-list>
        <v-list-item @click="modalProfile">
          <v-list-item-title><v-icon>mdi-account</v-icon> Voir profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="modalEdit">
          <v-list-item-title><v-icon>mdi-account-edit</v-icon> Modifier compte</v-list-item-title>
        </v-list-item>
        <v-list-item @click="deconnexion">
          <v-list-item-title><v-icon>mdi-logout</v-icon> Se déconnecter</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Modal user compte -->
    <v-dialog v-model="modalVisibleCompte" max-width="500px">
      <v-card>
        <v-card-title>Mon compte</v-card-title>
        <v-card-text>
          <v-avatar size="64" class="mb-3">
            <img src="../../assets/admin.jpeg" alt="Toky" />
          </v-avatar>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Nom : {{ nom }}</v-list-item-title>
              <v-list-item-title>Prénom : {{ prenom }}</v-list-item-title>
              <v-list-item-subtitle>Email : {{ email }}</v-list-item-subtitle>
              <v-list-item-subtitle>Rôle : {{ profile }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="fermerModalCompte">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal edit profile -->
    <v-dialog v-model="modalVisibleEdit" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Modifier votre profil</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="nom"
              label="Nom"
              required
            ></v-text-field>
            <v-text-field
              v-model="prenom"
              label="Prénom"
              required
            ></v-text-field>
            <v-text-field
              v-model="email"
              label="Email"
              required
              type="email"
            ></v-text-field>
            <v-text-field
              v-model="profile"
              label="Profile"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="modifierProfil">Modifier</v-btn>
          <v-btn color="grey" text @click="fermerModalEdit">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalVisibleCompte: false,
      modalVisibleEdit: false,
      formValid: false,
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      profile: 'Utilisateur',
    };
  },
  methods: {
    modalEdit() {
      this.modalVisibleEdit = true;
    },
    modalProfile() {
      this.modalVisibleCompte = true;
    },
    fermerModalEdit() {
      this.modalVisibleEdit = false;
    },
    fermerModalCompte() {
      this.modalVisibleCompte = false;
    },
    modifierProfil() {
      if (this.$refs.form.validate()) {
        console.log("Modifier le profil", { nom: this.nom, prenom: this.prenom, email: this.email, profile: this.profile });
        this.fermerModalEdit();
      }
    },
    deconnexion() {
      console.log("Se déconnecter");
    }
  }
};
</script>

<style scoped>
.monAvatar {
  cursor: pointer;
}
</style>
