// src/services/ChatService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import axios from 'axios';

const API_BASE = 'http://localhost:8083/api/chat';
const BACKEND_BASE = 'http://localhost:8083';
let stompClient = null;
let connected = false;


const connect = (token, onMessage) =>
  new Promise((resolve, reject) => {
    const socket = new SockJS(`${BACKEND_BASE}/ws?token=${token}`);

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        connected = true;          // bitno!
        stompClient.subscribe('/topic/public', msg =>
          onMessage(JSON.parse(msg.body))
        );
        resolve();                 // pusti openChat da nastavi
      },
      onStompError: frame => {
        console.error('Broker error:', frame);
        reject(frame);
      },
    });

    stompClient.activate();
  });


const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};

const subscribeToRoom = (roomId, callback) => {
  if (connected) {
    return stompClient.subscribe(`/topic/${roomId}`, message => {
      callback(JSON.parse(message.body));
    });
  }
};

const sendMessage = (roomId, message, sender) => {
  if (connected && stompClient.connected) {
    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        chatId: roomId,
        sender: sender,
        content: message,
        type: 'CHAT',
      }),
    });
  }
};

const getUserChats = () => axios.get(`${API_BASE}/rooms`);
const getMessages = (roomId) => axios.get(`${API_BASE}/${roomId}/messages`);
const createPrivateChat = (username) => axios.post(`${API_BASE}/private/${username}`);
const createGroupChat = (groupData) => axios.post(`${API_BASE}/group`, groupData);

export default {
  connect,
  disconnect,
  subscribeToRoom,
  sendMessage,
  getUserChats,
  getMessages,
  createPrivateChat,
  createGroupChat,
};
