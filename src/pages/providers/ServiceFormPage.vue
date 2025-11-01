<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { serviceService, type CreateServiceData, type Service } from '@/services/serviceService';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const serviceId = computed(() => route.params.id as string);
const isEditing = computed(() => !!serviceId.value);

const loading = ref(false);
const loadingData = ref(false);
const formData = ref({
  name: '',
  description: '',
  price: '',
  duration_minutes: ''
});

const errors = ref({
  name: '',
  price: '',
  duration_minutes: ''
});

async function loadService() {
  if (!isEditing.value) return;

  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    loadingData.value = true;
    const response = await serviceService.getById(barbershopId, serviceId.value);
    const service: Service = response.data || response;

    // Preenche o formulário com os dados do serviço
    formData.value = {
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      duration_minutes: service.duration_minutes.toString()
    };
  } catch (error: any) {
    console.error('Erro ao carregar serviço:', error);
    alert('Erro ao carregar serviço');
    router.push({ name: 'Services' });
  } finally {
    loadingData.value = false;
  }
}

function validateForm(): boolean {
  errors.value = {
    name: '',
    price: '',
    duration_minutes: ''
  };

  let isValid = true;

  if (!formData.value.name.trim()) {
    errors.value.name = 'Nome do serviço é obrigatório';
    isValid = false;
  }

  if (!formData.value.price || parseFloat(formData.value.price) <= 0) {
    errors.value.price = 'Preço deve ser maior que zero';
    isValid = false;
  }

  if (!formData.value.duration_minutes || parseInt(formData.value.duration_minutes) <= 0) {
    errors.value.duration_minutes = 'Duração deve ser maior que zero';
    isValid = false;
  }

  return isValid;
}

async function handleSubmit() {
  if (!validateForm()) return;

  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    loading.value = true;

    const data: CreateServiceData = {
      name: formData.value.name,
      description: formData.value.description || undefined,
      price: parseFloat(formData.value.price),
      duration_minutes: parseInt(formData.value.duration_minutes),
      is_active: true
    };

    if (isEditing.value) {
      await serviceService.update(barbershopId, serviceId.value, {
        ...data,
        id: serviceId.value
      });
      alert('Serviço atualizado com sucesso!');
    } else {
      await serviceService.create(barbershopId, data);
      alert('Serviço criado com sucesso!');
    }

    router.push({ name: 'Services' });
  } catch (error: any) {
    console.error('Erro ao salvar serviço:', error);
    alert(error.response?.data?.message || 'Erro ao salvar serviço');
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: 'Services' });
}

onMounted(() => {
  loadService();
});
</script>

<template>
  <div class="form-screen">
    <header class="form-header">
      <button class="back-btn" @click="goBack">← Voltar para Serviços</button>
      <h1>{{ isEditing ? 'Editar Serviço' : 'Adicionar Novo Serviço' }}</h1>
    </header>

    <!-- Loading State ao carregar dados para edição -->
    <div v-if="loadingData" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando dados do serviço...</p>
    </div>

    <main v-else class="form-content">
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="service-name">Nome do Serviço</label>
          <input
              type="text"
              id="service-name"
              class="form-input"
              :class="{ 'error': errors.name }"
              placeholder="Ex: Low Fade"
              v-model="formData.name"
          >
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="input-group">
          <label for="service-desc">Descrição Curta (Opcional)</label>
          <textarea
              id="service-desc"
              class="form-input"
              rows="3"
              placeholder="Ex: Corte moderno com degradê baixo, finalizado com navalha."
              v-model="formData.description"
          ></textarea>
        </div>

        <div class="input-group-row">
          <div class="input-group">
            <label for="service-price">Preço (R$)</label>
            <input
                type="number"
                id="service-price"
                class="form-input"
                :class="{ 'error': errors.price }"
                placeholder="40,00"
                step="0.01"
                min="0"
                v-model="formData.price"
            >
            <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
          </div>

          <div class="input-group">
            <label for="service-duration">Duração (min)</label>
            <input
                type="number"
                id="service-duration"
                class="form-input"
                :class="{ 'error': errors.duration_minutes }"
                placeholder="45"
                min="1"
                v-model="formData.duration_minutes"
            >
            <span v-if="errors.duration_minutes" class="error-message">{{ errors.duration_minutes }}</span>
          </div>
        </div>
      </form>
    </main>

    <div class="cta-container">
      <button
          class="btn btn-primary"
          @click="handleSubmit"
          :disabled="loading || loadingData"
      >
        {{ loading ? 'Salvando...' : 'Salvar Serviço' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.form-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 120px;
}

.form-header {
  padding: 3rem 1.5rem 1.5rem;
  background-color: var(--color-background-secondary);
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-weight: 600;
  margin-bottom: 1rem;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
}

.back-btn:hover {
  color: var(--color-accent-primary);
}

.form-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-content {
  padding: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.input-group label {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: -0.25rem;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.input-group-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-group-row .input-group {
  flex: 1;
  margin-bottom: 0;
}

.cta-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, var(--color-background-primary) 70%, transparent);
  z-index: 100;
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 1.125rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease;
  font-family: 'Sora', sans-serif;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-image: linear-gradient(to right, var(--color-accent-primary), #047857);
  color: var(--color-text-primary);
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}
</style>