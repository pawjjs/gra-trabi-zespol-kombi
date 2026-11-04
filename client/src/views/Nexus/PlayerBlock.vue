<script setup>
import { computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  lastCheck: {
    type: Number,
    default: () => Date.now(),
  },
});

const ONLINE_THRESHOLD = 15 * 60 * 1000; // 15 min
const SLEEP_THRESHOLD = 5 * 60 * 1000; // 5 min

const getPingMillis = (ping) => {
  if (!ping) return null;
  if (typeof ping.toMillis === 'function') return ping.toMillis();
  if (typeof ping.seconds === 'number') return ping.seconds * 1000;
  return null;
};

const isUserAsleep = (ping) => {
  const millis = getPingMillis(ping);
  if (!millis) return false;
  const timeDifference = props.lastCheck - millis;
  return timeDifference > SLEEP_THRESHOLD && timeDifference < ONLINE_THRESHOLD;
};

const isUserOnline = (ping) => {
  const millis = getPingMillis(ping);
  if (!millis) return false;
  const timeDifference = props.lastCheck - millis;
  return timeDifference < ONLINE_THRESHOLD;
};

const statusClass = computed(() => {
  const ping = props.user?.ping;
  if (!ping) return 'redOffline';
  if (isUserAsleep(ping)) return 'yellowSleep';
  if (isUserOnline(ping)) return 'greenOnline';
  return 'redOffline';
});

const formattedPing = computed(() => {
  const ping = props.user?.ping;
  if (!ping) return null;
  const seconds = ping.seconds ?? (typeof ping.toMillis === 'function' ? Math.floor(ping.toMillis() / 1000) : null);
  if (!seconds) return null;

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(seconds * 1000);
});
</script>

<template>
  <div class="PlayerBlock">
    <div :class="[`lastCheck-${lastCheck}`, 'status-dot', statusClass]"></div>
    <div class="player-info">
      <b class="player-nick">
        <template v-if="user?.playerNick">{{ user.playerNick }}</template>
        <span v-else class="skeleton skeleton-nick"></span>
      </b>
      <div class="player-ping">
        Last Ping:
        <template v-if="formattedPing">{{ formattedPing }}</template>
        <span v-else class="skeleton skeleton-ping"></span>
      </div>
    </div>
  </div>
</template>

