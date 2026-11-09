<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useFirebase } from '../../store/firebase.js';
import PlayerBlock from './PlayerBlock.vue';
import './Nexus.css';

const firebase = useFirebase();

const users = ref(null);
const lastCheck = ref(Date.now());

let lastCheckInterval = null;
let heartbeatInterval = null;
let unsubscribeUsers = null;

// Periodically update time = online statuses
const startClockTicker = () => {
  lastCheckInterval = setInterval(() => {
    lastCheck.value = Date.now();
  }, 2000);
};

// Real-time listener for Users collection in Firestore
const listenToUsersChanges = () => {
  const usersRef = collection(firebase.db, 'Users');
  const usersQuery = query(usersRef, orderBy('ping', 'desc'));
  const unsubscribe = onSnapshot(
    usersQuery,
    (snapshot) => {
      const table = snapshot.docs.map((docSnap) => ({
        uid: docSnap.id,
        ...docSnap.data(),
      }));
      users.value = table;
    },
    (error) => {
      console.error('Błąd pobierania danych użytkowników z Firestore:', error);
      users.value = [];
    }
  );

  return unsubscribe;
};

// Heartbeat - updates current user's ping in Firestore
const updatePing = async () => {
  const currentUid = firebase.auth?.currentUser?.uid;
  if (!currentUid) return;

  try {
    const userRef = doc(firebase.db, 'Users', currentUid);
    await updateDoc(userRef, {
      ping: serverTimestamp(),
      online: true,
    });
  } catch (error) {
    console.warn('Nie udało się zaktualizować pingu:', error);
  }
};

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    updatePing();
  }
};

onMounted(() => {
  startClockTicker();
  unsubscribeUsers = listenToUsersChanges();

  // Send a ping on load and every 10s
  updatePing();
  heartbeatInterval = setInterval(updatePing, 10000);

  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
  if (lastCheckInterval) clearInterval(lastCheckInterval);
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  if (unsubscribeUsers) unsubscribeUsers();
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
  <div class="nexus-wrapper">
    <h1 class="header-shadow">Nexus</h1>

    <!-- The skeleton -->
    <div v-if="users === null" class="NexusContainer">
      <div v-for="n in 3" :key="n" class="PlayerBlock">
        <div class="status-dot"></div>
        <div class="player-info">
          <span class="skeleton"></span>
          <span class="skeleton"></span>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="users.length === 0" class="NexusContainer">
      <p>Brak graczy w bazie</p>
    </div>

    <!-- Player list -->
    <div v-else class="NexusContainer">
      <PlayerBlock
        v-for="user in users"
        :key="user.uid"
        :user="user"
        :last-check="lastCheck"
      />
    </div>

    <nav class="nexus-nav">
      <RouterLink to="/home">Powrót do menu</RouterLink>
    </nav>
  </div>
</template>