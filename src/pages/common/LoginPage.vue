<script lang="ts">
import {defineComponent} from 'vue'
//Componentes
import { BaseCard, BaseInput, BaseButton, LightLogo } from "@/components";
//Tipos
import type { Login } from '@/types/auth.ts'

export default defineComponent({
  name: "LoginPage",
  components: {
    LightLogo,
    BaseCard,
    BaseButton,
    BaseInput
  },
  props: {
    role: {
      type: String,
      required: false,
      default: 'provider'
    },
  },
  mounted(): any {
    this.setRegistration();
    console.log(this.to)
  },
  data() {
    return {
      login: {} as Login,
      to: ''
    }
  },
  methods: {
    setLogin() {

    },
    setRegistration() {
      if (this.role === 'provider')
      {
        this.to = '/pr/provider-register';
      } else {
        this.to = '/client-register';
      }
    },
    async performUserLogin() {
      console.log('Dados do usuário: ', this.login)
    },
    handleAction(actionType: String) {
      if (actionType === 'login') {
        this.performUserLogin();
      }
    }
  }
})
</script>

<template>
  <main class="container-login-page main-container-default">
    <div class="soon">
      <light-logo />
    </div>

    <base-card
      :size="'lg'"
      :width="'full'"
    >
      <header class="heather-login-page center">
        <h1>Bem-vindo de volta!</h1>
        <span>Entre na sua conta para continuar</span>
      </header>

      <form
          class="login-form f-column"
          @submit.prevent=""
      >
        <base-input
            :label="'E-mail'"
            :placeholder="'exemplo@mail.com'"
            v-model="login.email"
            :type="'text'"
        />
        <base-input
            :label="'Senha'"
            :placeholder="'••••••••'"
            v-model="login.password"
            :type="'password'"
        />

        <div class="forget-password-div center">
          <RouterLink to="/recover-password" class="forget-password">
            Esqueceu sua senha?
          </RouterLink>
        </div>
      </form>

      <base-button
          class="action-button"
          label="Entrar"
          type="primary"
          :function="'login'"
          @continue-function="handleAction"
        />

      <div class="register">
        Não tem uma conta?
        <RouterLink :to="to" class="register-text">
          Cadastre-se
        </RouterLink>
      </div>
    </base-card>
  </main>
</template>

<style scoped>
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
</style>