<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <AdminNav />
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <!-- Toolbar -->
        <v-col cols="12">
          <v-card
            height="58"
            elevation="0"
            style="background-color: white; border-radius: 10px"
          >
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-col cols="10">
                  <p >Gestion d'utilisateur</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <AdminAvatar/>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        
        <!--  -->
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
              <div>
                <v-tabs v-model="tab" color="deep-purple-accent-4" lazy>
                  <v-tab :value="1" class="text-none"
                    >Listes des utilisateurs</v-tab
                  >
                  <v-tab :value="2" class="text-none"
                    >Nouveau Inscrit</v-tab
                  >

                </v-tabs>

                <v-tabs-items v-model="tab">
                  <v-tab-item value="1" v-show="tab === 1">
                    <!-- Liste des utilisateurs acceptés -->
                      <AccountUserList/>              
                  </v-tab-item>

                  <!-- Tab 2 -->

                  <v-tab-item value="2" v-show="tab === 2">
                    <UserList/> 
                  </v-tab-item>


                  <!-- tab 4 -->
                 
                
               </v-tabs-items>
              </div>
            </v-container>
          </v-card>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AdminNav from "../../components/admin/AdminNav.vue";
import UserList from "../../components/admin/UserList.vue";
import AdminAvatar from "../../components/admin/AdminAvatar.vue";

export default {
    components: {
        AdminNav,
        UserList, 
        AdminAvatar
    },
  data() {
    return {
      tab: 1,
      newUsers: [] // Pour stocker les utilisateurs non acceptés
    };
  },
  methods: {
  async fetchNewUsers() {
    try {
      const response = await axios.get('http://localhost:5000/admin/newUser');
      this.newUsers = response.data; // Remplir la liste avec les utilisateurs récupérés
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  },

  async acceptUser(idUtilisateur) {
    try {
      await axios.post(`http://localhost:5000/admin/acceptUser/${idUtilisateur}`); // Endpoint à définir
      this.fetchNewUsers(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors de l'acceptation de l'utilisateur :", error);
    }
  }
},
mounted() {
  this.fetchNewUsers(); // Récupérer les utilisateurs lors du chargement
}
  
};
</script>

<style scoped>
.monTitle {
  font-size: 22px;
  font-weight: 800;
  margin-top: 20px;
}

.monAvatar {
  margin-left: 50px;
}
</style>
