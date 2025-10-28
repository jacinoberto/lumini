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
        />

        <div v-if="apiErrorMessage" class="error-feedback">
          {{ apiErrorMessage }}
        </div>
      </form>

      <div class="register">
        Não tem uma conta?
        <RouterLink to="/provider/register" class="register-text"> Cadastre-se como Barbeiro </RouterLink>
      </div>
    </base-card>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from '@/services/api';

// Validação
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';

// Componentes
import { BaseCard, BaseInput, BaseButton, LightLogo } from "@/components";

export default defineComponent({
  name: "LoginPage",
  components: { LightLogo, BaseCard, BaseButton, BaseInput },
  setup() {
    return { v$: useVuelidate() };
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
        email: { required: helpers.withMessage('O e-mail é obrigatório.', required), email: helpers.withMessage('Insira um e-mail válido.', email) },
        password: { required: helpers.withMessage('A senha é obrigatória.', required) },
      },
    };
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

        // --- Sucesso no Login ---
        const { access_token, user } = response.data;

        // 1. Salva o token
        localStorage.setItem('authToken', access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        // 2. Salva informações do usuário (role é crucial)
        localStorage.setItem('userData', JSON.stringify(user));

        // 3. Salva ID da barbearia (se for OWNER)
        if (user.role === 'OWNER' && user.barbershop) {
          localStorage.setItem('barbershopId', user.barbershop.id);
          // Redireciona para o dashboard do barbeiro
          this.$router.push({ name: 'Dashboard' }); // Usa o nome da rota do dashboard
        } else if (user.role === 'CLIENT') {
          // Redireciona para o dashboard do cliente (criar esta rota depois)
          // this.$router.push({ name: 'ClientDashboard' });
          console.log("Login de cliente - redirecionamento pendente");
        } else {
          // Caso inesperado (ex: OWNER sem barbershop?)
          this.apiErrorMessage = "Dados do usuário incompletos.";
        }

      } catch (error: any) {
        if (error.response && error.response.status === 401) { // 401 Unauthorized é comum para login inválido
          this.apiErrorMessage = 'E-mail ou senha inválidos.';
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
.container-login-page {
  justify-content: center;
}

  .soon {
    margin-bottom: 40px;
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
   /* [Seus estilos para a página de login aqui] */
 .error-feedback {
   color: var(--color-danger);
   text-align: center;
   font-weight: var(--font-weight-semibold);
   margin-top: 1rem;
 }
</style>