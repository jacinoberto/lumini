<template>
  <div class="profile-screen">
    <!-- Profile Header -->
    <header class="profile-header">
      <div class="profile-avatar" :style="avatarStyle">
        <span v-if="!user?.profile_image_url">{{ userInitials }}</span>
      </div>
      <h1 class="profile-name">{{ user?.name || 'Carregando...' }}</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando...</p>
    </div>

    <!-- Profile Content -->
    <main v-else class="profile-content">
      <!-- Menu Group 1 -->
      <div class="menu-group">
        <a href="#" class="menu-item" @click.prevent="editProfile">
          <span class="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <span class="menu-text">Meus Dados</span>
          <span class="menu-chevron">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </a>

        <a href="#" class="menu-item" @click.prevent="changePassword">
          <span class="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </span>
          <span class="menu-text">Alterar Senha</span>
          <span class="menu-chevron">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </a>
      </div>

      <!-- Logout Button -->
      <div class="menu-group">
        <button class="logout-btn" @click="confirmLogout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sair
        </button>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <div class="bottom-nav-inner">
        <router-link to="/client/dashboard" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Início</span>
        </router-link>

        <router-link to="/client/appointments" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Agendas</span>
        </router-link>

        <router-link to="/client/favorites" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
          <span>Favoritos</span>
        </router-link>

        <router-link to="/client/profile" class="nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Perfil</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { userService } from '@/services/userService';

const router = useRouter();
const authStore = useAuthStore();

const user = ref<any>(null);
const loading = ref(true);

const userInitials = computed(() => {
  if (!user.value?.name) return '??';
  return user.value.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
});

const avatarStyle = computed(() => {
  if (user.value?.profile_image_url) {
    return {
      backgroundImage: `url(${user.value.profile_image_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }
  return {};
});

async function loadProfile() {
  try {
    loading.value = true;
    const response = await userService.getProfile();
    user.value = response.data;
  } catch (err: any) {
    console.error('Erro ao carregar perfil:', err);
    // Se der erro, usa os dados do authStore
    user.value = authStore.user;
  } finally {
    loading.value = false;
  }
}

function editProfile() {
  alert('Funcionalidade de editar perfil em desenvolvimento');
  // Implementar modal ou navegar para página de edição
}

function changePassword() {
  alert('Funcionalidade de alterar senha em desenvolvimento');
  // Implementar modal ou navegar para página de alteração de senha
}

function confirmLogout() {
  const confirmed = confirm('Tem certeza que deseja sair?');
  if (confirmed) {
    authStore.logout();
    router.push({ name: 'Login' });
  }
}

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-screen {
  padding-bottom: 100px;
}

.profile-header {
  padding: 3rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: var(--color-background-secondary);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background-image: linear-gradient(135deg, #f97316, #ea580c);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.profile-name {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
}

.profile-content {
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
  text-decoration: none;
  color: var(--color-text-primary);
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.menu-item:hover {
  background-color: var(--color-border);
}

.menu-icon {
  color: var(--color-text-secondary);
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.menu-text {
  flex-grow: 1;
  font-weight: var(--font-weight-semibold);
}

.menu-chevron {
  color: #6B7280;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
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
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

.loading-container {
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--color-border);
  z-index: 1000;
}

.bottom-nav-inner {
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  transition: color 0.3s ease;
}

.nav-item svg {
  width: 24px;
  height: 24px;
}

.nav-item.active,
.nav-item:hover {
  color: var(--color-accent-primary);
  font-weight: var(--font-weight-semibold);
}
</style>