<template>
  <div class="service-form-layout">
    <BaseHeader :title="pageTitle" @click="goBack" />

    <main class="form-content">
      <form @submit.prevent="saveService" class="service-form">
        <BaseInput
            label="Nome do Serviço"
            placeholder="Ex: Corte Masculino"
            v-model="formData.name"
            :error="v$.formData.name.$error"
            :errorMessage="v$.formData.name.$errors[0]?.$message"
        />
php a
        <BaseTextarea
            label="Descrição Curta (Opcional)"
            placeholder="Ex: Corte moderno com degradê baixo..."
            v-model="formData.description"
            :rows="3"
        />

        <div class="price-duration-row">
          <BaseInput
              label="Preço (R$)"
              placeholder="40,00"
              type="number"
              step="0.01"
              min="0"
              v-model="formData.price"
              :error="v$.formData.price.$error"
              :errorMessage="v$.formData.price.$errors[0]?.$message"
          />
          <div class="input-group">
            <label for="service-duration">Duração (min)</label>
            <select
                id="service-duration"
                class="form-input duration-select"
                v-model="formData.duration_minutes"
                :class="{ 'has-error': v$.formData.duration_minutes.$error }"
            >
              <option :value="15">15 min</option>
              <option :value="30">30 min</option>
              <option :value="45">45 min</option>
              <option :value="60">60 min</option>
              <option :value="75">75 min</option>
              <option :value="90">90 min</option>
            </select>
            <p v-if="v$.formData.duration_minutes.$error" class="error-message">
              {{ v$.formData.duration_minutes.$errors[0]?.$message }}
            </p>
          </div>
        </div>

        <p v-if="apiErrorMessage" class="error-feedback">{{ apiErrorMessage }}</p>

        <BaseButton
            class="save-button"
            :label="buttonLabel"
            type="primary"
            :disabled="isLoading"
            buttonType="submit" />
      </form>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from '@/services/api';

// Validação
import { useVuelidate } from '@vuelidate/core';
import { required, numeric, minValue, helpers } from '@vuelidate/validators';

// Componentes
import BaseHeader from '@/components/base/BaseHeader.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import BaseButton from '@/components/base/BaseButton.vue';

// Tipos (Adapte conforme a API)
type ServiceFormData = {
  name: string;
  description: string;
  price: number | null;
  duration_minutes: number;
};

