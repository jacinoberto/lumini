<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "BaseButton",
  props: {
    label: String,
    type: String,
    function: String
  },
  methods: {
    thisFunction() {
      if (this.function === 'login') {
        this.$emit('continue-function', 'login');
      } else if (this.function === 'register') {
        this.$emit('continue-function', 'register');
      }
    }
  }
})
</script>

<template>
  <button
      :class="['base-button', type]"
      @click="thisFunction"
  >
    {{ label }}
  </button>
</template>

<style scoped>
  .base-button {
    width: 100%;
    height: 66px;
    font-size: var(--font-size-button);
    font-weight: var(--font-weight-bold);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border-radius: var(--radius-lg);
    border: none;
    cursor: pointer;
  }

  .primary {
    background-color: var(--color-accent-primary);
    color: #FFF;
  }

  .secondary {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--color-text-secondary);
    border: solid 2px var(--color-border);
  }
</style>