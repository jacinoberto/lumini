<template>
  <div class="screen-container">
    <header class="form-header">
      <h1>Crie sua Conta</h1>
      <p>Para agendar seu próximo corte de cabelo.</p>
    </header>

    <main class="form-body">
      <form @submit.prevent="handleRegister">
        <input
            type="text"
            placeholder="Nome Completo"
            class="form-input"
            v-model="formData.name"
            :class="{ 'input-error': v$.formData.name.$error }"
        >
        <span v-if="v$.formData.name.$error" class="error-message">
          {{ v$.formData.name.$errors[0]?.$message }}
        </span>

        <input
            type="tel"
            placeholder="Telefone (DDD + Número)"
            class="form-input"
            v-model="formData.phone"
            v-mask="'(##) #####-####'"
            :class="{ 'input-error': v$.formData.phone.$error }"
        >
        <span v-if="v$.formData.phone.$error" class="error-message">
          {{ v$.formData.phone.$errors[0]?.$message }}
        </span>

        <input
            type="email"
            placeholder="E-mail"
            class="form-input"
            v-model="formData.email"
            :class="{ 'input-error': v$.formData.email.$error }"
        >
        <span v-if="v$.formData.email.$error" class="error-message">
          {{ v$.formData.email.$errors[0]?.$message }}
        </span>

        <input
            type="password"
            placeholder="Senha"
            class="form-input"
            v-model="formData.password"
            :class="{ 'input-error': v$.formData.password.$error }"
        >
        <span v-if="v$.formData.password.$error" class="error-message">
          {{ v$.formData.password.$errors[0]?.$message }}
        </span>

        <input
            type="password"
            placeholder="Confirmar Senha"
            class="form-input"
            v-model="formData.passwordConfirmation"
            :class="{ 'input-error': v$.formData.passwordConfirmation.$error }"
        >
        <span v-if="v$.formData.passwordConfirmation.$error" class="error-message">
          {{ v$.formData.passwordConfirmation.$errors[0]?.$message }}
        </span>

        <button
            type="submit"
            class="btn btn-primary"
            :disabled="isLoading"
        >
          {{ isLoading ? 'Criando conta...' : 'Criar Conta' }}
        </button>

        <div v-if="apiErrorMessage" class="api-error-feedback">
          {{ apiErrorMessage }}
        </div>
      </form>
    </main>

    <footer>
      <p class="login-link">
        Já tem uma conta? <RouterLink to="/login">Entre</RouterLink>
      </p>
      <p class="back-link">
        <RouterLink to="/">← Voltar para seleção de tipo</RouterLink>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, helpers, sameAs } from '@vuelidate/validators';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// State
const formData = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
  passwordConfirmation: '',
});

const isLoading = ref(false);
const apiErrorMessage = ref('');

// Validations
const rules = computed(() => ({
  formData: {
    name: {
      required: helpers.withMessage('O nome é obrigatório.', required),
      minLength: helpers.withMessage('O nome deve ter pelo menos 3 caracteres.', minLength(3))
    },
    phone: {
      required: helpers.withMessage('O telefone é obrigatório.', required),
      minLength: helpers.withMessage('Insira um telefone válido.', minLength(15))
    },
    email: {
      required: helpers.withMessage('O e-mail é obrigatório.', required),
      email: helpers.withMessage('Insira um e-mail válido.', email)
    },
    password: {
      required: helpers.withMessage('A senha é obrigatória.', required),
      minLength: helpers.withMessage('A senha deve ter no mínimo 8 caracteres.', minLength(8))
    },
    passwordConfirmation: {
      required: helpers.withMessage('Confirme sua senha.', required),
      sameAs: helpers.withMessage('As senhas não coincidem.', sameAs(formData.value.password))
    }
  }
}));

const v$ = useVuelidate(rules, { formData });

// Methods
const handleRegister = async () => {
  apiErrorMessage.value = '';
  const isFormValid = await v$.value.$validate();
  if (!isFormValid) return;

  isLoading.value = true;
  try {
    // Payload conforme especificação do backend
    const payload = {
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      password_confirmation: formData.value.passwordConfirmation,
      role: 'CLIENT'
    };

    console.log('Enviando registro de cliente:', payload);

    const response = await api.post('/register', payload);

    console.log('Resposta do registro:', response.data);

    // Resposta esperada: { message, access_token, token_type, user }
    const { access_token, user } = response.data;

    // Salva na store (sem barbershopId para cliente)
    authStore.setAuth(access_token, user);
    authStore.clearSelectedRole();

    console.log('Cliente registrado com sucesso:', user);

    // Redireciona para dashboard do cliente
    router.push({ name: 'ClientDashboard' });

  } catch (error: any) {
    console.error('Erro no cadastro do cliente:', error);

    if (error.response?.data?.errors) {
      // Erros de validação do Laravel
      const errors = error.response.data.errors;
      const firstErrorKey = Object.keys(errors)[0];
      const firstError = errors[firstErrorKey];
      apiErrorMessage.value = Array.isArray(firstError) ? firstError[0] : 'Erro ao criar conta.';
    } else if (error.response?.data?.message) {
      apiErrorMessage.value = error.response.data.message;
    } else if (error.message) {
      apiErrorMessage.value = error.message;
    } else {
      apiErrorMessage.value = 'Não foi possível conectar ao servidor.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  // Valida se selecionou CLIENT
  if (authStore.selectedRole !== 'CLIENT') {
    console.warn('Role não é CLIENT, redirecionando para seleção');
    router.push({ name: 'AccountType' });
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.screen-container {
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #111827;
  font-family: 'Sora', sans-serif;
  color: #F9FAFB;
  -webkit-font-smoothing: antialiased;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
  font-weight: 700;
  color: #F9FAFB;
}

.form-header p {
  color: #9CA3AF;
  font-size: 16px;
  font-weight: 400;
}

.form-body {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.form-body form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-input {
  width: 100%;
  padding: 16px;
  background-color: #1F2937;
  border: 1px solid #374151;
  border-radius: 12px;
  color: #F9FAFB;
  font-size: 16px;
  font-family: 'Sora', sans-serif;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #059669;
}

.form-input.input-error {
  border-color: #EF4444;
}

.error-message {
  color: #EF4444;
  font-size: 14px;
  margin-top: -12px;
  margin-bottom: 4px;
  padding-left: 4px;
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 1.125rem;
  border-radius: 1rem;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-primary {
  background-image: linear-gradient(to right, #059669, #047857);
  color: #F9FAFB;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.api-error-feedback {
  color: #EF4444;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  padding: 12px;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

footer {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-link,
.back-link {
  text-align: center;
  font-size: 14px;
  color: #9CA3AF;
}

.login-link a,
.back-link a {
  color: #059669;
  font-weight: 600;
  text-decoration: none;
}

.login-link a:hover,
.back-link a:hover {
  text-decoration: underline;
}
</style>