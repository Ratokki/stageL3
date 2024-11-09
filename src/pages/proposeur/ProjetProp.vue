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
                  <p>Page de proposition</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <v-avatar class="monAvatar" size="40">
                    <img
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                      alt="John"
                    />
                  </v-avatar>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        
      </v-container>
      <v-container fluid class="px-6 mt-n2" style="margin-top: -8px">
        <v-col cols="12" style="margin-top: -8px">
          <v-card
            elevation="0"
            style="
              background-color: white;
              border-radius: 10px;
              margin-top: -25px;
            "
          >
            <v-container style="margin-top: -6px">
              <ProposeProjet/>
            </v-container>
          </v-card>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ProposeProjet from '../../components/proposeur/ProposeProjet.vue';
import ProposeurNav from "../../components/proposeur/ProposeurNav.vue";

export default {
    components: {
    ProposeurNav,
    ProposeProjet
  },
  data() {
    return {
    };
  },
  computed: {},
  methods: {},
};
</script>