export default defineComponent({
  name: 'ServiceFormPage',
  components: { BaseHeader, BaseInput, BaseTextarea, BaseButton },
  props: {
    // Recebe o ID do serviço da rota (ex: /servicos/editar/:id) via props: true no router
    id: {
      type: String,
      required: false,
    },
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      formData: {
        name: '',
        description: '',
        price: null,
        duration_minutes: 30, // Valor padrão
      } as ServiceFormData,
      isLoading: false,
      apiErrorMessage: '',
      barbershopId: localStorage.getItem('barbershopId'), // Pega o ID salvo
    };
  },
  validations() {
    return {
      formData: {
        name: { required: helpers.withMessage('O nome do serviço é obrigatório.', required) },
        price: {
          required: helpers.withMessage('O preço é obrigatório.', required),
          numeric: helpers.withMessage('O preço deve ser um número.', numeric),
          minValue: helpers.withMessage('O preço deve ser positivo.', minValue(0))
        },
        duration_minutes: { required: helpers.withMessage('A duração é obrigatória.', required) },
      },
    };
  },
  computed: {
    isEditMode(): boolean {
      return !!this.id; // Se 'id' existe na prop, estamos editando
    },
    pageTitle(): string {
      return this.isEditMode ? 'Editar Serviço' : 'Adicionar Novo Serviço';
    },
    buttonLabel(): string {
      return this.isEditMode ? 'Salvar Alterações' : 'Salvar Serviço';
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async fetchServiceDetails() {
      if (!this.id || !this.barbershopId) return; // Precisa do ID da barbearia também? Confirme com Orion.
      this.isLoading = true;
      this.apiErrorMessage = '';
      try {
        // CONFIRMAR ENDPOINT GET com Orion (ex: /barbershops/{barbershopId}/services/{serviceId})
        const response = await api.get(`/services/${this.id}`); // Ajuste endpoint se necessário
        const serviceData = response.data;

        // Preenche o formulário com os dados da API
        this.formData.name = serviceData.name;
        this.formData.description = serviceData.description || '';
        // Converte o preço de string (API) para number (formulário) se necessário
        this.formData.price = typeof serviceData.price === 'string' ? parseFloat(serviceData.price) : serviceData.price;
        this.formData.duration_minutes = serviceData.duration_minutes;

      } catch (error) {
        console.error("Erro ao buscar detalhes do serviço:", error);
        this.apiErrorMessage = "Não foi possível carregar os dados do serviço.";
      } finally {
        this.isLoading = false;
      }
    },
    async saveService() {
      if (!this.barbershopId) {
        this.apiErrorMessage = "Erro: ID da barbearia não encontrado.";
        return;
      }
      this.apiErrorMessage = '';
      const isFormValid = await this.v$.$validate();
      if (!isFormValid) return;

      this.isLoading = true;
      try {
        // Monta o payload com os campos esperados pela API
        const payload = {
          name: this.formData.name,
          // Converte o preço para formato numérico adequado (ex: 45.00)
          price: Number(this.formData.price).toFixed(2),
          duration_minutes: this.formData.duration_minutes,
          description: this.formData.description || null, // Envia null se vazio? Confirme com Orion.
        };

        if (this.isEditMode) {
          // Modo Edição: Chama PUT
          // CONFIRMAR ENDPOINT PUT com Orion (ex: /barbershops/{barbershopId}/services/{serviceId})
          await api.put(`/services/${this.id}`, payload); // Ajuste endpoint se necessário
        } else {
          // Modo Adição: Chama POST
          await api.post(`/barbershops/${this.barbershopId}/services`, payload);
        }

        // Sucesso! Volta para a tela anterior (lista de serviços)
        this.goBack();

      } catch (error: any) {
        const apiErrors = error.response?.data?.errors || {};
        const errorKeys = Object.keys(apiErrors);
        const firstErrorKey = errorKeys.length > 0 ? errorKeys[0] : undefined;

        if (firstErrorKey && apiErrors[firstErrorKey] && apiErrors[firstErrorKey].length > 0) {
          // Acessa apenas se a chave existe e o array de erros não está vazio
          this.apiErrorMessage = apiErrors[firstErrorKey][0];
        } else {
          // Fallback para uma mensagem genérica
          this.apiErrorMessage = error.response?.data?.message || 'Erro ao salvar o serviço.';
        }
        console.error("Erro ao salvar serviço:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    // Se estiver no modo de edição, busca os dados do serviço ao carregar a página
    if (this.isEditMode) {
      this.fetchServiceDetails();
    }
  },
});
</script>

<style scoped>
.service-form-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-background-primary);
}

.form-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem; /* 24px */
}

.service-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 24px */
}

/* Container para alinhar Preço e Duração lado a lado */
.price-duration-row {
  display: flex;
  gap: 1rem; /* 16px */
  align-items: flex-start; /* Alinha pelo topo */
}

/* Cada grupo dentro da linha ocupa metade do espaço */
.price-duration-row > * {
  flex: 1;
}

/* Grupo de input para o select */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: var(--color-text-secondary);
}

/* Ajustes no select para combinar com BaseInput */
.form-input.duration-select {
  /* Adapte a altura e padding se necessário para alinhar visualmente */
  height: 59px; /* Mesma altura do BaseInput */
  padding: 0 1rem; /* Padding horizontal */
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: 'Sora', sans-serif;
  font-size: var(--font-size-button); /* Mesmo tamanho de fonte */
  -webkit-appearance: none; /* Remove aparência padrão no Safari/Chrome */
  appearance: none; /* Remove aparência padrão */
  /* Adiciona ícone de seta customizado se desejar */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.form-input.duration-select:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}

/* Estilo do Vuelidate para o select */
.form-input.has-error {
  border-color: var(--color-danger);
}
.error-message { /* Reutiliza o estilo de erro do BaseInput */
  color: var(--color-danger);
  font-size: var(--font-size-caption);
  margin-top: -4px;
}
.error-feedback { /* Mensagem geral de erro da API */
  color: var(--color-danger);
  text-align: center;
  font-weight: var(--font-weight-semibold);
  margin-top: 1rem;
}

.save-button {
  margin-top: 2rem; /* Espaço antes do botão */
}
</style>