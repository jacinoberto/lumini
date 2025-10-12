<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: "BaseInput",
  props: {
    // 1. A prop DEVE se chamar "modelValue"
    modelValue: String as PropType<string>,
    label: String,
    placeholder: String,
    type: String
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
    <span>{{ label }}</span>
    <input v-model="value" :type="type" :placeholder="placeholder" autocomplete="off" />
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
</style>