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
import api from '@/services/api'; // Importa nossa instância do Axios

// Componentes
import { BaseButton, StepOneProvider, StepTwoProvider, StepThreeProvider } from '@/components'
import userMock from '@/mock/userMock.ts';
import type { WorkingHour } from '@/types/service';
import {useAuthStore} from "@/stores/authStore.ts";

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
      // ADICIONADO: Estados para feedback da API
      isLoading: false,
      apiErrorMessage: '',
    }
  },
  validations() {
    // ... sua seção de validação (sem alterações)
    return {
      onboarding: {
        description: { required, minLength: minLength(10) },
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
            start_time: { required: requiredIf(function(this: WorkingHour) { return this.is_open; }) },
            end_time: { required: requiredIf(function(this: WorkingHour) { return this.is_open; }) },
          }
        },
        service: {
          service: { required },
          value: { required },
          duration: { required }
        }
      }
    }
  },
  watch: {
    'onboarding.address.zipCode'(newZipCode: string) {
      const zipCodeAsString = String(newZipCode).replace(/\D/g, '');
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
    stepTitle(): string | undefined {
      const titles = ["Perfil da Barbearia", "Seus Horários", "Primeiro Serviço"];
      const title = titles[this.stepValue - 1]; // Isso pode ser 'string | undefined'

      // Verificamos explicitamente se 'title' é uma string válida
      if (title) {
        return title;
      }

      // Se não for, retornamos um valor padrão que COM CERTEZA é uma string
      return titles[0];
    },
    buttonName(): string {
      if (this.stepValue < 3) return 'Próximo';
      return 'Finalizar e ir para o Dashboard';
    }
  },
  methods: {
    async handleNextStep() {
      // O `apiErrorMessage` deve ser limpo a cada tentativa
      this.apiErrorMessage = '';

      let isStepValid = false;
      switch (this.stepValue) {
        case 1:
          isStepValid = await this.v$.onboarding.description.$validate() && await this.v$.onboarding.address.$validate();
          break;
        case 2:
          isStepValid = await this.v$.onboarding.workingHours.$validate();
          break;
        case 3:
          isStepValid = await this.v$.onboarding.service.$validate();
          break;
      }

      if (!isStepValid) {
        this.apiErrorMessage = "Por favor, preencha os campos obrigatórios.";
        return;
      }

      // Se a validação do passo atual passou, continue
      if (this.stepValue < 3) {
        this.stepValue++;
        this.v$.$reset();
      } else {
        // --- LÓGICA DE FINALIZAÇÃO DO ONBOARDING ---
        this.isLoading = true;
        try {
          const barbershopId = localStorage.getItem('barbershopId');
          if (!barbershopId) {
            throw new Error("ID da barbearia não encontrado. Faça o login novamente.");
          }

          // 1. Mapeia os dados do formulário para o formato que a API espera
          const payload = {
            biography: this.onboarding.description,
            profile_image: this.onboarding.profileImage,
            cover_image: this.onboarding.coverImage,
            address: {
              zip_code: String(this.onboarding.address.zipCode).replace(/\D/g, ''), // Envia CEP sem máscara
              street: this.onboarding.address.street,
              number: String(this.onboarding.address.number),
              complement: '', // Adicionar este campo se existir no seu formulário
              area: this.onboarding.address.area,
              city: this.onboarding.address.city,
              state: this.onboarding.address.state,
            },
            business_hours: this.onboarding.workingHours.map(day => ({
              day_of_week: this.getDayOfWeekNumber(day.day_name),
              start_time: day.is_open ? day.start_time : null,
              end_time: day.is_open ? day.end_time : null,
              is_active: day.is_open,
            })),
            services: [ // A API espera um array de serviços
              {
                name: this.onboarding.service.service,
                price: this.onboarding.service.value,
                duration_minutes: this.onboarding.service.duration,
                description: '', // Adicionar este campo se existir no seu formulário
              }
            ]
          };

          // 2. Faz a chamada da API
          const authStore = useAuthStore();
          if (!authStore.isAuthenticated) {
            throw new Error('Usuário não autenticado. Faça login novamente.');
          }

          await api.put(`/barbershops/${authStore.barbershopId}`, payload, {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          });

          // 3. Sucesso! Redireciona para o Dashboard
          this.$router.push({ name: 'Dashboard' }); // Verifique se 'Dashboard' é o nome da sua rota

        } catch (error: any) {
          console.error("Erro ao finalizar o onboarding:", error);
          this.apiErrorMessage = error.message || "Não foi possível salvar os dados. Tente novamente.";
        } finally {
          this.isLoading = false;
        }
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
    },
    // Função auxiliar para mapear o nome do dia para o número esperado pela API
    getDayOfWeekNumber(dayName: string): number {
      const days = {
        'Domingo': 0, 'Segunda-feira': 1, 'Terça-feira': 2,
        'Quarta-feira': 3, 'Quinta-feira': 4, 'Sexta-feira': 5, 'Sábado': 6
      };
      return days[dayName as keyof typeof days] ?? 0;
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