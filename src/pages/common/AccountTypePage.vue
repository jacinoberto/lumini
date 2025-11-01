<template>
  <div class="screen-container">
    <div class="account-type-header">
      <h2>Junte-se ao Lumini</h2>
      <p>Como você quer usar o app?</p>
    </div>

    <div class="account-type-options">
      <div
          class="option-card client"
          @click="selectAccountType('CLIENT')"
          role="button"
          tabindex="0"
          @keypress.enter="selectAccountType('CLIENT')"
      >
        <h3>Sou Cliente</h3>
        <p>Encontre e agende com os melhores barbeiros</p>
      </div>

      <div
          class="option-card barber"
          @click="selectAccountType('OWNER')"
          role="button"
          tabindex="0"
          @keypress.enter="selectAccountType('OWNER')"
      >
        <h3>Sou Barbeiro</h3>
        <p>Gerencie seu negócio e conquiste mais clientes</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const selectAccountType = (role: 'CLIENT' | 'OWNER') => {
  authStore.setSelectedRole(role);
  router.push({ name: 'Login' });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Sora', sans-serif;
  background-color: #111827;
  color: #F9FAFB;
}

.screen-container {
  min-height: 100vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  background-color: #111827;
}

.account-type-header {
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.account-type-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #F9FAFB;
  font-weight: 700;
}

.account-type-header p {
  color: #9CA3AF;
  font-size: 1.125rem;
  font-weight: 400;
}

.account-type-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
}

.option-card {
  padding: 2rem;
  border-radius: 1.5rem;
  border: 2px solid #374151;
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.option-card:hover {
  transform: scale(1.05);
  border-color: #059669;
}

.option-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.option-card.client {
  background: linear-gradient(to right, #059669, #047857);
  color: #F9FAFB;
  border-color: #059669;
}

.option-card.client p {
  color: #F9FAFB;
}

.option-card.barber {
  background-color: transparent;
  color: #F9FAFB;
}

.option-card.barber p {
  color: #9CA3AF;
}

/* Responsividade */
@media (min-width: 768px) {
  .account-type-options {
    flex-direction: row;
    gap: 2rem;
  }

  .option-card {
    flex: 1;
    min-height: 200px;
  }
}
</style>