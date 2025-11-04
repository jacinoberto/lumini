<template>
  <main class="container-login-page main-container-default">
    <base-card :size="'lg'" :width="'full'">
      <header class="heather-login-page center">
        <h1>Bem-vindo de volta!</h1>
        <span>Entre na sua conta para continuar</span>
      </header>

      <form class="login-form f-column" @submit.prevent="handleLogin">
        <base-input
            label="E-mail"
            placeholder="exemplo@mail.com"
            type="email"
            v-model="formData.email"
            :error="v$.formData.email.$error"
            :errorMessage="v$.formData.email.$errors[0]?.$message"
        />
        <base-input
            label="Senha"
            placeholder="••••••••"
            type="password"
            v-model="formData.password"
            :error="v$.formData.password.$error"
            :errorMessage="v$.formData.password.$errors[0]?.$message"
        />

        <div class="forget-password-div center">
          <RouterLink to="/recover-password" class="forget-password">
            Esqueceu sua senha?
          </RouterLink>
        </div>

        <base-button
            class="action-button"
            label="Entrar"
            type="primary"
            :disabled="isLoading"
            buttonType="submit" />

        <div v-if="apiErrorMessage" class="error-feedback">
          {{ apiErrorMessage }}
        </div>
      </form>

      <div class="register">
        Não tem uma conta?
        <RouterLink :to="registerRoute" class="register-text"> Cadastre-se </RouterLink>
      </div>
    </base-card>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';

// Validação
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';

// Componentes
import { BaseCard, BaseInput, BaseButton } from "@/components"; // Removido LightLogo que não está no template

export default defineComponent({
  name: "LoginPage",
  components: { BaseCard, BaseButton, BaseInput },
  setup() {
    return {
      v$: useVuelidate(),
      authStore: useAuthStore() // Store já está disponível
    };
  },
  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
      isLoading: false,
      apiErrorMessage: '',
    };
  },
  validations() {
    return {
      formData: {
        email: {
          required: helpers.withMessage('O e-mail é obrigatório.', required),
          email: helpers.withMessage('Insira um e-mail válido.', email)
        },
        password: {
          required: helpers.withMessage('A senha é obrigatória.', required)
        },
      },
    };
  },
  // MUDANÇA AQUI: Adiciona a computed property
  computed: {
    /**
     * Define dinamicamente o link de registro com base
     * na role selecionada na tela anterior (AccountTypeSelection)
     * e salva no authStore (sessionStorage).
     */
    registerRoute(): { name: string } {
      if (this.authStore.selectedRole === 'OWNER') {
        return { name: 'RegisterProvider' }; // Rota de cadastro do Barbeiro
      }
      // Padrão é Cliente, mesmo se 'selectedRole' for 'CLIENT' ou 'null'
      return { name: 'RegisterClient' };
    }
  },
  methods: {
    async handleLogin() {
      this.apiErrorMessage = '';
      const isFormValid = await this.v$.$validate();
      if (!isFormValid) return;

      this.isLoading = true;
      try {
        const payload = {
          email: this.formData.email,
          password: this.formData.password,
        };

        const response = await api.post('/login', payload);

        const { access_token, user } = response.data;

        // Salva no authStore (o store agora lida com o localStorage e o header do Axios)
        this.authStore.setAuth(access_token, user);
        this.authStore.clearSelectedRole(); // Limpa a role de pré-login

        // Redireciona baseado na role da API
        if (user.role === 'OWNER') {
          // CORREÇÃO: O nome da sua rota de dashboard do barbeiro é 'Dashboard'
          this.$router.push({ name: 'Dashboard' });
        } else if (user.role === 'CLIENT') {
          // CORREÇÃO: O nome da sua rota de home do cliente é 'ClientHome'
          this.$router.push({ name: 'ClientDashboard' });
        } else {
          this.apiErrorMessage = "Tipo de usuário desconhecido.";
        }

      } catch (error: any) {
        if (error.response && (error.response.status === 401 || error.response.status === 422)) {
          // Erro de credenciais inválidas (401) ou 422 (do Laravel para 'email' não encontrado)
          this.apiErrorMessage = error.response.data.message || 'E-mail ou senha inválidos.';
        } else if (error.response?.data?.message) {
          this.apiErrorMessage = error.response.data.message;
        } else {
          this.apiErrorMessage = 'Não foi possível conectar ao servidor.';
        }
        console.error('Erro no login:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style scoped>
/* Seus estilos não mudam */
.container-login-page {
  justify-content: center;
}
.heather-login-page {
  flex-direction: column;
  text-align: center;
  row-gap: 4px;
}
.login-form {
  display: flex;
  row-gap: 16px;
  margin-top: 40px;
  column-gap: 16px;
}
.forget-password-div {
  justify-content: end;
}
.forget-password, .register-text {
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent-primary);
  text-decoration: none;
}
.action-button, .register {
  margin-top: 32px;
}
.register {
  text-align: center;
  font-weight: var(--font-weight-semibold);
}
.error-feedback {
  color: var(--color-danger);
  text-align: center;
  font-weight: var(--font-weight-semibold);
  margin-top: 1rem;
}
</style>