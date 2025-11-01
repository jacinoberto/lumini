<template>
  <div class="details-screen">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button class="btn-retry" @click="loadBarbershop">Tentar Novamente</button>
    </div>

    <!-- Content -->
    <template v-else-if="barbershop">
      <!-- Hero Image -->
      <header class="hero-image" :style="{ backgroundImage: heroBackground }">
        <button class="hero-btn back-btn" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <button class="hero-btn favorite-btn" @click="toggleFavorite">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
        </button>
      </header>

      <!-- Details Content -->
      <main class="details-content">
        <!-- Info Card -->
        <section class="info-card">
          <h1 class="shop-name">{{ barbershop.name }}</h1>
          <div class="meta-info">
            <div class="rating-info">
              <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span class="rating-score">{{ barbershop.rating_average || '0.0' }}</span>
              <span class="review-count">({{ barbershop.rating_count || 0 }} avaliações)</span>
            </div>
            <div class="location-info" v-if="barbershop.address">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{{ formatAddress(barbershop.address) }}</span>
            </div>
          </div>
          <p class="shop-description" v-if="barbershop.description">
            {{ barbershop.description }}
          </p>
        </section>

        <!-- Services Section -->
        <section class="content-section" v-if="barbershop.services?.length">
          <h2 class="section-title">Serviços</h2>
          <div class="services-list">
            <div
                v-for="service in barbershop.services"
                :key="service.id"
                class="service-item"
                @click="selectService(service)"
            >
              <div class="service-details">
                <p class="service-name">{{ service.name }}</p>
                <span class="service-duration">{{ service.duration_minutes }} min</span>
              </div>
              <span class="service-price">R$ {{ formatPrice(service.price) }}</span>
            </div>
          </div>
        </section>

        <!-- Barbers Section -->
        <section class="content-section" v-if="barbershop.barbers?.length">
          <h2 class="section-title">Profissionais</h2>
          <div class="barbers-grid">
            <div
                v-for="barber in barbershop.barbers"
                :key="barber.id"
                class="barber-card"
            >
              <div class="barber-avatar">{{ getInitials(barber.name) }}</div>
              <p class="barber-name">{{ barber.name }}</p>
              <span class="barber-cuts" v-if="barber.total_appointments">
                {{ barber.total_appointments }} cortes
              </span>
            </div>
          </div>
        </section>

        <!-- Business Hours Section -->
        <section class="content-section" v-if="barbershop.business_hours?.length">
          <h2 class="section-title">Horário de Funcionamento</h2>
          <div class="business-hours-list">
            <div
                v-for="hour in barbershop.business_hours"
                :key="hour.day_of_week"
                class="business-hour-item"
            >
              <span class="day-name">{{ getDayName(hour.day_of_week) }}</span>
              <span class="hours" v-if="hour.is_active && hour.start_time && hour.end_time">
        {{ formatTime(hour.start_time) }} - {{ formatTime(hour.end_time) }}
      </span>
              <span class="hours closed" v-else>Fechado</span>
            </div>
          </div>
        </section>
      </main>

      <!-- CTA Button -->
      <div class="cta-container">
        <button class="btn btn-primary" @click="goToBooking">
          Agendar Horário
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { barbershopService } from '@/services/barbershopService';
import { favoriteService } from '@/services/favoriteService';

const route = useRoute();
const router = useRouter();

const barbershop = ref<any>(null);
const loading = ref(true);
const error = ref('');
const isFavorite = ref(false);

const defaultImage = 'https://images.unsplash.com/photo-1599351542841-8ccba4581173?q=80&w=1974&auto=format&fit=crop';

const heroBackground = computed(() => {
  const imageUrl = barbershop.value?.image_url || defaultImage;
  return `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url('${imageUrl}')`;
});

async function loadBarbershop() {
  try {
    loading.value = true;
    error.value = '';

    const response = await barbershopService.show(route.params.id as string);
    barbershop.value = response.data;
    isFavorite.value = response.data.is_favorite || false;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao carregar barbearia';
    console.error('Erro:', err);
  } finally {
    loading.value = false;
  }
}

async function toggleFavorite() {
  try {
    if (isFavorite.value) {
      await favoriteService.remove(barbershop.value.id);
      isFavorite.value = false;
    } else {
      await favoriteService.add(barbershop.value.id);
      isFavorite.value = true;
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Erro ao favoritar');
  }
}

function goBack() {
  router.back();
}

function selectService(service: any) {
  goToBooking();
}

function goToBooking() {
  router.push({
    name: 'BarbershopBooking',
    params: { id: barbershop.value.id }
  });
}

function formatPrice(price: number | string | undefined): string {
  if (price === undefined || price === null) return '0';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0';
  return numPrice.toFixed(0);
}

function formatTime(time: string | null | undefined): string {
  if (!time) return '';
  // Remove os segundos (00:00:00 -> 00:00)
  return time.substring(0, 5);
}

function formatAddress(address: any): string {
  if (!address) return '';
  const parts = [];
  if (address.neighborhood) parts.push(address.neighborhood);
  if (address.city) parts.push(address.city);

  let addressStr = parts.join(', ');

  if (address.distance) {
    addressStr += ` • ${formatDistance(address.distance)}`;
  }

  return addressStr;
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

function getInitials(name: string): string {
  if (!name) return '??';
  return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
}

function getDayName(dayOfWeek: number): string {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[dayOfWeek] || '';
}

onMounted(() => {
  loadBarbershop();
});
</script>

<style scoped>
.details-screen {
  padding-bottom: 120px;
}

.hero-image {
  height: 280px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-btn {
  position: absolute;
  top: 3rem;
  width: 44px;
  height: 44px;
  background-color: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.hero-btn:hover {
  background-color: rgba(17, 24, 39, 0.7);
}

.back-btn {
  left: 1.5rem;
}

.favorite-btn {
  right: 1.5rem;
}

.details-content {
  padding: 0 1.5rem;
  position: relative;
  z-index: 10;
  margin-top: -4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shop-name {
  font-size: 1.75rem;
  font-weight: var(--font-weight-bold);
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-info,
.location-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.star-icon {
  color: var(--color-accent-secondary);
  fill: var(--color-accent-secondary);
  width: 16px;
  height: 16px;
}

.rating-score {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.shop-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-size: 0.9rem;
}

.section-title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  margin-bottom: 1rem;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-item {
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.service-item:hover {
  border-color: var(--color-accent-primary);
}

.service-name {
  font-weight: var(--font-weight-semibold);
}

.service-duration {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.service-price {
  font-size: 1.125rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-primary);
}

.barbers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.barber-card {
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
}

.barber-avatar {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background-image: linear-gradient(to top right, var(--color-accent-primary), #065f46);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: var(--font-weight-bold);
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}

.barber-name {
  font-weight: var(--font-weight-semibold);
}

.barber-cuts {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.business-hours-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.business-hour-item {
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-name {
  font-weight: var(--font-weight-semibold);
}

.hours {
  color: var(--color-text-secondary);
}

.hours.closed {
  color: var(--color-danger);
}

.cta-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, var(--color-background-primary), transparent);
  z-index: 100;
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 1.125rem;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-bold);
  text-align: center;
  text-decoration: none;
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

.loading-container,
.error-container {
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

.btn-retry {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background-color: var(--color-accent-primary);
  color: var(--color-text-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}
</style>