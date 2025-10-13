<template>
  <header class="heather-barber-onboarding center f-column">
    <button v-if="stepValue !== 1" class="return center" @click="decraseStep">
      <vue-feather type="arrow-left" size="24" />
      <span>Voltar</span>
    </button>

    <span>Passo {{ stepValue }} de 3</span>
    <h1>{{ stepTitle }}</h1>

    <div class="progress-bar">
      <div :class="['percentage-progress', progressClass]"></div>
    </div>
  </header>

  <main class="container-onboarding-provider main-container-default">
    <div class="content-container-onboarding-provider f-column">
      <StepOneProvider
          v-show="stepValue === 1"
          v-model="onboarding"
          :validation="v$.onboarding"
      />
      <StepTwoProvider
          v-show="stepValue === 2"
          v-model="onboarding"
          :validation="v$.onboarding"
      />
      <StepThreeProvider
          v-show="stepValue === 3"
          v-model="onboarding"
          :validation="v$.onboarding"
      />
      <base-button
          class="button-action"
          :label="buttonName"
          type="primary"
          @click="handleNextStep"
      />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { OnboardingProvider } from "@/types/user.ts";

// Validação
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, requiredIf } from '@vuelidate/validators'

// Serviços
import getAddress from '@/services/viaCepApi.ts';

// Componentes
import { BaseButton, StepOneProvider, StepTwoProvider, StepThreeProvider } from '@/components'
import userMock from '@/mock/userMock.ts';

export default defineComponent({
  name: "BarberOnboardingBarber",
  components: {
    BaseButton,
    StepOneProvider,
    StepTwoProvider,
    StepThreeProvider
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      stepValue: 1,
      onboarding: userMock(),
    }
  },
  validations() {
    return {
      onboarding: {
        address: {
          zipCode: { required, minLength: minLength(8) },
          street: { required },
          city: { required },
          area: { required },
          state: { required },
          number: { required }
        },
        workingHours: {
          $each: {
            start_time: { required: requiredIf((item) => item.is_open) },
            end_time: { required: requiredIf((item) => item.is_open) },
          }
        },
        service: {
          service: { required },
          price: { required },
          duration: { required }
        }
      }
    }
  },
  watch: {
    'onboarding.address.zipCode'(newZipCode: string) {
      const zipCodeAsString = String(newZipCode).replace(/\D/g, ''); // Limpa a máscara
      if (zipCodeAsString.length === 8) {
        this.getAddressByZipCode(zipCodeAsString);
      }
    }
  },
  computed: {
    progressClass(): string {
      if (this.stepValue === 2) return 'middle';
      if (this.stepValue === 3) return 'end';
      return 'beginning';
    },
    stepTitle(): string {
      const titles = ["Perfil da Barbearia", "Seus Horários", "Primeiro Serviço"];
      return titles[this.stepValue - 1] || titles[0];
    },
    buttonName(): string {
      if (this.stepValue < 3) return 'Próximo';
      return 'Finalizar e ir para o Dashboard';
    }
  },
  methods: {
    async handleNextStep() {
      let isStepValid = false;

      switch (this.stepValue) {
        case 1:
          isStepValid = await this.v$.onboarding.address.$validate();
          break;
        case 2:
          isStepValid = await this.v$.onboarding.workingHours.$validate();
          break;
        case 3:
          isStepValid = await this.v$.onboarding.service.$validate();
          break;
      }

      if (!isStepValid) {
        console.log(`Validação falhou no Passo ${this.stepValue}!`);
        return;
      }

      if (this.stepValue < 3) {
        this.stepValue++;
        this.v$.$reset();
      } else {
        console.log("Finalizando cadastro!", this.onboarding);
      }
    },
    decraseStep() {
      if (this.stepValue > 1) {
        this.stepValue--;
      }
    },
    async getAddressByZipCode(zipCode: string) {
      try {
        const response = await getAddress(zipCode);
        if (response.data.erro) {
          console.warn('CEP não encontrado.');
          return;
        }
        this.onboarding.address.street = response.data.logradouro;
        this.onboarding.address.area = response.data.bairro;
        this.onboarding.address.city = response.data.localidade;
        this.onboarding.address.state = response.data.uf;
      } catch(error) {
        console.error("Erro ao buscar o endereço:", error);
      }
    }
  }
})
</script>

<style scoped>
.heather-barber-onboarding {
  width: 100%;
  align-items: start;
  row-gap: 8px;
  padding: 48px 24px 0px 24px;
}
.heather-barber-onboarding span {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}
.heather-barber-onboarding h1 {
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  margin-bottom: 24px;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-lg);
}
.percentage-progress {
  background-color: var(--color-accent-primary);
  height: 100%;
  border-radius: var(--radius-lg);
  transition: width 0.5s ease-in-out;
}
.beginning {
  width: 33.33%;
}
.middle {
  width: 66.66%;
}
.end {
  width: 100%;
}

.content-container-onboarding-provider {
  display: flex;
  width: 100%;
  row-gap: 60px;
  padding-bottom: 24px;
}

.return {
  background: none;
  border: none;
  color: var(--color-text-primary);
  margin-bottom: 24px;
  cursor: pointer;
}

.return span {
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

</style>