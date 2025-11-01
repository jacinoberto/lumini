<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import BottomNavigation from '@/components/ui/BottomNavigation.vue';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const barbershop = computed(() => user.value?.barbershop);

const showPasswordModal = ref(false);
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

function getInitials(name: string): string {
  if (!name) return 'B';
  const names = name.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function goToBarbershopData() {
  // TODO: Criar página de dados da barbearia
  alert('Página de dados da barbearia será implementada');
}

function openPasswordModal() {
  showPasswordModal.value = true;
}

function closePasswordModal() {
  showPasswordModal.value = false;
  passwordData.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
}

async function changePassword() {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    alert('As senhas não coincidem');
    return;
  }

  if (passwordData.value.newPassword.length < 6) {
    alert('A senha deve ter no mínimo 6 caracteres');
    return;
  }

  try {
    // TODO: Implementar API de mudança de senha
    // await authService.changePassword(passwordData.value);
    alert('Senha alterada com sucesso!');
    closePasswordModal();
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error);
    alert(error.response?.data?.message || 'Erro ao alterar senha');
  }
}

async function logout() {
  const confirmed = confirm('Deseja realmente sair?');
  if (!confirmed) return;

  try {
    authStore.clearAuth();
    router.push({ name: 'AccountType' });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login' });
  }
});
</script>

<template>
  <div class="profile-screen">
    <header class="profile-header">
      <div class="profile-avatar">
        {{ getInitials(barbershop?.name || user?.name || 'Barbearia') }}
      </div>
      <h1 class="profile-name">{{ barbershop?.name || user?.name || 'Barbearia' }}</h1>
      <p class="profile-handle">{{ user?.email || '' }}</p>
    </header>

    <main class="profile-menu">
      <!-- Configurações -->
      <div class="menu-group">
        <button class="menu-item" @click="goToBarbershopData">
          <span class="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </span>
          <span class="menu-text">Dados da Barbearia</span>
          <span class="menu-chevron">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </button>

        <button class="menu-item" @click="openPasswordModal">
          <span class="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </span>
          <span class="menu-text">Alterar Senha</span>
          <span class="menu-chevron">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </button>
      </div>

      <!-- Sair -->
      <div class="menu-group">
        <button class="logout-btn" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sair
        </button>
      </div>
    </main>

    <!-- Modal de Alteração de Senha -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="closePasswordModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Alterar Senha</h2>
          <button class="close-btn" @click="closePasswordModal">×</button>
        </div>

        <form @submit.prevent="changePassword" class="password-form">
          <div class="input-group">
            <label>Senha Atual</label>
            <input
                type="password"
                v-model="passwordData.currentPassword"
                placeholder="Digite sua senha atual"
                required
            >
          </div>

          <div class="input-group">
            <label>Nova Senha</label>
            <input
                type="password"
                v-model="passwordData.newPassword"
                placeholder="Digite a nova senha"
                required
                minlength="6"
            >
          </div>

          <div class="input-group">
            <label>Confirmar Nova Senha</label>
            <input
                type="password"
                v-model="passwordData.confirmPassword"
                placeholder="Confirme a nova senha"
                required
                minlength="6"
            >
          </div>

          <button type="submit" class="btn-primary">Salvar Nova Senha</button>
        </form>
      </div>
    </div>

    <BottomNavigation />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.profile-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 100px;
}

.profile-header {
  padding: 3rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-image: linear-gradient(to top right, var(--color-accent-primary), #065f46);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
}

.profile-handle {
  font-size: 1rem;
  color: var(--color-text-secondary);
}

.profile-menu {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.menu-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-background-secondary);
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  width: 100%;
  text-align: left;
}

.menu-item:hover {
  background-color: var(--color-border);
}

.menu-icon {
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
}

.menu-text {
  flex-grow: 1;
  font-weight: 600;
}

.menu-chevron {
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  color: #ef4444;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Sora', sans-serif;
}

.logout-btn:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background-color: var(--color-background-secondary);
  border-radius: 1.5rem;
  max-width: 500px;
  width: 100%;
  border: 1px solid var(--color-border);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 2rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: var(--color-border);
}

.password-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.input-group input {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-background-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
}

.input-group input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}

.btn-primary {
  width: 100%;
  padding: 1.125rem;
  background-image: linear-gradient(to right, var(--color-accent-primary), #047857);
  color: var(--color-text-primary);
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  transition: opacity 0.3s;
}

.btn-primary:hover {
  opacity: 0.9;
}
</style>