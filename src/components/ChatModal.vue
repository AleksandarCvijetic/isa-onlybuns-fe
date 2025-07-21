<template>
  <div>
    <!-- Floating Chat Icon -->
    <v-btn class="chat-button" color="primary" dark fab @click="openChat">
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
                <v-text-field v-model="chatSearch" label="Search Chats" dense hide-details />
                <v-list two-line>
                  <v-list-item v-for="chat in filteredChats" :key="chat.id" @click="selectChat(chat)">
                    <v-list-item-avatar>
                      <v-icon>mdi-account-circle</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ chatTitle(chat) }}</v-list-item-title>
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
                  <div v-if="activeChat.group" class="d-flex align-center mb-2">
                    <v-icon left>mdi-account-multiple</v-icon>
                    <strong>Members:</strong>
                    <v-chip v-for="u in activeChat.usernames" :key="u" :closable="isAdmin && u !== currentUsername"
                      @click:close="removeMember(u)" class="ma-1">
                      {{ u }}
                    </v-chip>

                    <!-- “+” button only for admin -->
                    <v-btn icon small v-if="currentUsername === activeChat.adminUsername" @click="openAddMemberDialog">
                      <v-icon>mdi-account-plus</v-icon>
                    </v-btn>
                  </div>

                  <!-- Messages list -->
                  <div ref="msgBox" class="messages">
                    <v-row v-for="msg in messages" :key="msg.id ?? msg.timestamp"
                      :justify="msg.sender === currentUsername ? 'end' : 'start'">
                      <v-card :color="msg.sender === currentUsername ? 'light-blue lighten-4' : 'light-green lighten-4'"
                        elevation="2" class="pa-3" max-width="70%">
                        <div class="message-content">{{ msg.content }}</div>
                        <div class="message-time text-right">{{ formatTime(msg.timestamp) }}</div>
                      </v-card>
                    </v-row>
                  </div>

                  <!-- Message input -->
                  <v-text-field v-model="newMessage" label="Type a message" @keyup.enter="sendMessage" outlined dense />
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
          <v-text-field v-model="newChatSearch" label="Search Users" dense hide-details />
          <v-list>
            <v-list-item v-for="user in filteredNewChatUsers" :key="user.id" @click="createChat(user)">
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
    <!-- New Group Dialog -->
    <v-dialog v-model="groupDialog" max-width="500">
      <v-card>
        <v-toolbar flat color="primary">
          <v-toolbar-title class="white--text">New Group</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="groupDialog = false">
            <v-icon class="white--text">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-text-field v-model="newGroupName" label="Group Name" dense />

          <!-- multi-select users -->
          <v-autocomplete v-model="newGroupMembers" :items="newChatUsers.map(u => u.username)" label="Add members"
            multiple chips hide-details />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="submitNewGroup" :disabled="!newGroupName || !newGroupMembers.length">
            Create Group
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Add Member Dialog -->
    <v-dialog v-model="addMemberDialog" max-width="400">
      <v-card>
        <v-toolbar flat color="primary">
          <v-toolbar-title class="white--text">Add member</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="addMemberDialog = false">
            <v-icon class="white--text">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-autocomplete v-model="newMemberUsername" :items="addableUsers" label="Username" hide-details />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="submitAddMember" :disabled="!newMemberUsername">
            Add
          </v-btn>
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
      me: null,
      dialog: false,
      newChatDialog: false,
      chatSearch: '',
      newChatSearch: '',
      newChatUsers: [],
      newMessage: '',
      messages: [],
      chats: [],
      activeChat: null,
      jwtToken: localStorage.getItem('jwtToken'),
      groupDialog: false,
      newGroupName: '',
      newGroupMembers: [],
      addMemberDialog: false,
      newMemberUsername: '',

    };
  },
  async created() {
    // 1. grab the JWT and decode it
    const token = localStorage.getItem('jwtToken');
    const decoded = VueJwtDecode.decode(token);

    // 2. fetch your full user object exactly once
    try {
      const { data } = await axios.get(
        `http://localhost:8080/auth/getById/${decoded.userId}`
      );
      this.me = data;
    } catch (err) {
      console.error('Failed to fetch current user', err);
    }
  },

  computed: {
    /*  Vuex getter-i  */
    ...mapGetters(['username', 'allUsers']),

    fetchMe() {
      return this.fetchMe();
    },
    isAdmin() {
      return this.currentUsername === this.activeChat.adminUsername
    },
    addableUsers() {
      if (!this.activeChat || !Array.isArray(this.newChatUsers)) {
        return [];
      }
      return this.newChatUsers
        .map(u => u.username)
        .filter(username => !this.activeChat.usernames.includes(username));
    },
    allUsernamesForGroup() {
      if (Array.isArray(this.allUsers)) {
        return this.allUsers.map(u => u.username);
      }
      // if it’s an object keyed by id, turn it into an array:
      if (this.allUsers && typeof this.allUsers === 'object') {
        return Object.values(this.allUsers).map(u => u.username);
      }
      return [];
    },
    /** trenutno ulogovani korisnik */
    currentUser() {
      console.log('Current User:', this.username);
      return this.username;
    },
    currentUsername() {
      return this.me?.username || null;
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
    scrollToBottom() {
      // $refs.msgBox може бити null при првом mount-у
      this.$nextTick(() => {
        const box = this.$refs.msgBox;
        if (box) {
          box.scrollTop = box.scrollHeight;   // instant scroll
          // или, ако хоћеш глатко:
          // box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
        }
      });
    },
    async openAddMemberDialog() {
      // re-fetch in case your mutuals list has changed
      await this.fetchMutualUsers();
      this.newMemberUsername = '';
      this.addMemberDialog = true;
    },
    async submitAddMember() {
      await ChatService.addUserToRoom(this.activeChat.id, this.newMemberUsername);
      this.activeChat.usernames.push(this.newMemberUsername);
      this.addMemberDialog = false;
    },
    async removeMember(username) {
      try {
        // ① call your DELETE endpoint
        await ChatService.removeUserFromRoom(this.activeChat.id, username);

        // ② locally remove them from the UI
        this.activeChat.usernames = this.activeChat.usernames.filter(u => u !== username);
      } catch (e) {
        console.error('Failed to remove user', e);
        // you might want to show a toast here
      }
    },
    /* otvara glavni Chat modal */
    async openChat() {
      this.dialog = true;

      /* ➊ проследи и handleNewChat */
      await ChatService.connect(this.jwtToken,
        this.handleIncomingMessage,
        this.handleNewChat);

      const { data } = await ChatService.getUserChats();
      this.chats = data;
    },

    handleIncomingMessage(msg) {
      if (msg.chatId === String(this.activeChat?.id)) {
        this.messages.push({
          id: null,
          sender: msg.sender,   // već string
          content: msg.content,
          timestamp: msg.timestamp
        });
      }
    },
    /* ➍ прихвати нотификацију да је другој страни креиран нови чет */
    handleNewChat(room) {
      if (!this.chats.find(c => c.id === room.id))
        this.chats.push(room);
      // ако желиш аутоматско отварање:
      // this.selectChat(room);
    },

    /* ➋ када из листе изабереш собу */
    async selectChat(chat) {
      this.activeChat = chat;
      ChatService.subscribeToRoom(chat.id, this.handleIncomingMessage);

      const { data } = await ChatService.getMessages(chat.id);
      console.log('Fetched messages:', data);
      this.messages = data.map(m => ({
        id: m.id,
        sender: m.senderUsername,  // sad je string
        content: m.content,
        timestamp: m.timestamp
      }));
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

    /* ➌ када креираш потпуно нови приватни чет */
    async createChat(user) {
      const { data: room } = await ChatService.createPrivateChat(user.username);

      // додај у листу ако фали
      if (!this.chats.find(c => c.id === room.id))
        this.chats.push(room);

      this.newChatDialog = false;

      // одмах се пребаци у ту собу
      this.selectChat(room);           // ово ће позвати subscribe + довући поруке
      this.messages = [];              // (празно јер је ново)
    },

    startGroupChat() {
      this.groupDialog = true;
      this.fetchMutualUsers();
    },
    /** Actually create the group on the backend */
    async submitNewGroup() {
      const payload = {
        name: this.newGroupName,
        usernames: this.newGroupMembers
      };
      const { data: room } = await ChatService.createGroupChat(payload);
      this.chats.push(room);
      this.groupDialog = false;
      this.newGroupName = '';
      this.newGroupMembers = [];
    },
    formatTime(ts) {
      return new Date(ts).toLocaleTimeString();
    },

    chatTitle(chat) {
      if (chat.name) {
        return chat.name;
      }
      // ② otherwise it’s a 1‑on‑1: find the one chat.usernames entry
      //    that is **not** the current user’s *backend* username
      const other = chat.usernames.find(
        u => u !== this.currentUsername
      );

      // ③ simply return that string (or a fallback)
      return other || 'Unknown';
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