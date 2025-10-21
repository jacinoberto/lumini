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
        />
      </form>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from '@/services/api';

// Validação
import { useVuelidate } from '@vuelidate/core';
import { required, numeric, helpers } from '@vuelidate/validators';

// Componentes
import BaseHeader from '@/components/base/BaseHeader.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import BaseButton from '@/components/base/BaseButton.vue';

// Tipos (Assumindo que você tem um tipo Service)
import type { CreateService } from '@/types/service'; // Verifique o caminho

export default defineComponent({
  name: 'ServiceFormPage',
  components: { BaseHeader, BaseInput, BaseTextarea, BaseButton },
  props: {
    // Recebe o ID do serviço da rota (ex: /servicos/editar/:id)
    id: {
      type: String,
      required: false, // O ID só existe no modo de edição
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
        price: null as number | null,
        duration_minutes: 30, // Valor padrão
      },
      isLoading: false,
      apiErrorMessage: '',
    };
  },
  validations() {
    return {
      formData: {
        name: { required: helpers.withMessage('O nome do serviço é obrigatório.', required) },
        price: {
          required: helpers.withMessage('O preço é obrigatório.', required),
          numeric: helpers.withMessage('O preço deve ser um número.', numeric)
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
      if (!this.id) return;
      this.isLoading = true;
      try {
        // ATENÇÃO: Verifique o endpoint correto com o Orion (GET /services/{id} ?)
        const response = await api.get(`/services/${this.id}`);
        const serviceData = response.data; // Adapte se a estrutura da resposta for diferente
        this.formData.name = serviceData.name;
        this.formData.description = serviceData.description || '';
        this.formData.price = serviceData.price;
        this.formData.duration_minutes = serviceData.duration_minutes;
      } catch (error) {
        console.error("Erro ao buscar detalhes do serviço:", error);
        this.apiErrorMessage = "Não foi possível carregar os dados do serviço.";
      } finally {
        this.isLoading = false;
      }
    },
    async saveService() {
      this.apiErrorMessage = '';
      const isFormValid = await this.v$.$validate();
      if (!isFormValid) return;

      this.isLoading = true;
      try {
        const payload = {
          name: this.formData.name,
          price: this.formData.price,
          duration_minutes: this.formData.duration_minutes,
          description: this.formData.description || '', // Envia string vazia se não preenchido
        };

        if (this.isEditMode) {
          // Modo Edição: Chama PUT
          await api.put(`/services/${this.id}`, payload);
        } else {
          // Modo Adição: Chama POST
          await api.post('/services', payload);
        }

        // Sucesso! Volta para a tela anterior (lista de serviços)
        this.goBack();

      } catch (error: any) {
        if (error.response?.data?.errors) {
          const apiErrors = error.response.data.errors;
          const firstErrorKey = Object.keys(apiErrors)[0];
          this.apiErrorMessage = apiErrors[firstErrorKey][0];
        } else {
          this.apiErrorMessage = this.isEditMode ? 'Erro ao atualizar o serviço.' : 'Erro ao salvar o serviço.';
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

/* Ajustes no select para combinar com BaseInput */
.form-input.duration-select {
  /* Adapte a altura e padding se necessário para alinhar visualmente */
  height: 59px;
  padding: 1rem;
}

/* Estilo do Vuelidate para o select */
.form-input.has-error {
  border-color: var(--color-danger);
}
.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-caption);
  margin-top: -4px;
}
.error-feedback {
  color: var(--color-danger);
  text-align: center;
  font-weight: var(--font-weight-semibold);
  margin-top: 1rem;
}

.save-button {
  margin-top: 2rem;
}
</style>