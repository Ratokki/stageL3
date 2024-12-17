<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <ProposeurNav/>
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <!-- pour la toolbar -->
        <v-col cols="12">
          <v-card
            height="58"
            elevation="0"
            style="background-color: white; border-radius: 10px"
          >
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-col cols="10">
                  <p>Dashboard</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <ProposeurAvatar/>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        
        <!-- Contenu de dashboard -->
        <v-col cols="12">
          <v-card
            height="58"
            elevation="0"
            style="background-color: white; border-radius: 10px"
          >
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-sheet class="d-flex justify-space-between align-center pa-4">
                  
                </v-sheet>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ProposeurNav from "../../components/proposeur/ProposeurNav.vue";
import ProposeurAvatar from "../../components/proposeur/ProposeurAvatar.vue";
export default {
    components: {
    ProposeurNav,
    ProposeurAvatar,
  },
  data() {
    return {
    };
  },
  computed: {},
  methods: {},
};
</script>
