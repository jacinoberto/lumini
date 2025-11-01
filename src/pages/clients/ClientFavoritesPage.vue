<template>
  <div class="screen-container">
    <!-- Header -->
    <header class="page-header">
      <h1>Favoritos</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="favorites.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>
      <p>Você ainda não tem barbearias favoritas</p>
      <button class="btn btn-primary" @click="goToDashboard" style="max-width: 200px; margin-top: 1rem;">
        Explorar Barbearias
      </button>
    </div>

    <!-- Favorites List -->
    <main v-else class="page-content">
      <div class="barbershop-list">
        <div
            v-for="shop in favorites"
            :key="shop.id"
            class="barbershop-card"
            @click="goToDetails(shop.id)"
        >
          <div class="card-hero" :style="{ backgroundImage: heroImage(shop.image_url) }">
            <button
                class="favorite-btn active"
                @click.stop="removeFavorite(shop)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
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

        <router-link to="/client/favorites" class="nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
          <span>Favoritos</span>
        </router-link>

        <router-link to="/client/profile" class="nav-item">
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { favoriteService } from '@/services/favoriteService';

const router = useRouter();

const favorites = ref<any[]>([]);
const loading = ref(true);

const defaultImage = 'https://images.unsplash.com/photo-1599351542841-8ccba4581173?q=80&w=1974&auto=format&fit=crop';

async function loadFavorites() {
  try {
    loading.value = true;
    const response = await favoriteService.list();
    favorites.value = response.data;
  } catch (err: any) {
    console.error('Erro ao carregar favoritos:', err);
    alert(err.response?.data?.message || 'Erro ao carregar favoritos');
  } finally {
    loading.value = false;
  }
}

async function removeFavorite(shop: any) {
  const confirmed = confirm(`Remover ${shop.name} dos favoritos?`);
  if (!confirmed) return;

  try {
    await favoriteService.remove(shop.id);
    favorites.value = favorites.value.filter(fav => fav.id !== shop.id);
  } catch (err: any) {
    alert(err.response?.data?.message || 'Erro ao remover favorito');
  }
}

function goToDetails(shopId: string) {
  router.push({
    name: 'BarbershopDetails',
    params: { id: shopId }
  });
}

function goToDashboard() {
  router.push({ name: 'ClientDashboard' });
}

function heroImage(imageUrl: string | undefined): string {
  const url = imageUrl || defaultImage;
  return `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url('${url}')`;
}

function formatDistance(distance: number | string | undefined): string {
  if (distance === undefined || distance === null) return '';
  const numDistance = typeof distance === 'string' ? parseFloat(distance) : distance;
  if (isNaN(numDistance)) return '';

  if (numDistance < 1) {
    return `${Math.round(numDistance * 1000)}m`;
  }
  return `${numDistance.toFixed(1)} km`;
}

onMounted(() => {
  loadFavorites();
});
</script>

<style scoped>
.screen-container {
  padding-bottom: 100px;
}

.page-header {
  padding: 3rem 1.5rem 1.5rem;
  background-color: var(--color-background-secondary);
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: var(--font-weight-bold);
}

.page-content {
  padding: 1.5rem;
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
  background-size: cover;
  background-position: center;
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

.favorite-btn.active {
  color: #ef4444;
}

.favorite-btn:hover {
  background-color: rgba(17, 24, 39, 0.8);
  transform: scale(1.1);
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

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--color-text-secondary);
}

.empty-state svg {
  margin: 0 auto 1rem;
  color: var(--color-text-secondary);
}

.empty-state p {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 0.875rem;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-bold);
  text-align: center;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

.btn-primary {
  background-image: linear-gradient(to right, var(--color-accent-primary), #047857);
  color: var(--color-text-primary);
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