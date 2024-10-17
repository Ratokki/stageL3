<template>
  <div :style="{ fontFamily: 'ABeeZee' }">
    <v-app-bar elevation="0" :height="100" class="app-bar" rounded>
      <v-row align="center" justify="space-between" class="w-100">
        <v-col cols="3">
          <v-img
            src="../assets/Fiantso.png"
            class="mt-1"
            width="130"
            style="margin-left: 40px"
          ></v-img>
        </v-col>

        <v-col cols="6" class="d-flex justify-center">
          <v-toolbar-title class="text-center">
            <v-btn class="text-capitalize">Accueil</v-btn>
            <v-btn class="text-capitalize">Projet</v-btn>
            <v-btn class="text-capitalize" to="/">Tableau de bord</v-btn>
            <v-btn class="text-capitalize">Partenaire</v-btn>
          </v-toolbar-title>
        </v-col>

        <v-col cols="3" class="d-flex justify-end">
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main class="background-page">
      <v-container class="mt-5">
        <v-row style="margin-top: -25px">
          <v-col cols="1"></v-col>
          <v-col
            cols="6"
            style="margin-top: -30px; margin-left: -20px"
            class="slide-in"
          >
            <h1
              class="fade-in-heading"
              style="font-size: 45px; font-weight: 100"
            >
              Gestion de projet chez l'ONG <span class="Fiantso">Fiantso</span>
            </h1>
            <p style="font-size: 14px; color: ; margin-top: 15px">
              Chez Fiantso Madagascar, nous mettons en œuvre une gestion de
              projet agile et collaborative, garantissant l'efficacité, la
              transparence et l'innovation à chaque étape de nos initiatives.
            </p>
            <br />
            <v-row>
              <v-col cols="4" style="margin-left: 5px">
                <v-btn
                  elevation="0"
                  color="#1D9A48"
                  style="
                    width: 100%;
                    color: white;
                    border-radius: 30px;
                    height: 45px;
                    background: linear-gradient(90deg, #91e658ea, #45af65ef);
                  "
                  @click="openModal"
                >
                  Commencer
                </v-btn>
                <!-- Modal pour Ajouter -->
                <v-dialog v-model="dialog" max-width="500px">
                  <v-container>
                    <v-row>
                      <v-col cols="1"></v-col>
                      <v-col cols="10"><LoginCompo /></v-col>
                      <v-col cols="1"></v-col>
                    </v-row>
                  </v-container>
                </v-dialog>
              </v-col>
              <v-col cols="8"></v-col>
            </v-row>
            <v-row style="margin-top: -10px">
              <v-col cols="4">
                <span style="margin-top: 10px">Total employés</span>
                <h1
                  style="font-size: 27px; font-weight: 400; margin-left: 13px"
                >
                  +50
                </h1>
              </v-col>
              <v-col cols="4" style="margin-left: -20px">
                <span style="margin-top: 10px">Projet en cours</span>
                <h1
                  style="font-size: 27px; font-weight: 400; margin-left: 13px"
                >
                  10
                </h1>
              </v-col>
              <v-col cols="4" style="margin-left: -20px">
                <span style="margin-top: 10px">Partenaire</span>
                <h1
                  style="font-size: 27px; font-weight: 400; margin-left: 13px"
                >
                  5
                </h1>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="5" style="margin-top: 30px">
            <v-img
              src="../assets/imgAccueil1.png"
              style="margin-right: 15px"
              class="slide-in-login"
            ></v-img>
          </v-col>
        </v-row> </v-container
      ><br /><br />

      <v-container class="mt-5">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="6">
            <h1 style="font-weight: 100">Notre projet en ce moment</h1>
          </v-col>
          <v-col cols="5"></v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <v-card class="mx-auto" max-width="344" style="border-radius: 20px">
              <v-card-title style="margin-top: 10px; font-weight: 1000;">
                Developpement local
              </v-card-title>

              <v-card-subtitle class="description">
                I'm a thing. But, like most politicians, he promised more than
                he could deliver. You won't have time for sleeping, soldier, not
                with all the bed making you'll be doing. Then we'll go with that
                data file! Hey, you add a one and two zeros to that or we walk!
                You're going to do his laundry? I've got to find a way to
                escape.
              </v-card-subtitle>

              <v-card-actions style="margin-top: -8px">
                <v-btn color="orange-lighten-2" text="Explore"></v-btn>

                <v-spacer></v-spacer>
                <v-btn
                  class="text-none"
                  rounded="xl"
                  @click="show = !show"
                  variant="text"
                  style="background: linear-gradient(90deg, #91e658ea, #45af65ef);color: white;
                    border-radius: 30px;
                    height: 38px;
                    background: linear-gradient(90deg, #91e658ea, #45af65ef);"
                >
                  Voir plus
                  <v-icon left>
                    {{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>
                  <v-card-title style="margin-top: 12px"
                    >Plus de détails</v-card-title
                  >
                  <v-card-subtitle> Avancement: 45% </v-card-subtitle>
                  <v-card-subtitle> Chef: Tokki ervel </v-card-subtitle>
                  <v-card-subtitle>
                    Date debut: 08 septembre 2024
                  </v-card-subtitle>
                  <v-card-subtitle> Nombre tâches: 10 </v-card-subtitle><br />
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="mx-auto" max-width="344" style="border-radius: 20px">
              <v-card-title style="margin-top: 10px; font-weight: 1000;">
                Droit foncier
              </v-card-title>

              <v-card-subtitle class="description">
                I'm a thing. But, like most politicians, he promised more than
                he could deliver. You won't have time for sleeping, soldier, not
                with all the bed making you'll be doing. Then we'll go with that
                data file! Hey, you add a one and two zeros to that or we walk!
                You're going to do his laundry? I've got to find a way to
                escape.
              </v-card-subtitle>

              <v-card-actions style="margin-top: -8px">
                <v-btn color="orange-lighten-2" text="Explore"></v-btn>

                <v-spacer></v-spacer>
                <v-btn
                  class="text-none"
                  rounded="xl"
                  @click="show = !show"
                  variant="text"
                  style="background: linear-gradient(90deg, #91e658ea, #45af65ef);color: white;
                    border-radius: 30px;
                    height: 38px;
                    background: linear-gradient(90deg, #91e658ea, #45af65ef);"
                >
                  Voir plus
                  <v-icon left>
                    {{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>
                  <v-card-title style="margin-top: 12px"
                    >Plus de détails</v-card-title
                  >
                  <v-card-subtitle> Avancement: 45% </v-card-subtitle>
                  <v-card-subtitle> Chef: Tokki ervel </v-card-subtitle>
                  <v-card-subtitle>
                    Date debut: 08 septembre 2024
                  </v-card-subtitle>
                  <v-card-subtitle> Nombre tâches: 10 </v-card-subtitle><br />
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="mx-auto" max-width="344" style="border-radius: 20px">
              <v-card-title style="margin-top: 10px; font-weight: 1000;">
                Evaluation de projet
              </v-card-title>

              <v-card-subtitle class="description">
                I'm a thing. But, like most politicians, he promised more than
                he could deliver. You won't have time for sleeping, soldier, not
                with all the bed making you'll be doing. Then we'll go with that
                data file! Hey, you add a one and two zeros to that or we walk!
                You're going to do his laundry? I've got to find a way to
                escape.
              </v-card-subtitle>

              <v-card-actions style="margin-top: -8px">
                <v-btn color="orange-lighten-2" text="Explore"></v-btn>

                <v-spacer></v-spacer>
                <v-btn
                  class="text-none"
                  rounded="xl"
                  @click="show = !show"
                  variant="text"
                  style="background: linear-gradient(90deg, #91e658ea, #45af65ef);color: white;
                    border-radius: 30px;
                    height: 38px;
                    background: linear-gradient(90deg, #91e658ea, #45af65ef);"
                >
                  Voir plus
                  <v-icon left>
                    {{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>
                  <v-card-title style="margin-top: 12px"
                    >Plus de détails</v-card-title
                  >
                  <v-card-subtitle> Avancement: 45% </v-card-subtitle>
                  <v-card-subtitle> Chef: Tokki ervel </v-card-subtitle>
                  <v-card-subtitle>
                    Date debut: 08 septembre 2024
                  </v-card-subtitle>
                  <v-card-subtitle> Nombre tâches: 10 </v-card-subtitle><br />
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>

        <v-footer
          class="background-page1 text-center d-flex flex-column mt-16"
        >
          <div>
            <v-btn
              v-for="icon in icons"
              :key="icon"
              :icon="icon"
              class="mx-4"
              variant="text"
            ></v-btn>
          </div>

          <div class="pt-0">
            Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet.
            Mauris cursus commodo interdum. Praesent ut risus eget metus luctus
            accumsan id ultrices nunc. Sed at orci sed massa consectetur
            dignissim a sit amet dui. Duis commodo vitae velit et faucibus.
            Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum
            ultrices, cursus iaculis dui sollicitudin. Vestibulum eu ipsum vel
            diam elementum tempor vel ut orci. Orci varius natoque penatibus et
            magnis dis parturient montes, nascetur ridiculus mus.
          </div>

          <v-divider></v-divider>

          <div>
            {{ new Date().getFullYear() }} — <strong>Fiantso Madagascar</strong>
          </div>
        </v-footer>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import LoginCompo from "@/components/LoginCompo.vue";

export default {
  components: {
    LoginCompo,
  },
  data: () => ({
    show: false,
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    dialog: false,
  }),
  methods: {
    openModal() {
      this.dialog = true;
    },
  },
};
</script>

<style>
.background-page {
  background-image: url("../assets/fond.jpg"); /* Remplacez par le chemin de votre image */
  background-size: cover; /* Ajuste l'image pour couvrir toute la zone */
  background-position: center; /* Centre l'image */
  min-height: 100vh; /* Assure que la hauteur minimale soit égale à celle de la fenêtre */
}

.background-page1 {
  background-image: url("../assets/fond.jpg"); /* Remplacez par le chemin de votre image */
}

.app-bar {
  background: rgba(
    224,
    232,
    236,
    0.055
  ) !important; /* Couleur de fond avec transparence */
  backdrop-filter: blur(5px); /* Optionnel : flou de l'arrière-plan */
}
.Fiantso {
  background: linear-gradient(to right, #cac061, #45af65ef);
  background-clip: text;
  color: transparent;
  font-weight: 120;
  border-color: rgb(223, 223, 223);
}

.description {
  white-space: normal;
  overflow-wrap: break-word;
}

.slide-in {
  transform: translateX(
    -100px
  ); /* Position initiale (hors écran ou légèrement décalée) */
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
