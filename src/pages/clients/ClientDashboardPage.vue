<template>
  <div class="client-home-screen">
    <!-- Header -->
    <header class="home-header">
      <div class="header-top">
        <div>
          <p class="greeting">Olá 👋</p>
          <h1 class="user-name">{{ userName }}</h1>
        </div>
        <div class="header-actions">
          <button class="header-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <button class="header-btn" @click="goToProfile">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>
      <div class="search-bar-container">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
            type="text"
            placeholder="Buscar barbearias..."
            v-model="searchQuery"
            @input="handleSearch"
        >
      </div>
    </header>

    <!-- Main Content -->
    <main class="home-content">
      <!-- Categories -->
      <section class="categories-section">
        <div class="categories-scroll">
          <button
              v-for="category in categories"
              :key="category.id"
              class="category-pill"
              :class="{ active: selectedCategory === category.id }"
              @click="selectCategory(category.id)"
          >
            {{ category.label }}
          </button>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Carregando barbearias...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="empty-state">
        <p>{{ error }}</p>
        <button class="retry-btn" @click="() => loadBarbershops()">Tentar Novamente</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="barbershops.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>Nenhuma barbearia encontrada</p>
      </div>

      <!-- Barbershops List -->
      <section v-else class="barbershop-list-section">
        <div class="section-header">
          <h2>Perto de você</h2>
          <a href="#" v-if="hasMorePages">Ver todos</a>
        </div>
        <div class="barbershop-list">
          <div
              v-for="shop in barbershops"
              :key="shop.id"
              class="barbershop-card"
              @click="goToDetails(shop.id)"
          >
            <div class="card-hero" :style="{ backgroundImage: `url(${shop.image_url || defaultImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
              <button
                  class="favorite-btn"
                  @click.stop="toggleFavorite(shop)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="shop.is_favorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </button>
            </div>
            <div class="card-content">
              <div class="card-header">
                <div>
                  <h3 class="card-title">{{ shop.name }}</h3>
                  <div class="rating-info" v-if="shop.rating_average > 0">
                    <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span class="rating-score">{{ shop.rating_average }}</span>
                    <span class="review-count">({{ shop.rating_count || 0 }})</span>
                  </div>
                </div>
                <span class="distance-badge" v-if="shop.distance">
                  {{ formatDistance(shop.distance) }}
                </span>
              </div>
              <div class="card-footer">
                <span class="price-label">A partir de</span>
                <span class="price-value">R$ {{ shop.price_range || '35-55' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="hasMorePages" class="load-more-container">
          <button class="load-more-btn" @click="loadMore" :disabled="loadingMore">
            {{ loadingMore ? 'Carregando...' : 'Ver Mais' }}
          </button>
        </div>
      </section>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <div class="bottom-nav-inner">
        <router-link to="/client/dashboard" class="nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Início</span>
        </router-link>

        <router-link to="/client/appointments" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Agendas</span>
        </router-link>

        <router-link to="/client/favorites" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
          <span>Favoritos</span>
        </router-link>

        <router-link to="/client/profile" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
import { barbershopService } from '@/services/barbershopService';
import { favoriteService } from '@/services/favoriteService';

const router = useRouter();
const authStore = useAuthStore();

const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'nearby', label: 'Perto de mim' },
  { id: 'top-rated', label: 'Top Avaliados' }
];

const barbershops = ref<any[]>([]);
const selectedCategory = ref('all');
const searchQuery = ref('');
const loading = ref(true);
const loadingMore = ref(false);
const error = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const searchTimeout = ref<any>(null);

const defaultImage = 'https://images.unsplash.com/photo-1599351542841-8ccba4581173?q=80&w=1974&auto=format&fit=crop';

const userName = computed(() => {
  return authStore.user?.name || 'Usuário';
});

const hasMorePages = computed(() => {
  return currentPage.value < lastPage.value;
});

