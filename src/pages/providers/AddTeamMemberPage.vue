<template>
  <div class="add-member-layout">
    <BaseHeader title="Adicionar Novo Barbeiro" @click="goBack" />

    <main class="form-content">
      <form @submit.prevent="saveBarber" class="add-member-form">
        <div class="avatar-section">
          <BaseAvatar :src="formData.avatar" :name="formData.name" size="lg" />
          <button type="button" class="change-photo-btn" @click="triggerFileInput">
            Escolher Foto
          </button>
          <BaseFileInput
              ref="fileInput"
              class="hidden-file-input"
              @file-selected="handleAvatarUpload"
          />
        </div>

        <BaseInput
            label="Nome do Profissional"
            placeholder="Ex: Carlos Eduardo"
            v-model="formData.name"
            :error="v$.formData.name.$error"
            :errorMessage="v$.formData.name.$errors[0]?.$message"
        />

        <BaseTextarea
            label="Especialidades"
            placeholder="Ex: Cortes clássicos, Barboterapia"
            v-model="formData.specialties"
            :rows="3"
            :error="v$.formData.specialties.$error"
            :errorMessage="v$.formData.specialties.$errors[0]?.$message"
        />

        <p v-if="apiErrorMessage" class="error-feedback">{{ apiErrorMessage }}</p>

        <BaseButton
            class="save-button"
            label="Salvar Barbeiro"
            type="primary"
            :disabled="isLoading"
        />
      </form>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from '@/services/api';

// Validação
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

// Componentes
import BaseHeader from '@/components/base/BaseHeader.vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseFileInput from '@/components/base/BaseFileInput.vue'; // Importamos o file input

export default defineComponent({
  name: 'AddTeamMemberPage',
  components: {
    BaseHeader,
    BaseAvatar,
    BaseInput,
    BaseTextarea,
    BaseButton,
    BaseFileInput,
  },
  setup() {
    // Referência para o BaseFileInput escondido
    const fileInput = ref<InstanceType<typeof BaseFileInput> | null>(null);
    return { v$: useVuelidate(), fileInput };
  },
  data() {
    return {
      formData: {
        name: '',
        specialties: '',
        avatar: null as string | null, // Para armazenar o Base64 da imagem
      },
      isLoading: false,
      apiErrorMessage: '',
    };
  },
  validations() {
    return {
      formData: {
        name: { required: helpers.withMessage('O nome é obrigatório.', required) },
        specialties: { required: helpers.withMessage('Informe as especialidades.', required) },
        // Validação para o avatar pode ser adicionada se for obrigatório
      },
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    triggerFileInput() {
      // Chama o método 'openFilePicker' do BaseFileInput
      this.fileInput?.openFilePicker();
    },
    handleAvatarUpload(base64: string | null) {
      this.formData.avatar = base64;
    },
    async saveBarber() {
      this.apiErrorMessage = '';
      const isFormValid = await this.v$.$validate();
      if (!isFormValid) return;

      this.isLoading = true;
      try {
        // ATENÇÃO: Confirme o endpoint e o payload com o Orion
        // Exemplo: POST /barbers ou POST /team-members
        const payload = {
          name: this.formData.name,
          specialties: this.formData.specialties,
          profile_image: this.formData.avatar, // Adapte o nome do campo se necessário
        };

        await api.post('/barbers', payload); // Ajuste o endpoint

        // Sucesso! Volta para a tela anterior (lista da equipe)
        this.goBack();

      } catch (error: any) {
        if (error.response?.data?.errors) {
          const apiErrors = error.response.data.errors;
          const firstErrorKey = Object.keys(apiErrors)[0];
          this.apiErrorMessage = apiErrors[firstErrorKey][0];
        } else {
          this.apiErrorMessage = 'Erro ao salvar o barbeiro. Tente novamente.';
        }
        console.error("Erro ao salvar barbeiro:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style scoped>
.add-member-layout {
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

.add-member-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 24px */
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem; /* 16px */
  margin-bottom: 1rem;
}

.change-photo-btn {
  background: none;
  border: none;
  color: var(--color-accent-primary);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  padding: 0.5rem;
}

/* Esconde o BaseFileInput visualmente, mas o mantém funcional */
.hidden-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
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