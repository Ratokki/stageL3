<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <ChefNav />
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
                  <p>Discussion</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <ChefAvatar />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- La section principale de discussion -->
        <v-col cols="12">
          <v-card
            elevation="0"
            style="background-color: white; border-radius: 10px; padding: 20px;"
          >
            <v-sheet class="d-flex justify-space-between align-start pa-4">
              <!-- Liste des utilisateurs -->
              <v-row no-gutters>
              <v-col cols="12" sm="4" class="pr-4">
                <span style="font-size: 15px; margin-left: 10px">Utilisateurs</span>
                 <v-list style="margin-top: 10px;">
  <v-list-item 

    v-for="user in users" 
    :key="user.idUtilisateur" 
    @click="initiateChat(user)" 
    class="cursor-pointer"
  >
    <v-row align="center">
      <v-col cols="2" class="ma-1">
        <v-avatar size="45">
          <v-img :src="getImageUrl(user.profile)" />
        </v-avatar>
      </v-col>
      <v-col cols="auto" class="ma-4">
        <v-row>
          <span style="font-size: 15px; margin-left: 5px">
            {{ user.nom }} {{ user.prenom }}
          </span>
        </v-row>
        <v-row>
          <v-chip :color="getStatusColor(user.role)" size="small">{{ user.role }}</v-chip>
        </v-row>
      </v-col>
      <!-- Badge pour les messages non lus -->
      <v-col cols="2" v-if="unreadMessages[user.idUtilisateur] > 0">
        <v-badge color="red" :content="unreadMessages[user.idUtilisateur]" />
      </v-col>
    </v-row>
  </v-list-item>
</v-list>

              </v-col>

              <!-- Carte de message -->
  <v-col cols="12" sm="8" v-if="selectedUser">
    <v-container>
    <v-row>
      
      <span style="font-size: 15px; margin-left: 10px">
      Discussion avec {{ selectedUser.nom }} {{ selectedUser.prenom }}
    </span>
    <v-spacer></v-spacer>
    <v-btn style="margin-top: -15px;" icon="mdi-close" size="small" @click="closeChat" class="cursor-pointer"></v-btn>
    
    </v-row>
    </v-container>
    
    
    <v-card ref="messageCard" elevation="3" class="message-card" outlined style="border-radius: 20px;margin-top: 15px; max-height: 400px; overflow-y: auto;">
      <v-card-text>
        <div v-for="message in messages" :key="message.date_envoi" :class="message.type_message" class="message-container mb-2">
  <v-avatar v-if="message.type_message === 'recepteur'" size="30" class="mr-2">
    <v-img :src="getImageUrl(selectedUser.profile)" />
  </v-avatar>
  
  <div :class="['message-content', message.type_message]">
    <p class="message-text" style="padding-left: 5px; padding-right: 5px; padding-top: 2px;">
      {{ message.message }}
    </p>
    <small class="message-date">{{ formatDate(message.date_envoi) }}</small>
    <!-- Afficher le fichier joint si présent -->
    <a v-if="message.fichier_joint" :href="`http://localhost:5000/uploads/${message.fichier_joint}`" target="_blank">
      📎 {{ message.fichier_joint }}
    </a>
  </div>
</div>
      </v-card-text>
      <v-card-actions>
  <!-- Champ de sélection de fichier -->
  <v-file-input
    label="Joindre un fichier"
    prepend-icon="mdi-paperclip"
    clearable
    hide-input
    @change="attachFile"
    accept="*"
  ></v-file-input>

  <!-- Zone de saisie du message -->
  <v-textarea
    v-model="newMessage"
    label="Écrire un message"
    auto-grow
    rows="1"
    outlined
    clearable
  ></v-textarea>
  
  <!-- Bouton envoyer -->
  <v-btn icon @click="sendMessage">
    <v-icon>mdi-send</v-icon>
  </v-btn>
</v-card-actions>
    </v-card>
  </v-col>
              </v-row>
            </v-sheet>
          </v-card>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import ChefNav from "../../components/chefProjet/ChefNav.vue";
import ChefAvatar from "../../components/chefProjet/ChefAvatar.vue";
import io from 'socket.io-client';
const socket = io('http://localhost:5000'); 

