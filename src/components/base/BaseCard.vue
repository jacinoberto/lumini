<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "CardBase",
  props: {
    //Para definir o espaçamento do padding co card
    size: String,
    width: {
      type: String,
      default: 'auto',
      required: true
    }
  },

})
</script>

<template>
  <div :class="[ 'base-card', size, width ]">
    <slot />
  </div>
</template>

<style scoped>
  .full {
    display: flex;
  }

  .auto {
    display: inline-block;
  }

  .base-card {
    flex-direction: column;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    background-color: var(--color-background-secondary);
  }

  .sm {
    padding: var(--spacing-md);
  }

  .lg {
    padding: var(--spacing-lg);
  }
</style>