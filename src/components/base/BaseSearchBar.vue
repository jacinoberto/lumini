<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'BaseSearchBar',
  props: {
    modelValue: {
      type: String as PropType<string>,
      default: '',
    },
    placeholder: {
      type: String as PropType<string>,
      default: 'Buscar...',
    },
  },
  emits: ['update:modelValue'],
  computed: {
    query: {
      get(): string {
        return this.modelValue;
      },
      set(newValue: string) {
        this.$emit('update:modelValue', newValue);
      },
    },
  },
});
</script>

<template>
  <div class="search-bar-container">
    <vue-feather type="search" class="search-icon" size="20"></vue-feather>
    <input
        type="text"
        :placeholder="placeholder"
        v-model="query"
    />
  </div>
</template>

<style scoped>
.search-bar-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem; /* 16px */
  color: var(--color-text-secondary);
  pointer-events: none; /* Permite clicar através do ícone */
}

.search-bar-container input {
  width: 100%;
  height: 52px;
  padding: 1rem 1rem 1rem 3rem; /* Espaço para o ícone à esquerda */
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-bar-container input::placeholder {
  color: var(--color-text-secondary);
}

.search-bar-container input:focus {
  border-color: var(--color-accent-primary);
}
</style>