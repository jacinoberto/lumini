<template>
  <label class="base-checkbox" :class="{ 'is-disabled': disabled }">
    <input
        v-model="isChecked"
        type="checkbox"
        class="sr-only"
        :disabled="disabled"
    />

    <span class="checkbox-visual">
      <svg
          class="check-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>

    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseCheckbox',

  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  computed: {
    // Propriedade computada para gerenciar o v-model
    isChecked: {
      get(): boolean {
        return this.modelValue;
      },
      set(newValue: boolean) {
        this.$emit('update:modelValue', newValue);
      },
    },
  },
});
</script>

<style scoped>
/* Classe para esconder elementos visualmente, mas mantê-los acessíveis */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.base-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm); /* Espaço entre a caixa e o label */
  cursor: pointer;
  user-select: none;
}

.base-checkbox.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: transparent;
  border: 2px solid var(--color-border);
  border-radius: 6px; /* Um raio sutil, não definido no DS, mas apropriado */
  transition: all 0.2s ease-in-out;
}

.check-icon {
  width: 14px;
  height: 14px;
  color: var(--color-text-primary);
  /* O ícone começa invisível e sem tamanho */
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s ease-in-out;
}

/* Quando o input escondido está marcado... */
.sr-only:checked + .checkbox-visual {
  background-color: var(--color-accent-primary);
  border-color: var(--color-accent-primary);
}

/* ...o ícone de check se torna visível */
.sr-only:checked + .checkbox-visual .check-icon {
  opacity: 1;
  transform: scale(1);
}

/* Estilo de foco para acessibilidade via teclado */
.sr-only:focus-visible + .checkbox-visual {
  outline: 2px solid var(--color-info);
  outline-offset: 2px;
}

.checkbox-label {
  color: var(--color-text-primary);
  font-size: var(--font-size-input);
}
</style>