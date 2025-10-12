<template>
  <div class="base-textarea-wrapper">
    <label v-if="label" :for="textareaId" class="textarea-label">
      {{ label }}
    </label>
    <textarea
        :id="textareaId"
        v-model="content"
        class="textarea-input"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
    ></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

let uid = 0;

export default defineComponent({
  name: 'BaseTextarea',
  props: {
    modelValue: { type: String, required: true },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    rows: { type: Number, default: 4 },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      uid: uid++,
    };
  },
  computed: {
    textareaId(): string {
      return `base-textarea-${this.uid}`;
    },
    content: {
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

<style scoped>
.base-textarea-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.textarea-label {
  color: var(--color-text-primary);
  font-size: var(--font-size-input);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
}

.textarea-input {
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);

  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-input);

  width: 100%;
  /* ALTERAÇÃO: Impede qualquer redimensionamento pelo usuário */
  resize: none;
  transition: border-color 0.2s ease-in-out;
}

.textarea-input::placeholder {
  color: var(--color-text-secondary);
}

.textarea-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}

.textarea-input:disabled {
  background-color: var(--color-border);
  cursor: not-allowed;
  opacity: 0.7;
}
</style>