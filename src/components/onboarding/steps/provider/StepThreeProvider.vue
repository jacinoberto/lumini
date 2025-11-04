<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import type { OnboardingProvider } from '@/types/user';
import BaseInput from '@/components/base/BaseInput.vue';

// O tipo Vuelidate é complexo, então usamos 'any' para simplificar a prop
type ValidationProp = any;

export default defineComponent({
  name: 'StepThreeProvider',
  components: {
    BaseInput,
  },
  props: {
    // Prop para o v-model: recebe o objeto OnboardingProvider completo
    modelValue: {
      type: Object as PropType<OnboardingProvider>,
      required: true,
    },
    // Prop para receber o estado de validação do Vuelidate do pai
    validation: {
      type: Object as PropType<ValidationProp>,
      required: true,
    },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    // Computed property que gerencia a comunicação via v-model com o pai
    const formData = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value);
      },
    });

    return {
      formData,
    };
  }
});
</script>

<template>
  <main class="form-content">
    <div class="input-group">
      <BaseInput
          label="Nome do Serviço"
          placeholder="Ex: Corte Masculino"
          type="text"
          v-model="formData.service.service"
          :error="validation.service.service.$error"
          :errorMessage="validation.service.service.$errors[0]?.$message"
      />
    </div>

    <div class="input-group">
      <BaseInput
          label="Preço (R$)"
          placeholder="40,00"
          type="number"
          v-model="formData.service.value"
          :error="validation.service.value.$error"
          :errorMessage="validation.service.value.$errors[0]?.$message"
      />
    </div>

    <div class="input-group">
      <label for="service-duration">Duração</label>
      <select id="service-duration" class="form-input" v-model="formData.service.duration">
        <option :value="15">15 minutos</option>
        <option :value="30">30 minutos</option>
        <option :value="45">45 minutos</option>
        <option :value="60">60 minutos</option>
      </select>
    </div>
  </main>
</template>

<style scoped>
/* Estilos extraídos do seu passo-3.html */
.form-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: var(--color-text-secondary);
}

/* Estilo para o <select> se parecer com nossos BaseInputs */
.form-input {
  width: 100%;
  height: 59px; /* Mesma altura do BaseInput */
  padding: 1rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: 'Sora', sans-serif;
  font-size: var(--font-size-button);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}
</style>