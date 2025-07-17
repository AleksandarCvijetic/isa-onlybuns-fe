<template>
  <div>
    <!-- Floating Chat Icon -->
    <v-btn
      class="chat-button"
      color="primary"
      dark
      fab
      @click="dialog = true"
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
</div>
</template>

<script>
export default {
  name: "ChatModal",
  data() {
    return {
      dialog: false,
      chatSearch: "",
      chats: [],       // will be fetched from backend
      activeChat: null,
      messages: [],    // current chat messages
      newMessage: "",
      currentUser: ""
    };
  },
  computed: {
    filteredChats() {
      if (!this.chatSearch) return this.chats;
      return this.chats.filter(c =>
        c.name.toLowerCase().includes(this.chatSearch.toLowerCase())
      );
    }
  },
  methods: {
    selectChat(chat) {
      this.activeChat = chat;
      // TODO: fetch last messages for this chat
    },
    sendMessage() {
      if (!this.newMessage || !this.activeChat) return;
      // TODO: send via WebSocket
      this.newMessage = "";
    },
    startNewChat() {
      // TODO: open user list modal
    },
    startGroupChat() {
      // TODO: open group creation modal
    },
    formatTime(ts) {
      return new Date(ts).toLocaleTimeString();
    }
  }
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