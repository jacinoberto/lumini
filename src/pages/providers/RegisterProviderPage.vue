<template>
  <card-heather
      :title="'Cadastre sua Barbearia'"
      :description="'Preencha os dados abaixo para criar seu perfil profissional'"
  />

  <main class="container-register-provider">
    <form class="register-provider-form f-column" @submit.prevent="performRegister">
      <div class="input-block f-column">
        <div class="heather-block"><span>Dados do Estabelecimento</span></div>
        <div class="inputs f-column">
          <base-input label="Nome da Barbearia" v-model="provider.barberName" :error="v$.provider.barberName.$error" :errorMessage="v$.provider.barberName.$errors[0]?.$message" />
          <base-input label="CNPJ" v-model="provider.companyCode" />
          <base-input label="Telefone/Whatsapp" v-model="provider.phone" />
        </div>
      </div>
      <div class="input-block f-column">
        <div class="heather-block"><span>Dados do Proprietário</span></div>
        <div class="inputs f-column">
          <base-input label="Seu Nome Completo" v-model="provider.owner.name" :error="v$.provider.owner.name.$error" :errorMessage="v$.provider.owner.name.$errors[0]?.$message" />
          <base-input label="CPF" v-model="provider.owner.socialSecurity" />
          <base-input label="E-mail de Acesso" v-model="provider.owner.email" :error="v$.provider.owner.email.$error" :errorMessage="v$.provider.owner.email.$errors[0]?.$message" />
          <base-input label="Senha" type="password" v-model="provider.owner.password" :error="v$.provider.owner.password.$error" :errorMessage="v$.provider.owner.password.$errors[0]?.$message" />
          <base-input label="Confirmar Senha" type="password" v-model="password_confirmation" :error="v$.password_confirmation.$error" :errorMessage="v$.password_confirmation.$errors[0]?.$message" />
        </div>
      </div>

      <div v-if="apiErrorMessage" class="error-feedback">
        {{ apiErrorMessage }}
      </div>

      <base-button
          class="button-action"
          label="Finalizar Cadastro"
          type="primary"
          :disabled="isLoading"
      />
    </form>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from '@/services/api';
import router from '@/router';

// Validação
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators';

// Componentes
import { CardHeather, BaseInput, BaseButton, BaseFileInput, BaseTextarea } from "@/components";
import type { RegisterProvider } from '@/types/user';
import {useAuthStore} from "@/stores/authStore.ts";

export default defineComponent({
  name: "RegisterProviderPage",
  components: { BaseButton, BaseInput, CardHeather, BaseFileInput, BaseTextarea },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      // CORREÇÃO: Restauramos a estrutura 'provider' original que o seu template usa
      provider: {
        barberName: '',
        companyCode: '',
        phone: '',
        owner: {
          name: '',
          socialSecurity: '',
          email: '',
          password: '',
        },
      } as RegisterProvider,
      password_confirmation: '', // Campo separado para a confirmação
      isLoading: false,
      apiErrorMessage: '',
    };
  },
  validations() {
    // CORREÇÃO: As regras de validação agora espelham a estrutura 'provider'
    return {
      provider: {
        barberName: { required: helpers.withMessage('O nome da barbearia é obrigatório.', required) },
        owner: {
          name: { required: helpers.withMessage('O seu nome é obrigatório.', required) },
          email: { required: helpers.withMessage('O e-mail é obrigatório.', required), email: helpers.withMessage('Insira um e-mail válido.', email) },
          password: { required: helpers.withMessage('A senha é obrigatória.', required), minLength: helpers.withMessage('A senha deve ter no mínimo 6 caracteres.', minLength(6)) },
        },
      },
      password_confirmation: {
        required: helpers.withMessage('Confirme sua senha.', required),
        sameAs: helpers.withMessage('As senhas não coincidem.', sameAs(this.provider.owner.password))
      }
    };
  },
  methods: {
    async performRegister() {
      this.apiErrorMessage = '';
      const isFormValid = await this.v$.$validate();
      if (!isFormValid) return;

      this.isLoading = true;
      try {
        const payload = {
          name: this.provider.owner.name,
          email: this.provider.owner.email,
          password: this.provider.owner.password,
          password_confirmation: this.password_confirmation,
          role: 'OWNER',
          barbershop_name: this.provider.barberName,
        };

        const response = await api.post('/register', payload);
        const { access_token, user } = response.data;

        // 🔹 Usa o authStore para registrar o token corretamente
        const authStore = useAuthStore();
        authStore.setAuth(access_token, user);

        // 🔹 Garante que o ID da barbearia seja salvo também
        if (user.barbershop?.id) {
          localStorage.setItem('barbershopId', user.barbershop.id);
        }

        // 🔹 Guarda também o user completo, se quiser reaproveitar
        localStorage.setItem('userData', JSON.stringify(user));

        // 🔹 Redireciona para o onboarding
        this.$router.push({ name: 'BarberOnboardingBarber' });
      } catch (error: any) {
        const apiErrors = error.response?.data?.errors || {};
        const errorKeys = Object.keys(apiErrors);
        const firstErrorKey = errorKeys.length > 0 ? errorKeys[0] : undefined;

        if (firstErrorKey && apiErrors[firstErrorKey]) {
          this.apiErrorMessage = apiErrors[firstErrorKey][0];
        } else {
          this.apiErrorMessage = error.response?.data?.message || 'Ocorreu um erro desconhecido.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  },
});
</script>

<style scoped>
.container-register-provider {
  padding: 24px;
}

.register-provider-form {
  width: 100%;
  display: flex;
  row-gap: 48px;

}

.heather-block {
  padding-bottom: 8px;
  border-bottom: solid 1px var(--color-border);
  margin-bottom: 24px;
}

.heather-block span {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
}

.inputs {
  display: flex;
  row-gap: 16px;
}

.address {
  width: 100%;
  justify-content: space-between;
}

.address-full {
  width: 74%;
}

.address-small {
  width: 20%;
}

.button-action {
  margin-top: 40px;
}

.error-feedback {
  color: var(--color-danger);
  text-align: center;
  font-weight: var(--font-weight-semibold);
  margin-top: 1rem;
}
</style>