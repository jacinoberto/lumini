<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { barberService, type CreateBarberData, type UpdateBarberData } from '@/services/barberService'; // Importe UpdateBarberData também

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const memberId = computed(() => route.params.memberId as string);
const isEditing = computed(() => !!memberId.value);

const loading = ref(false);
const loadingData = ref(false);
const formData = ref({
  name: '',
  specialties: '',
  profile_image: null as File | null // Armazena o File
});

const avatarPreview = ref<string | null>(null); // Armazena a string (URL ou Base64) para preview
const errors = ref({
  name: '',
  specialties: ''
});

// --- FUNÇÃO AUXILIAR PARA CONVERTER FILE -> BASE64 ---
function fileToBase64(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

async function loadBarber() {
  if (!isEditing.value) return;
  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    loadingData.value = true;
    let barber = history.state?.barber || null;

    if (!barber) {
      // SUGESTÃO: Idealmente, o service teria um método getById(barbershopId, memberId.value)
      // A lógica de list() e find() pode ser menos eficiente.
      const response = await barberService.list(barbershopId);
      const barbers = response.data || response;
      barber = barbers.find((b: any) => b.id === memberId.value) || null;
    }

    if (!barber) throw new Error('Barbeiro não encontrado');

    formData.value = {
      name: barber.name,
      specialties: barber.specialties || '',
      profile_image: null // Começa como nulo, pois só queremos o File se o usuário mudar
    };
    if (barber.profile_image_url) {
      avatarPreview.value = barber.profile_image_url; // Define o preview com a URL existente
    }
  } catch (error: any) {
    console.error('Erro ao carregar barbeiro:', error);
    alert('Erro ao carregar barbeiro');
    router.push({ name: 'ManageTeam' });
  } finally {
    loadingData.value = false;
  }
}

function validateForm(): boolean {
  // ... (sua função de validação)
  return true;
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    formData.value.profile_image = file; // Armazena o File

    // Cria preview
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async function handleSubmit() {
  if (!validateForm()) return;
  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    loading.value = true;

    // --- CORREÇÃO AQUI ---
    // 1. Converter a imagem (File) para base64 (string) ANTES de enviar
    let imageBase64: string | undefined = undefined;
    if (formData.value.profile_image) {
      // Se profile_image for um File, converte
      imageBase64 = (await fileToBase64(formData.value.profile_image)) || undefined;
    } else if (isEditing.value && avatarPreview.value) {
      // Se estiver editando e não mudou a foto, mantém a URL antiga (se a API permitir)
      // Se a API *não* aceitar a URL antiga, envie undefined para não alterar.
      // Vou assumir que enviar a URL antiga não é o padrão.
      // Se o usuário não subiu um novo arquivo, enviamos 'undefined'
      // para não alterar a imagem.
      imageBase64 = undefined;
    }

    // 2. Montar o payload com o tipo correto
    // Usamos 'any' temporariamente para construir o objeto
    const data: any = {
      name: formData.value.name,
      specialties: formData.value.specialties || undefined,
      is_active: true
    };

    // Só adiciona a imagem se ela foi alterada
    if (imageBase64) {
      data.profile_image_url = imageBase64;
    }

    if (isEditing.value) {
      // O 'data' agora bate com o tipo UpdateBarberData
      await barberService.update(barbershopId, memberId.value, data as UpdateBarberData);
      alert('Profissional atualizado com sucesso!');
    } else {
      // O 'data' agora bate com o tipo CreateBarberData
      await barberService.create(barbershopId, data as CreateBarberData);
      alert('Profissional adicionado com sucesso!');
    }

    router.push({ name: 'ManageTeam' });

  } catch (error: any) {
    console.error('Erro ao salvar profissional:', error);
    alert(error.response?.data?.message || 'Erro ao salvar profissional');
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: 'ManageTeam' });
}

onMounted(() => {
  loadBarber();
});
</script>

<template>
  <div class="form-screen">
    <header class="form-header">
      <button class="back-btn" @click="goBack">← Voltar</button>
      <h1>{{ isEditing ? 'Editar Profissional' : 'Adicionar Novo Profissional' }}</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loadingData" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando dados...</p>
    </div>

    <main v-else class="form-content">
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label>Foto</label>
          <label for="barber-photo" class="avatar-upload-zone">
            <div class="avatar-preview" :style="avatarPreview ? `background-image: url('${avatarPreview}')` : ''">
              <svg v-if="!avatarPreview" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span class="upload-text">{{ avatarPreview ? 'Alterar foto' : 'Escolher foto' }}</span>
          </label>
          <input
              type="file"
              id="barber-photo"
              class="file-input-hidden"
              accept="image/*"
              @change="handleFileChange"
          >
        </div>

        <div class="input-group">
          <label for="barber-name">Nome do Profissional</label>
          <input
              type="text"
              id="barber-name"
              class="form-input"
              :class="{ 'error': errors.name }"
              placeholder="Ex: Carlos Manoel"
              v-model="formData.name"
          >
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="input-group">
          <label for="barber-specialties">Especialidades (Opcional)</label>
          <input
              type="text"
              id="barber-specialties"
              class="form-input"
              placeholder="Ex: Cortes clássicos, Barboterapia"
              v-model="formData.specialties"
          >
        </div>
      </form>
    </main>

    <div class="cta-container">
      <button
          class="btn btn-primary"
          @click="handleSubmit"
          :disabled="loading || loadingData"
      >
        {{ loading ? 'Salvando...' : 'Salvar Profissional' }}
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

.avatar-upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--color-border);
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-secondary);
  border: 3px dashed var(--color-background-secondary);
  outline: 1px dashed var(--color-border);
  transition: border-color 0.3s;
}

.avatar-upload-zone:hover .avatar-preview {
  border-color: var(--color-accent-primary);
}

.upload-text {
  color: var(--color-accent-primary);
  font-weight: 600;
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