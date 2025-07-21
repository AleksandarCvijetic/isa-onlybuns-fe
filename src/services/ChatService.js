// src/services/ChatService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import axios from 'axios';

/* HTTP енд-поинти */
const API_BASE     = 'http://localhost:8083/api/chat';
const BACKEND_BASE = 'http://localhost:8083';

/* STOMP & SockJS државе */
let stompClient       = null;
let connected         = false;
const roomSubscriptions = {};   // { roomId: StompSubscription }

/**
 * Креира везу према Spring-овом SockJS / STOMP endpoint-у
 *
 * @param {string}   token        JWT да се дода у query (?token=…)
 * @param {Function} onMessage    callback за поруке у “активној” соби
 * @param {Function} onNewChat    callback кад backend јави да је креиран нови chat (optional)
 */
export const connect = (token, onMessage, onNewChat) =>
  new Promise((resolve, reject) => {
    const socket = new SockJS(`${BACKEND_BASE}/ws?token=${token}`);

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay:   5000,           // аутоматски reconnect

      onConnect: () => {
        connected = true;

        /* лично обавештење да је неко направио приватни chat са нама */
        stompClient.subscribe('/user/queue/new-chat', msg => {
          if (typeof onNewChat === 'function') {
            onNewChat(JSON.parse(msg.body));
          }
        });

        resolve();
      },

      onStompError: frame => {
        console.error('STOMP error:', frame);
        reject(frame);
      },
    });

    stompClient.activate();
  });


export const disconnect = () => {
  if (stompClient) {
    // откажи све постојеће subscription-е
    Object.values(roomSubscriptions).forEach(sub => sub.unsubscribe());
    Object.keys(roomSubscriptions).forEach(k => delete roomSubscriptions[k]);

    stompClient.deactivate();
    stompClient = null;
    connected   = false;
  }
};


/**
 * Слушање једне собе (/topic/{id}).
 *   – ако већ слушамо ту собу, прво се одјавимо да не буде дупло.
 */
export const subscribeToRoom = (roomId, callback) => {
  if (!connected || !stompClient) return;

  // откачи претходни listener (ако постоји)
  if (roomSubscriptions[roomId]) {
    roomSubscriptions[roomId].unsubscribe();
  }

  roomSubscriptions[roomId] =
    stompClient.subscribe(`/topic/${roomId}`, msg =>
      callback(JSON.parse(msg.body)));
};


/**
 * Слање поруке у собу
 */
export const sendMessage = (roomId, message, sender) => {
  if (connected && stompClient?.connected) {
    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        chatId:  roomId,
        sender,            // email или username – шта већ шаљеш
        content: message,
        type:    'CHAT',
      }),
    });
  }
};


/* ---------- REST call helper-и ---------- */

export const getUserChats     = ()            => axios.get(`${API_BASE}/rooms`);
export const getMessages      = roomId        => axios.get(`${API_BASE}/${roomId}/messages`);
export const createPrivateChat= username      => axios.post(`${API_BASE}/private/${username}`);
export const createGroupChat  = payload       => axios.post(`${API_BASE}/group`, payload);
export const addUserToRoom    = (roomId, username) => axios.post(`${API_BASE}/${roomId}/users`, { username });
export const removeUserFromRoom = (roomId, username) => axios.delete(`${API_BASE}/${roomId}/users/${username}`);


/* ---------- default export ---------- */
export default {
  connect,
  disconnect,
  subscribeToRoom,
  sendMessage,
  getUserChats,
  getMessages,
  createPrivateChat,
  createGroupChat,
    addUserToRoom,
    removeUserFromRoom
};
