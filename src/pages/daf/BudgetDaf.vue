<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <DafNav />
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
                  <p>Budget</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <DafAvatar/>
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
import DafNav from "../../components/daf/DafNav.vue";
import DafAvatar from "../../components/daf/DafAvatar.vue";
export default {
    components: {
    DafNav,
    DafAvatar
  },
  data() {
    return {
    };
  },
  computed: {},
  methods: {},
};
</script>
