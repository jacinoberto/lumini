<template>
  <label class="base-toggle" :class="{ 'is-disabled': disabled }">
    <input
        v-model="value"
        type="checkbox"
        class="sr-only"
        :disabled="disabled"
        role="switch"
    />

    <span class="toggle-wrapper">
      <span class="toggle-thumb" />
    </span>

    <span v-if="label" class="toggle-label">{{ label }}</span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseToggle',

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

  // Declaração explícita do evento que o componente emite
  emits: ['update:modelValue'],

  computed: {
    // Esta computed property é a forma padrão de implementar v-model na Options API.
    value: {
      // O 'get' retorna o valor atual da prop
      get(): boolean {
        return this.modelValue;
      },
      // O 'set' é chamado quando o input interno muda, e emite o evento para o pai
      set(newValue: boolean) {
        this.$emit('update:modelValue', newValue);
      },
    },
  },
});
</script>

<style scoped>
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
.base-toggle { display: inline-flex; align-items: center; gap: var(--spacing-sm); cursor: pointer; user-select: none; }
.base-toggle.is-disabled { cursor: not-allowed; opacity: 0.6; }
.toggle-wrapper { position: relative; display: inline-block; width: 50px; height: 28px; background-color: var(--color-background-secondary); border-radius: var(--radius-lg); transition: background-color 0.2s ease-in-out; }
.toggle-thumb { position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; background-color: var(--color-text-primary); border-radius: var(--radius-full); transition: transform 0.2s ease-in-out; }
.sr-only:checked + .toggle-wrapper { background-color: var(--color-accent-primary); }
.sr-only:checked + .toggle-wrapper .toggle-thumb { transform: translateX(22px); }
.sr-only:focus-visible + .toggle-wrapper { outline: 2px solid var(--color-info); outline-offset: 2px; }
.toggle-label { color: var(--color-text-primary); font-size: var(--font-size-input); }
</style>