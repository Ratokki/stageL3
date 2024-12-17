<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <AdminNav />
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <v-col cols="12">
          <v-card height="58" elevation="0" style="background-color: white; border-radius: 10px">
            <v-container style="margin-top: -6px;">
              <v-row align="center">
                <v-col cols="8">
                  <p>Gestion d'utilisateur</p>
                </v-col>
                <v-col cols="4" class="text-right">
                <div style="display: flex; align-items: center; justify-content: flex-end;">
                  <v-btn elevation="0" rounded style="margin-right:25px;" @click.stop="menu = !menu">
                    <v-badge v-if="newUserCount > 0" color="red" :content="newUserCount">
                      <v-icon size="25">mdi-bell-outline</v-icon>
                    </v-badge>
                  </v-btn>
                  <AdminAvatar />
                  <v-menu v-model="menu" activator="parent" offset-y close-on-content-click>
                    <v-card max-width="300px">
                      <v-list>
                        <v-list-item v-for="(user, index) in pendingUsers" :key="index" :prepend-avatar="getImageUrl(user.profile)" :title="`${user.nom} ${user.prenom}`" :subtitle="'Nouvel utilisateur inscrit'">
                        </v-list-item>
                        <v-list-item v-if="pendingUsers.length === 0">
                          <v-list-item-title>Aucun utilisateur en attente</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>       
      </v-container>
      <v-container fluid class="px-6 mt-n2" style="margin-top: -8px">
        <v-col cols="12" style="margin-top: -8px">
          <v-card height="540px" elevation="0" style=" background-color: white; border-radius: 10px; margin-top: -25px;">
            <v-container style="margin-top: -6px">
              <div style="margin-top:10px;">
                <v-tabs v-model="tab" color="deep-purple-accent-4" lazy>
                  <v-tab :value="1" class="text-none">Listes des utilisateurs</v-tab>
                  <v-tab :value="2" class="text-none">
                    <v-badge v-if="newUserCount > 0" color="red" :content="newUserCount" overlap floating>
                      Nouveau Inscrit
                    </v-badge>
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                  <v-tab-item value="1" v-show="tab === 1">
                    <AccountUserList/>              
                  </v-tab-item>
                  <v-tab-item value="2" v-show="tab === 2">
                    <UserList/> 
                  </v-tab-item>                 
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
import axios from "axios"

export default {
    components: {
        AdminNav,
        UserList, 
        AdminAvatar,
        
    },
  data() {
    return {
      menu: false,
      tab: 1,
      newUsers: [],
      items1: [],
    };
  },
  methods: {
    getImageUrl(profile) {
    if (profile.startsWith('uploads')) {
      return `http://localhost:5000/${profile}`;
    } else if (profile.startsWith('/src/assets')) {
      
      return `/images/${profile.split('/').pop()}`;
    }
    return profile;
  },
  async fetchNewUsers() {
    try {
      const response = await axios.get('http://localhost:5000/admin/newUser');
      this.newUsers = response.data; 
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  },

   async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:5000/admin/allUsers');
        this.items1 = response.data.map(user => ({
          id: user.idUtilisateur,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          profile: user.profile || '',
          role: user.role,
          createdAt: user.createdAt,
          status: user.status,
          statusSwitch: user.status === 'Accepté' ? true
                       : user.status === 'Rejeté' ? false
                       : null, // Null pour "En attente"
        }));
        this.items1.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    },

  async acceptUser(idUtilisateur) {
    try {
      await axios.post(`http://localhost:5000/admin/acceptUser/${idUtilisateur}`); // Endpoint à définir
      this.fetchNewUsers(); // Rafraîchir la liste
      this.fetchUsers();
    } catch (error) {
      console.error("Erreur lors de l'acceptation de l'utilisateur :", error);
    }
  }
},
mounted() {
  this.fetchNewUsers(); // Récupérer les utilisateurs lors du chargement
  this.fetchUsers();
},
computed: {
    pendingUsers() {
    return this.items1.filter(user => user.statusSwitch === null);
  },
  newUserCount() {
    return this.pendingUsers.length; // Mettre à jour avec la nouvelle propriété
  },
  },
  
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
