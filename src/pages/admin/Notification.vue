<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <AdminNav />
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
                  <p>Page de notification</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <AdminAvatar/>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- la notification -->
        <v-col cols="12">
          <v-card
            height="58"
            elevation="0"
            style="background-color: white; border-radius: 10px"
          >
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-sheet class="d-flex justify-space-between align-center pa-4">
                  <v-select
                    v-model="selectedFilter"
                    :items="filterOptions"
                    persistent-hint
                    single-line
                    variant="plain"
                    class="custom-select"
                    style="max-width: 200px; margin-top: -5px"
                  ></v-select>
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
import AdminNav from "../../components/admin/AdminNav.vue";
import AdminAvatar from "../../components/admin/AdminAvatar.vue";


export default {
    components: {
       AdminNav,
       AdminAvatar, 
    },
  data() {
    return {
      selectedFilter: "Tous les notifications",
      filterOptions: [
        "Tous les notifications",
        "Inscription",
        "Proposition projet",
        "Avancement projet",
        "Tâche effectué",
        "Moyen budgetaire",
      ],
    };
  },
  computed: {},
  methods: {},
};
</script>
