<template>
  <v-app :style="{ backgroundColor: '#F4F5FA', fontFamily: 'ABeeZee' }">
    <EmployeNav />
    <v-main>
      <v-container fluid class="px-6 mt-n2">
        <v-col cols="12">
          <v-card height="58" elevation="0" style="background-color: white; border-radius: 10px">
            <v-container style="margin-top: -6px">
              <v-row align="center">
                <v-col cols="10">
                  <p>Discussion</p>
                </v-col>
                <v-col cols="2" class="text-right">
                  <EmployeAvatar/>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- Section principale de discussion -->
        <v-col cols="12">
          <v-card elevation="0" style="background-color: white; border-radius: 10px; padding: 20px;">
            <v-sheet class="d-flex justify-space-between align-start pa-4">
              <v-row no-gutters>
                <v-col cols="12" sm="4" class="pr-4">
                  <span style="font-size: 15px; margin-left: 10px">Utilisateurs</span>
                  <v-list style="margin-top: 10px;">
                    <!-- Section Chef de projet -->
                    <v-list-item 
                      v-if="chefProjet"
                      
                      @click="initiateChat(chefProjet)" 
                      class="cursor-pointer">
                      <v-row align="center">
                        <v-col cols="2" class="ma-1">
                          <v-avatar size="45">
                            <v-img :src="getImageUrl(chefProjet.profile)"></v-img>
                          </v-avatar>
                        </v-col>
                        <v-col cols="auto" class="ma-4">
                          <v-row>
                            <span style="font-size: 15px; margin-left: 5px"
                  >{{ chefProjet.nom }} {{ chefProjet.prenom }}</span
                >
                          </v-row>
                          <v-row>
                            <v-chip color="blue" size="small">Chef de projet</v-chip>
                          </v-row>
                        </v-col>
                        <v-col cols="auto" v-if="unreadMessages[chefProjet.idUtilisateur] > 0">
                          <v-badge color="red" :content="unreadMessages[chefProjet.idUtilisateur]" />
                        </v-col>
                      </v-row>
                    </v-list-item>

                    <!-- Section Coéquipiers -->
                    <v-list-item 
                      v-for="user in coequipiers" 
                      :key="user.idUtilisateur" 
                      
                      @click="initiateChat(user)" 
                      class="cursor-pointer">
                      <v-row align="center">
                        <v-col cols="2" class="ma-1">
                          <v-avatar size="45">
                            <v-img :src="getImageUrl(user.profile)"></v-img>
                          </v-avatar>
                        </v-col>
                        <v-col cols="auto" class="ma-4">
                          <v-row>
                            <span style="font-size: 15px; margin-left: 5px"
                  >{{ user.nom }} {{ user.prenom }}</span
                >
                          </v-row>
                          <v-row>
                            <v-chip color="green" size="small">Employé</v-chip>
                          </v-row>
                        </v-col>
                        <v-col cols="auto" v-if="unreadMessages[user.idUtilisateur] > 0">
                          <v-badge color="red" :content="unreadMessages[user.idUtilisateur]" />
                        </v-col>
                        
                      </v-row>
                    </v-list-item>
                  </v-list>
                </v-col>

                <!-- Carte de discussion -->
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
                  <v-card ref="messageCard" elevation="3" class="message-card" outlined style="border-radius: 20px; margin-top: 15px; max-height: 400px; overflow-y: auto;">
                    <v-card-text>
                      <div v-for="message in messages" :key="message.date_envoi" :class="message.type_message" class="message-container mb-2">
  <v-avatar v-if="message.type_message === 'recepteur'" size="30" class="mr-2">
    <v-img :src="getImageUrl(selectedUser.profile)" />
  </v-avatar>
  <div :class="['message-content', message.type_message]">
    <p class="message-text">{{ message.message }}</p>
    <div v-if="message.file" class="file-attachment">
      <a :href="`http://localhost:5000/uploads/${message.file}`" target="_blank">{{ message.file }}</a>
    </div>
    <small class="message-date">{{ formatDate(message.date_envoi) }}</small>
  </div>
</div>
                    </v-card-text>
                    <v-card-actions>
  <v-row align="center" justify="space-between">
    <!-- Champ de texte pour les messages -->
    <v-col cols="8">
      <v-textarea
        v-model="newMessage"
        label="Écrire un message"
        auto-grow
        rows="1"
        outlined
      ></v-textarea>
    </v-col>

    <!-- Bouton pour joindre des fichiers -->
    <v-col cols="auto">
      <v-btn icon @click="$refs.fileInput.click()">
        <v-icon>mdi-paperclip</v-icon>
      </v-btn>
      <input
        ref="fileInput"
        type="file"
        accept="image/*,application/pdf"
        style="display: none"
        @change="handleFileUpload"
      />
    </v-col>

    <!-- Bouton pour envoyer -->
    <v-col cols="auto">
      <v-btn icon @click="sendMessage">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-col>
  </v-row>
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
import EmployeNav from "../../components/employe/EmployeNav.vue";
import EmployeAvatar from "../../components/employe/EmployeAvatar.vue";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

