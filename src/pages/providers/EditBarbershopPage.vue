<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const saving = ref(false);

const barbershop = ref({
  name: '',
  description: '',
  phone: '',
  address: '',
  logo_url: '',
  cover_url: ''
});

const logoFile = ref<File | null>(null);
const coverFile = ref<File | null>(null);
const logoPreview = ref('');
const coverPreview = ref('');

async function loadBarbershop() {
  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    loading.value = true;
    const response = await api.get(`/barbershops/${barbershopId}`);
    const data = response.data.data || response.data;

    barbershop.value = {
      name: data.name || '',
      description: data.description || '',
      phone: data.phone || '',
      address: data.address || '',
      logo_url: data.logo_url || '',
      cover_url: data.cover_url || ''
    };

    logoPreview.value = data.logo_url || '';
    coverPreview.value = data.cover_url || '';
  } catch (error) {
    console.error('Erro ao carregar barbearia:', error);
  } finally {
    loading.value = false;
  }
}

function handleLogoChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    logoFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function handleCoverChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    coverFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      coverPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async function saveChanges() {
  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    saving.value = true;

    const formData = new FormData();
    formData.append('name', barbershop.value.name);
    formData.append('description', barbershop.value.description);
    formData.append('phone', barbershop.value.phone);
    formData.append('address', barbershop.value.address);

    if (logoFile.value) {
      formData.append('logo', logoFile.value);
    }

    if (coverFile.value) {
      formData.append('cover', coverFile.value);
    }

    await api.post(`/barbershops/${barbershopId}/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    alert('Dados atualizados com sucesso!');
    router.push({ name: 'ProviderProfile' });
  } catch (error: any) {
    console.error('Erro ao salvar:', error);
    alert(error.response?.data?.message || 'Erro ao salvar alterações');
  } finally {
    saving.value = false;
  }
}

function goBack() {
  router.push({ name: 'ProviderProfile' });
}

onMounted(() => {
  loadBarbershop();
});
</script>

<template>
  <div class="edit-screen">
    <header class="edit-header">
      <button class="back-btn" @click="goBack">← Voltar para o Perfil</button>
      <h1>Editar Dados da Barbearia</h1>
      <p>Mantenha as informações do seu negócio sempre atualizadas.</p>
    </header>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando dados...</p>
    </div>

    <form v-else class="edit-form" @submit.prevent="saveChanges">
      <!-- Perfil da Barbearia -->
      <fieldset class="form-section">
        <legend class="section-legend">Perfil da Barbearia</legend>

        <!-- Logo -->
        <div class="input-group">
          <label>Logo da Barbearia</label>
          <label for="shop-logo" class="photo-upload-group">
            <div
                class="photo-preview logo-preview"
                :style="{ backgroundImage: logoPreview ? `url(${logoPreview})` : 'none' }"
            ></div>
            <div class="change-photo-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Alterar Logo</span>
            </div>
            <input
                type="file"
                id="shop-logo"
                class="file-input-hidden"
                accept="image/*"
                @change="handleLogoChange"
            >
          </label>
        </div>

        <!-- Capa -->
        <div class="input-group">
          <label>Foto de Capa</label>
          <label for="shop-cover" class="photo-upload-group">
            <div
                class="photo-preview cover-preview"
                :style="{ backgroundImage: coverPreview ? `url(${coverPreview})` : 'none' }"
            ></div>
            <div class="change-photo-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Alterar Capa</span>
            </div>
            <input
                type="file"
                id="shop-cover"
                class="file-input-hidden"
                accept="image/*"
                @change="handleCoverChange"
            >
          </label>
        </div>

        <!-- Descrição -->
        <div class="input-group">
          <label for="shop-description">Descrição Curta (Bio)</label>
          <textarea
              id="shop-description"
              v-model="barbershop.description"
              class="form-input"
              rows="4"
              placeholder="Descreva sua barbearia..."
          ></textarea>
        </div>
      </fieldset>

      <!-- Informações de Contato -->
      <fieldset class="form-section">
        <legend class="section-legend">Informações de Contato</legend>

        <div class="input-group">
          <label for="shop-name">Nome da Barbearia</label>
          <input
              type="text"
              id="shop-name"
              v-model="barbershop.name"
              class="form-input"
              required
          >
        </div>

        <div class="input-group">
          <label for="shop-phone">Telefone / WhatsApp</label>
          <input
              type="tel"
              id="shop-phone"
              v-model="barbershop.phone"
              class="form-input"
              required
          >
        </div>
      </fieldset>

      <!-- Endereço -->
      <fieldset class="form-section">
        <legend class="section-legend">Endereço</legend>

        <div class="input-group">
          <label for="shop-address">Endereço Completo</label>
          <input
              type="text"
              id="shop-address"
              v-model="barbershop.address"
              class="form-input"
              placeholder="Rua, número, bairro, cidade - UF"
              required
          >
        </div>
      </fieldset>

      <div class="cta-container">
        <button
            type="submit"
            class="btn btn-primary"
            :disabled="saving"
        >
          {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.edit-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 120px;
}

.edit-header {
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

.edit-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
}

.edit-header p {
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
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

.edit-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  border: none;
}

.section-legend {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-text-primary);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
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
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}

textarea.form-input {
  resize: vertical;
}

.photo-upload-group {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
  cursor: pointer;
  display: block;
}

.photo-preview {
  width: 100%;
  display: block;
  background-size: cover;
  background-position: center;
  background-color: var(--color-background-secondary);
}

.logo-preview {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  margin: 1rem auto;
}

.cover-preview {
  height: 150px;
}

.change-photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(17, 24, 39, 0.8);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-upload-group:hover .change-photo-overlay {
  opacity: 1;
}

.change-photo-overlay span {
  font-weight: 600;
  margin-top: 0.5rem;
}

.file-input-hidden {
  display: none;
}

.cta-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, var(--color-background-primary) 70%, transparent);
  z-index: 100;
  max-width: 800px;
  margin: 0 auto;
}

.btn {
  width: 100%;
  padding: 1.125rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  font-family: 'Sora', sans-serif;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-accent-primary), #047857);
  color: var(--color-text-primary);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>