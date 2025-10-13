<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: "BaseInput",
  props: {
    modelValue: String as PropType<string>,
    label: String,
    placeholder: String,
    type: String,
    error: Boolean,
    errorMessage: String,
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get(): string | number | undefined {
        // 2. O 'get' deve ler da prop correta: "modelValue"
        return this.modelValue;
      },
      set(newValue: string | number): void {
        this.$emit('update:modelValue', newValue);
      }
    }
  }
})
</script>

<template>
  <div class="base-input">
    <span v-if="label">{{ label }}</span>
    <input
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :class="{ 'has-error': error }" />
    <p v-if="error && errorMessage" class="error-message">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 8px;
}

.base-input span {
  color: var(--color-text-secondary);
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-semibold);
}

.base-input input {
  display: flex;
  height: 59px;
  align-items: center;
  padding-left: 12px;
  border-radius: var(--radius-md);
  outline: none;
  font-size: var(--font-size-button);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  background-color: var(--color-background-secondary);
}

.base-input input::placeholder {
  color: var(--color-text-secondary);
}

/* Estilo para o input quando há um erro */
.base-input input.has-error {
  border-color: var(--color-danger); /* Usa a cor de perigo do nosso Design System */
}

/* Garante que a borda continue vermelha mesmo com foco */
.base-input input.has-error:focus {
  border-color: var(--color-danger);
  outline: none; /* Remove o outline padrão para focar na cor da borda */
}

/* Estilo para a mensagem de erro */
.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-caption);
  margin-top: -4px; /* Pequeno ajuste para aproximar do campo */
}
</style>