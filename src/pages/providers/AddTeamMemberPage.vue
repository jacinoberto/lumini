<template>
  <div class="add-member-layout">
    <BaseHeader :title="pageTitle" @click="goBack" />

    <main class="form-content">
      <form @submit.prevent="saveBarber" class="add-member-form">
        <div class="avatar-section">
          <BaseAvatar :src="formData?.avatar" :name="formData?.name" size="lg" />
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
            :error="v$.formData?.name?.$error"
            :errorMessage="v$.formData?.name?.$errors?.[0]?.$message"
        />

        <BaseTextarea
            label="Especialidades"
            placeholder="Ex: Cortes clássicos, Barboterapia"
            v-model="formData.specialties"
            :rows="3"
            :error="v$.formData?.specialties?.$error"
            :errorMessage="v$.formData?.specialties?.$errors?.[0]?.$message"
        />

        <p v-if="apiErrorMessage" class="error-feedback">{{ apiErrorMessage }}</p>

        <BaseButton
            class="save-button"
            :label="buttonLabel"
            type="primary"
            :disabled="isLoading"
            buttonType="submit"
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
import BaseFileInput from '@/components/base/BaseFileInput.vue';

export default defineComponent({
  name: 'AddTeamMemberPage',
  // Certifique-se de registrar todos os componentes importados
  components: {
    BaseHeader,
    BaseAvatar,
    BaseInput,
    BaseTextarea,
    BaseButton,
    BaseFileInput,
  },
  props: {
    memberId: {
      type: String,
      required: false,
    },
  },
  setup() {
    const fileInput = ref<InstanceType<typeof BaseFileInput> | null>(null);
    return { v$: useVuelidate(), fileInput };
  },
  data() {
    return {
      formData: {
        name: '',
        specialties: '',
        avatar: null as string | null, // Base64
      },
      isLoading: false,
      apiErrorMessage: '',
      barbershopId: localStorage.getItem('barbershopId'),
    };
  },
  validations() {
    return {
      formData: {
        name: { required: helpers.withMessage('O nome é obrigatório.', required) },
        specialties: { required: helpers.withMessage('Informe as especialidades.', required) },
        // avatar: { required }, // Descomente se a foto for obrigatória
      },
    };
  },
  computed: {
    isEditMode(): boolean {
      return !!this.memberId;
    },
    pageTitle(): string {
      return this.isEditMode ? 'Editar Barbeiro' : 'Adicionar Novo Barbeiro';
    },
    buttonLabel(): string {
      return this.isEditMode ? 'Salvar Alterações' : 'Salvar Barbeiro';
    },
  },
  methods: {
    goBack() { this.$router.go(-1); },
    triggerFileInput() { this.fileInput?.openFilePicker(); },
    handleAvatarUpload(base64: string | null) { this.formData.avatar = base64; },

    async fetchMemberDetails() {
      if (!this.memberId || !this.barbershopId) return;
      this.isLoading = true;
      this.apiErrorMessage = '';
      try {
        const response = await api.get(`/barbershops/${this.barbershopId}/barbers/${this.memberId}`);
        const memberData = response.data;
        this.formData.name = memberData.name;
        this.formData.specialties = memberData.specialties;
        this.formData.avatar = memberData.profile_image;
      } catch (error) {
        console.error("Erro ao buscar detalhes do membro:", error);
        this.apiErrorMessage = "Não foi possível carregar os dados.";
      } finally {
        this.isLoading = false;
      }
    },

    async saveBarber() {
      if (!this.barbershopId) {
        this.apiErrorMessage = "Erro: ID da barbearia não encontrado.";
        return;
      }
      this.apiErrorMessage = '';
      const isFormValid = await this.v$.$validate();
      if (!isFormValid) return;

      this.isLoading = true;
      try {
        const payload = {
          name: this.formData.name,
          specialties: this.formData.specialties,
          profile_image: this.formData.avatar,
        };

        if (this.isEditMode) {
          await api.put(`/barbershops/${this.barbershopId}/barbers/${this.memberId}`, payload);
        } else {
          await api.post(`/barbershops/${this.barbershopId}/barbers`, payload);
        }

        this.$router.push({ name: 'ManageTeam'});

      } catch (error: any) {
        if (error.response?.data?.errors) {
          const apiErrors = error.response.data.errors;
          const firstErrorKey = Object.keys(apiErrors)[0];

          // CORREÇÃO: Verifique se firstErrorKey existe antes de usá-lo
          if (firstErrorKey) {
            // Pega a primeira mensagem de erro para a primeira chave encontrada
            this.apiErrorMessage = apiErrors[firstErrorKey]?.[0] || 'Erro de validação desconhecido.';
          } else {
            // Fallback se apiErrors for um objeto vazio
            this.apiErrorMessage = error.response.data.message || 'Ocorreu um erro de validação.';
          }

        } else if (error.response?.data?.message) {
          this.apiErrorMessage = error.response.data.message;
        } else {
          this.apiErrorMessage = this.isEditMode ? 'Erro ao atualizar.' : 'Erro ao salvar.';
        }
        console.error("Erro ao salvar barbeiro:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    if (this.isEditMode) {
      this.fetchMemberDetails();
    }
  },
});
</script>

<style scoped>
.add-member-layout {
  display: flex;
  flex-direction: column;
  /* IMPORTANTE: Remova height: 100vh se o pai já controla a altura */
  /* height: 100vh; */
  height: 100%; /* Ocupa a altura dada pelo pai */
  background-color: var(--color-background-primary);
}

.form-content {
  flex-grow: 1; /* Ocupa o espaço vertical disponível */
  overflow-y: auto; /* Permite scroll SE o conteúdo for maior que o espaço */
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