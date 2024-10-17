<template>
 <v-navigation-drawer v-model="drawer" color="#425c5a" class="rounded-e-xl">
  <v-sheet color="#3d5654" class="pa-4 rounded-te-xl text-center">
    <v-progress-circular model-value="80" color="#b49239" :size="100" :width="2">
      <v-avatar size="85">
        <v-img src="./assets/vect.png">
        </v-img>
      </v-avatar>
    </v-progress-circular>
    <div class="mt-4">AAE IdeaPro</div>
    <span class="mb-6 text-caption">aae.ideapro@gmail.com</span>
  </v-sheet>
  <v-list>
    <v-list-item v-for="(item, i) in links"
    :key="i" :value="item" active-class="border" :ripple="false">  
    <template>
      <v-icons :icon="item.icon" color="#849239"></v-icons>
    </template>
    <v-list-item-title v-text="item.text"></v-list-item-title> 
    </v-list-item>
  </v-list>
  <h5 class="ml-5 text-yellow-darken-2">ACTIVE USERS</h5>
  <v-row align="center" class="spacer ml-16 mt-4" no-gutters>
    <v-col cols="4" sm="2" md="1">
      <v-avatar size="36px">
        <v-img src="./assets/Fiantso.png"></v-img>
      </v-avatar>
    </v-col>
    <v-col cols="4" sm="2" md="1">
      <v-avatar size="36px">
        <v-img src="./assets/Fiantso.png"></v-img>
      </v-avatar>
    </v-col>
  </v-row>
  <div style="position: relative; z-index: 9999" class="mt-2">
    <v-img src="./assets/logo.png"></v-img>
  </div>
 </v-navigation-drawer>
</template>

<script setup>
import {ref} from "vue";

const links = [
  { text: "DASHBOARD", icon: "mdi-view-dashboard" },
  { text: "FLIGHTS", icon: "mdi-account" },
  { text: "WALLET", icon: "mdi-briefcase" },
  { text: "REPORTS", icon: "mdi-clipboard-check" },
  { text: "STATISTICS", icon: "mdi-cash-multiple" },
];
const drawer = ref(null);
</script>

<script>
export default {
  data: () => ({
    cards: ["today", "Yesterday"],
    drawer: null,
  }),
}
</script>

