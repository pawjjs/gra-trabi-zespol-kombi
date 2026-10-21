<script setup>
import { useAuth , provideAuth} from '../../hooks/useAuth.js';
import { onMounted } from 'vue';



const { user, loading } = useAuth();

onMounted(() => {
  useAuth();
});

</script>

<template>
    <div v-if="loading">Loading...</div>
    <div v-else>
        {{ user ? `Logged in as ${user}` : 'Not logged in' }}
    </div>
</template>