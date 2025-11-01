<template>
  <div class="screen-container">
    <div class="account-type-header">
      <h2>Junte-se ao Lumini</h2>
      <p>Como você quer usar o app?</p>
    </div>
    <div class="account-type-options">
      <div class="option-card client" @click="selectRole('CLIENT')">
        <h3>Sou Cliente</h3>
        <p>Encontre e agende com os melhores barbeiros</p>
      </div>
      <div class="option-card barber" @click="selectRole('OWNER')"> <h3>Sou Barbeiro</h3>
        <p>Gerencie seu negócio e conquiste mais clientes</p>
      </div>
    </div>
    <div class="login-prompt">
      <p>Já tem uma conta? <a @click="goToLogin">Entrar</a></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AccountTypeSelectionPage',
  setup() {
    const router = useRouter();

    const selectRole = (role: 'CLIENT' | 'OWNER') => {
      if (role === 'CLIENT') {
        router.push({ name: 'RegisterClient' });
      } else {
        router.push({ name: 'RegisterProvider' });
      }
    };

    const goToLogin = () => {
      router.push({ name: 'Login' });
    };

    return {
      selectRole,
      goToLogin,
    };
  }
});
</script>

<style scoped>
.screen-container {
  min-height: 100vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
}
.account-type-header {
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 2rem;
}
.account-type-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}
.account-type-header p {
  color: var(--color-text-secondary);
  font-size: 1.125rem;
}
.account-type-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
}
.option-card {
  padding: 2rem;
  border-radius: 1.5rem;
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.option-card:hover {
  transform: scale(1.03);
  border-color: var(--color-accent-primary);
}
.option-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
font-weight: 700;
}
.option-card p {
  font-size: 1rem;
}
.option-card.client {
  background: linear-gradient(to right, #059669, #065f46);
  color: var(--color-text-primary);
}
.option-card.barber {
  background-color: var(--color-background-secondary);
}
.option-card.barber p {
  color: var(--color-text-secondary);
}
.login-prompt {
  text-align: center;
  margin-top: 2rem;
  padding-bottom: 1rem;
  font-size: 0.875rem;
color: var(--color-text-secondary);
}
.login-prompt a {
  color: var(--color-accent-primary);
font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
</style>