export default {
  components: { EmployeNav, EmployeAvatar },
  data() {
    return {
      chefProjet: null,
      coequipiers: [],
      messages: [],
      selectedUser: null,
      newMessage: '',
      userId: JSON.parse(localStorage.getItem('userData')).idUtilisateur,
      socket: null, // Nouvelle propriété pour la connexion Socket.IO
      unreadMessages: {}, // Compteur pour messages non lus
      attachedFile: null,
    };
  },
  methods: {
    handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.attachedFile = file;
    }
  },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + 
        ' à ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    },
    
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:5000/admin/allUserDiscussion', {
          params: { idUtilisateur: this.userId }
        });
        this.chefProjet = response.data.chefProjet;
        this.coequipiers = response.data.coequipiers;

        // Initialiser les messages non lus
        [this.chefProjet, ...this.coequipiers].forEach(user => {
  if (user) {
    this.unreadMessages[user.idUtilisateur] = 0;
  }
}); 
console.log('Données des utilisateurs récupérées :', {
  chefProjet: this.chefProjet,
  coequipiers: this.coequipiers,
});
console.log('Messages non lus initialisés :', this.unreadMessages);      
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    },
    async fetchMessages() {
    if (this.selectedUser) {
      const response = await axios.get('http://localhost:5000/discussion/messages', {
        params: { id_envoyeur: this.userId, id_recepteur: this.selectedUser.idUtilisateur }
      });
      this.messages = response.data;
      this.scrollToBottom(); // Défile vers le bas après la récupération des messages
    }
  },
    
    initiateChat(user) {
      this.selectedUser = user;
      this.fetchMessages();

      // Réinitialiser le compteur des messages non lus pour cet utilisateur
      if (this.unreadMessages[user.idUtilisateur] > 0) {
        this.unreadMessages[user.idUtilisateur] = 0;
        this.notifyServerReadMessages(user.idUtilisateur); // Informer le serveur
      }
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
      this.scrollToBottom();
    }
  },
  /*async sendMessage() {
    if (this.newMessage.trim()) {
      const formData = new FormData();
      formData.append('id_envoyeur', this.userId);
      formData.append('id_recepteur', this.selectedUser.idUtilisateur);
      formData.append('message', this.newMessage);
      formData.append('date_envoi', new Date().toISOString());
      console.log(formData)
      
      try {
        await axios.post('http://localhost:5000/discussion/sendMessage', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        socket.emit('messageSent', { message: this.newMessage, file: this.attachedFile });

        // Ajout local du message
        this.messages.push({
          id_envoyeur: this.userId,
          id_recepteur: this.selectedUser.idUtilisateur,
          message: this.newMessage,
          date_envoi: new Date().toISOString(),
          type_message: 'envoyeur',
          file: this.attachedFile ? this.attachedFile.name : null,
        });

        // Réinitialiser le message et le fichier
        this.newMessage = '';
        this.attachedFile = null;
        this.$refs.fileInput.value = null;

        this.scrollToBottom();
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
      }
    }
  },
  */
 notifyServerReadMessages(receiverId) {
      // Informer le serveur que les messages non lus ont été lus
      socket.emit('messagesRead', {
        id_envoyeur: this.userId,
        id_recepteur: receiverId
      });
    },
handleNewMessage(data) {
      if (data.id_recepteur === this.userId) {
        // Si un message arrive pour l'utilisateur actuel
        if (!this.selectedUser || this.selectedUser.idUtilisateur !== data.id_envoyeur) {
          // Si la discussion avec l'expéditeur n'est pas active, incrémenter le compteur
          this.unreadMessages[data.id_envoyeur] = (this.unreadMessages[data.id_envoyeur] || 0) + 1;
        } else {
          // Si la discussion avec l'expéditeur est active, ajouter le message
          this.messages.push(data);
          this.scrollToBottom();
        }
      }
    },

    getImageUrl(profile) {
      return profile ? `http://localhost:5000/${profile}` : '/images/default-profile.png';
    },
    getStatusColor(role) {
      switch (role) {
        case "Chef de projet": return "blue";
        case "Employé": return "green";
        case "Partenaire": return "orange";
        default: return "gray";
      }
    },
    
  scrollToBottom() {
      this.$nextTick(() => {
        const messageCard = this.$refs.messageCard;
        if (messageCard) {
          messageCard.scrollTop = messageCard.scrollHeight;
        }
      });
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
    if (this.socket) {
      this.socket.disconnect(); // Fermer la connexion lors de la destruction du composant
    }
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

.r
ecepteur .message-content {
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
