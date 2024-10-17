<template>
  <div>
    <!-- Fiantso Logo (Header) -->
    <v-img src="../assets/Fiantso.png" class="mt-4" width="130" style="margin: 25px 10px -40px 40px"></v-img>
    <br>
    <v-container class="mt-16">
      <!-- Row to center both the image and login form -->
      <v-row no-gutters justify="center" align="center">
        
        <!-- Image Column (Enlarged) -->
        <v-col cols="12" md="5" order="1" class="pa-4 text-center">
           <v-img
            alt="auction logo"
            contain
            src="../assets/imgAccueil.png"
            width="550"
            class="slide-in mt-2 mx-auto"
            style="margin-top: 20px;"
          />
        </v-col>

        <!-- Login Form Column (Original Size) -->
        <v-col cols="12" md="4" order="6" class="pa-4 text-center slide-in-login">
          <!-- Keeping the card size intact -->
          
            <LoginCompo />
          
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>

<script>
import LoginCompo from "@/components/LoginCompo.vue";

export default {
  name: "monLogin",
  data() {
    return {
      isSmallScreen: false,
    };
  },
  created() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.isSmallScreen = window.innerWidth < 600;
    },
  },
  components: { LoginCompo },
};
</script>

<style scoped>
.shrink {
  display: none;
}

.slide-in {
  transform: translateX(-100px); /* Position initiale (hors écran ou légèrement décalée) */
  transition: transform 1.3s ease; /* Durée et type de transition */
}

.slide-in-login {
  transform: translateX(100px); /* Décalage initial à droite */
  transition: transform 1.3s ease; /* Durée de 2 secondes */
}

/* Appliquer l'animation lorsque la page se charge */
.slide-in {
  animation: slideInAnimation 1.3s ease forwards;
}

.slide-in-login {
  animation: slideInLoginAnimation 1.3s ease forwards;
}


@keyframes slideInAnimation {
  from {
    transform: translateX(-100px); /* Départ à gauche */
  }
  to {
    transform: translateX(0); /* Position normale */
  }
}

@keyframes slideInLoginAnimation {
  from {
    transform: translateX(90px); /* Départ à droite */
  }
  to {
    transform: translateX(0); /* Position normale */
  }
}
</style>
