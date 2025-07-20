<template>
  <div>
    <!-- Floating Chat Icon -->
    <v-btn
      class="chat-button"
      color="primary"
      dark
      fab
      @click="openChat"
    >
      <v-icon>mdi-message-text</v-icon>
    </v-btn>

    <!-- Chat Modal -->
    <v-dialog v-model="dialog" width="800">
      <v-card>
        <v-toolbar flat color="primary">
          <v-toolbar-title class="white--text">
            Chat
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon class="white--text">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-container fluid>
            <v-row no-gutters>
              <!-- Sidebar: Chat list + actions -->
              <v-col cols="4" class="pa-2 border-right">
                <v-text-field
                  v-model="chatSearch"
                  label="Search Chats"
                  dense
                  hide-details
                />
                <v-list two-line>
                  <v-list-item
                    v-for="chat in filteredChats"
                    :key="chat.id"
                    @click="selectChat(chat)"
                  >
                    <v-list-item-avatar>
                      <v-icon>mdi-account-circle</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ chat.name }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ chat.lastMessage }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-btn block color="secondary" @click="startNewChat">
                  New Chat
                </v-btn>
                <v-btn block color="secondary" class="mt-2" @click="startGroupChat">
                  New Group
                </v-btn>
              </v-col>

              <!-- Main Chat Window -->
              <v-col cols="8" class="pa-2">
                <div v-if="!activeChat">
                  <p>Select a chat to start messaging</p>
                </div>
                <div v-else class="chat-window">
                  <!-- Messages list -->
                  <div class="messages">
                    <div
                      v-for="msg in messages"
                      :key="msg.id"
                      :class="['message', msg.sender === currentUser ? 'sent' : 'received']"
                    >
                      <p class="message-content">{{ msg.content }}</p>
                      <small class="message-time">{{ formatTime(msg.timestamp) }}</small>
                    </div>
                  </div>

                  <!-- Message input -->
                  <v-text-field
                    v-model="newMessage"
                    label="Type a message"
                    @keyup.enter="sendMessage"
                    outlined
                    dense
                  />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- New Chat Dialog -->
    <v-dialog v-model="newChatDialog" max-width="400">
      <v-card>
        <v-toolbar flat color="primary">
          <v-toolbar-title class="white--text">New Chat</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="newChatDialog = false">
            <v-icon class="white--text">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            v-model="newChatSearch"
            label="Search Users"
            dense
            hide-details
          />
          <v-list>
            <v-list-item
              v-for="user in filteredNewChatUsers"
              :key="user.id"
              @click="createChat(user)"
            >
              <v-list-item-avatar>
                <v-icon>mdi-account-circle</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ user.username }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="newChatDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>
<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import ChatService from '@/services/ChatService';
import VueJwtDecode from 'vue-jwt-decode';

export default {
  name: 'ChatModal',

  data() {
    return {
      dialog: false,
      newChatDialog: false,
      chatSearch: '',
      newChatSearch: '',
      newChatUsers: [],
      newMessage: '',
      messages: [],
      chats: [],
      activeChat: null,
      currentUser: null,
      jwtToken: localStorage.getItem('jwtToken'),
    };
  },

  computed: {
    /*  Vuex getter-i  */
    ...mapGetters(['username', 'allUsers']),

    /** trenutno ulogovani korisnik */
    currentUser() {
      return this.username;
    },

    /** pretraga postojećih chat-ova */
    filteredChats() {
      if (!this.chatSearch) return this.chats;
      return this.chats.filter(c =>
        (c.name || '').toLowerCase().includes(this.chatSearch.toLowerCase())
      );
    },

    /** lista mutual korisnika za new-chat modal */
    filteredNewChatUsers() {
      if (!this.newChatSearch) return this.newChatUsers;
      return this.newChatUsers.filter(u =>
        u.username.toLowerCase().includes(this.newChatSearch.toLowerCase())
      );
    }
  },

  methods: {
    /* otvara glavni Chat modal */
    async openChat() {
      this.dialog = true;
      await ChatService.connect(this.jwtToken, this.handleIncomingMessage);
      const { data } = await ChatService.getUserChats();
      this.chats = data;
    },

    handleIncomingMessage(msg) {
      if (msg.chatId === String(this.activeChat?.id)) {
        this.messages.push(msg);
      }
    },

    async selectChat(chat) {
      this.activeChat = chat;
      const { data } = await ChatService.getMessages(chat.id);
      this.messages = data;
      ChatService.subscribeToRoom(chat.id, this.handleIncomingMessage);
    },

    sendMessage() {
      if (!this.newMessage || !this.activeChat) return;
      ChatService.sendMessage(
        this.activeChat.id,
        this.newMessage,
        this.currentUser,
      );
      this.newMessage = '';
    },

    /* dugme “New Chat” */
    async startNewChat() {
      this.newChatDialog = true;
      await this.fetchMutualUsers();
    },

    /** dohvat mutual follow korisnika */
    async fetchMutualUsers() {
      try {
        const token = localStorage.getItem('jwtToken');
        const decodedToken = VueJwtDecode.decode(token);
        const currentUserId = decodedToken.userId;
        console.log('Current User ID:', currentUserId);
        const resp = await axios.get(
          'http://localhost:8080/followers/mutual-follows', {
            params: { userId: currentUserId },
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        this.newChatUsers = resp.data;
      } catch (e) {
        console.error('Failed to load users', e);
      }
    },

    /* klik na korisnika u New Chat modal-u */
    async createChat(user) {
      const { data } = await ChatService.createPrivateChat(user.username);
      this.chats.push(data);
      this.newChatDialog = false;
      this.activeChat = data;
      this.messages = [];
    },

    startGroupChat() {
      // TODO
    },
  },
};
</script>

<style>
/* Global (unscoped) chat styles to ensure consistent placement */
.chat-button {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  z-index: 9999 !important;
}

.border-right {
  border-right: 1px solid #ddd;
}
.chat-window {
  display: flex;
  flex-direction: column;
  height: 400px;
}
.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 8px;
}
.message {
  margin: 4px 0;
  max-width: 70%;
  padding: 8px;
  border-radius: 8px;
}
.sent {
  background-color: #e0f7fa;
  align-self: flex-end;
}
.received {
  background-color: #f1f8e9;
  align-self: flex-start;
}
.message-content {
  margin: 0;
}
.message-time {
  font-size: 0.7rem;
  color: #666;
  text-align: right;
}
</style>