async function loadBarbershops(page = 1) {
  try {
    if (page === 1) {
      loading.value = true;
      barbershops.value = [];
    } else {
      loadingMore.value = true;
    }

    error.value = '';

    let latitude: number | undefined;
    let longitude: number | undefined;

    if (selectedCategory.value === 'nearby') {
      const position = await getUserLocation();
      latitude = position?.coords.latitude;
      longitude = position?.coords.longitude;
    }

    const response = await barbershopService.list({
      category: selectedCategory.value as any,
      latitude,
      longitude,
      radius: 10,
      search: searchQuery.value || undefined,
      page
    });

    if (page === 1) {
      barbershops.value = response.data;
    } else {
      barbershops.value.push(...response.data);
    }

    currentPage.value = response.meta.current_page;
    lastPage.value = response.meta.last_page;

  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao carregar barbearias';
    console.error('Erro:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

function getUserLocation(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        () => resolve(null),
        { timeout: 5000 }
    );
  });
}

async function selectCategory(categoryId: string) {
  selectedCategory.value = categoryId;
  currentPage.value = 1;
  await loadBarbershops(1);
}

function handleSearch() {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1;
    loadBarbershops(1);
  }, 500);
}

async function loadMore() {
  if (hasMorePages.value && !loadingMore.value) {
    await loadBarbershops(currentPage.value + 1);
  }
}

async function toggleFavorite(shop: any) {
  try {
    if (shop.is_favorite) {
      await favoriteService.remove(shop.id);
      shop.is_favorite = false;
    } else {
      await favoriteService.add(shop.id);
      shop.is_favorite = true;
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Erro ao favoritar');
  }
}

function goToDetails(shopId: string) {
  router.push({
    name: 'BarbershopDetails',
    params: { id: shopId }
  });
}

function goToProfile() {
  router.push({ name: 'ClientProfile' });
}

function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)} km`;
}

onMounted(() => {
  loadBarbershops();
});
</script>

<style scoped>
.client-home-screen {
  padding-bottom: 100px;
}

.home-header {
  background-image: linear-gradient(to right, var(--color-accent-primary), #047857);
  padding: 1.5rem;
  padding-top: 3rem;
  border-radius: 0 0 1.75rem 1.75rem;
  color: var(--color-text-primary);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.greeting {
  font-size: 1rem;
  opacity: 0.8;
}

.user-name {
  font-size: 1.75rem;
  font-weight: var(--font-weight-bold);
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.header-btn {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}

.header-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.search-bar-container {
  position: relative;
}

.search-bar-container .search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
}

.search-bar-container input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background-color: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  font-family: var(--font-family-primary);
}

.search-bar-container input::placeholder {
  color: var(--color-text-secondary);
}

.search-bar-container input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
}

.home-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.categories-scroll {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
}

.categories-scroll::-webkit-scrollbar {
  display: none;
}

.category-pill {
  padding: 0.6rem 1.25rem;
  border-radius: 999px;
  font-weight: var(--font-weight-semibold);
  font-size: 0.875rem;
  white-space: nowrap;
  border: 1px solid var(--color-border);
  background-color: var(--color-background-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-pill:hover {
  background-color: var(--color-border);
}

.category-pill.active {
  background-image: linear-gradient(to right, var(--color-accent-primary), #047857);
  color: var(--color-text-primary);
  border-color: var(--color-accent-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
}

.section-header a {
  color: var(--color-accent-primary);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  font-size: 0.875rem;
}

.section-header a:hover {
  text-decoration: underline;
}

.barbershop-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.barbershop-card {
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.barbershop-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent-primary);
}

.card-hero {
  height: 140px;
  background-image: linear-gradient(to top right, #374151, #1f2937);
  position: relative;
}

.favorite-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  background-color: rgba(17, 24, 39, 0.8);
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-title {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
}

.rating-info {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.25rem;
}

.star-icon {
  color: var(--color-accent-secondary);
  fill: var(--color-accent-secondary);
  width: 16px;
  height: 16px;
}

.rating-score {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.review-count {
  color: #6B7280;
  font-size: 0.875rem;
}

.distance-badge {
  background-color: var(--color-background-primary);
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
}

.card-footer {
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-label {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.price-value {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-primary);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem;
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

.retry-btn,
.load-more-btn {
  margin-top: 1rem;
  padding: 0.875rem 2rem;
  background-color: var(--color-accent-primary);
  color: var(--color-text-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover,
.load-more-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.load-more-container {
  text-align: center;
  margin-top: 1rem;
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
  font-size: var(--font-size-caption);
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