export default {
  components: { ChefNav, ChefAvatar },
  data() {
    return {
      users: [],
      messages: [],
      selectedUser: null,
      newMessage: '',
      userId: JSON.parse(localStorage.getItem('userData')).idUtilisateur,
      unreadMessages: {},
      socket: null, // Nouvelle propriété pour la connexion Socket.IO
      selectedFile: null, 
    };
  },
  methods: {
    attachFile(file) {
  if (file.size > 5 * 1024 * 1024) { // Limite de 5 Mo
    alert("Le fichier est trop volumineux.");
    return;
  }
  const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf']; // Exemple
  if (!allowedTypes.includes(file.type)) {
    alert("Type de fichier non pris en charge.");
    return;
  }
  this.selectedFile = file;
  this.newMessage += ` [Fichier joint: ${file.name}] `;
}
,
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + 
        ' à ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    },
    async fetchUsers() {
      // Récupérer les utilisateurs et initialiser `unreadMessages` pour chaque utilisateur
      const response = await axios.get('http://localhost:5000/admin/userDiscussion', { params: { idUtilisateur: this.userId } });
      this.users = response.data;
      this.users.forEach(user => {
        this.unreadMessages[user.idUtilisateur] = 0;
      });
    },
    async fetchMessages() {
      if (this.selectedUser) {
        const response = await axios.get('http://localhost:5000/discussion/messages', {
          params: { id_envoyeur: this.userId, id_recepteur: this.selectedUser.idUtilisateur }
        });
        // Filtrer les doublons de messages
        this.messages = response.data.filter((message, index, self) =>
          index === self.findIndex((m) => (
            m.date_envoi === message.date_envoi
          ))
        );
      }
    },
    initiateChat(user) {
      // Quand un utilisateur est sélectionné, afficher ses messages et remettre les messages non lus à zéro
      this.selectedUser = user;
      this.fetchMessages();
      this.unreadMessages[user.idUtilisateur] = 0;
    },
    async sendMessage() {
    if (this.newMessage.trim()) {
      const messageData = {
        id_envoyeur: this.userId,
        id_recepteur: this.selectedUser.idUtilisateur,
        message: this.newMessage,
        date_envoi: new Date().toISOString(),
        type_message: 'envoyeur'
      };
      await axios.post('http://localhost:5000/discussion/sendMessage', messageData);
      socket.emit('messageSent', messageData);
      
      // Ajoutez le message localement pour éviter un doublon
      this.messages.push(messageData);
      this.newMessage = '';

    }
  },
 /*    async sendMessage() {
      if (!this.newMessage.trim() && !this.selectedFile) {
  alert("Veuillez saisir un message ou joindre un fichier.");
  return;
}
    if ((this.newMessage.trim() || this.selectedFile) && this.selectedUser) {
      const formData = new FormData();
      formData.append('id_envoyeur', this.userId);
      formData.append('id_recepteur', this.selectedUser.idUtilisateur);
      formData.append('message', this.newMessage);
      formData.append('date_envoi', new Date().toISOString());
      formData.append('type_message', 'envoyeur');

      // Joindre le fichier si sélectionné
      if (this.selectedFile) {
        formData.append('fichier', this.selectedFile);
      }

      try {
        // Envoyer le message via l'API avec le fichier
        await axios.post('http://localhost:5000/discussion/sendMessage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Ajouter le message dans le tableau local pour un affichage instantané
        this.messages.push({
          id_envoyeur: this.userId,
          id_recepteur: this.selectedUser.idUtilisateur,
          message: this.newMessage,
          date_envoi: new Date().toISOString(),
          type_message: 'envoyeur',
          fichier_joint: this.selectedFile ? this.selectedFile.name : null,
        });

        // Envoyer le message au serveur via socket pour les autres utilisateurs
        socket.emit('messageSent', formData);
        
        // Réinitialiser la zone de saisie et le fichier
        this.newMessage = '';
        this.selectedFile = null;
      } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
      }
    }
  },*/
    getImageUrl(profile) {
      return profile ? `http://localhost:5000/${profile}` : '/images/default-profile.png';
    },
    getStatusColor(role) {
      switch (role) {
        case "Chef de projet": return "blue";
        case "Employé": return "green";
        case 'DAF':
      return 'orange';
        default: return "gray";
      }
    },
    closeChat() {
    this.selectedUser = null; // Fermer la carte de discussion
  },
  },
mounted() {
  this.fetchUsers();
socket.on('newMessage', this.handleNewMessage);
},

  beforeDestroy() {
    socket.off('newMessage', this.handleNewMessage);
  }
};
</script>


<style scoped>
.message-container {
  display: flex;
  align-items: flex-start;
  max-width: 100%;
}

.message-content {
  padding: 10px;
  word-wrap: break-word;
  width: fit-content;
  max-width: 70%; /* Limite la largeur maximale des messages */
  position: relative;
}

.envoyeur .message-content {
  background-color: #4bce72;
  margin-left: auto;
  border-radius: 20px 20px 0 20px;
  color: rgb(228, 227, 227);
}

.recepteur .message-content {
  background-color: rgb(238, 237, 237);
  margin-right: auto;
  border-radius: 0 20px 20px 20px;
  color: rgb(128, 128, 128);
}

.message-text {
  margin: 0;
}

.message-date {
  font-size: 0.75em;
  color: #7d7d7d;
  margin-top: 5px;
  display: block;
  text-align: right;
}

/* Personnalisation de la barre de défilement */
.message-card::-webkit-scrollbar {
  width: 6px;
}

.message-card::-webkit-scrollbar-thumb {
  background-color: #dbe0f7; /* Couleur de la barre */
  border-radius: 10px;
}

.message-card::-webkit-scrollbar-thumb:hover {
  background-color: #aaaaaa; /* Couleur de la barre lors du survol */
}
</style>
