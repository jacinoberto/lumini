<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "ButtonCard",
  props: {
    icon: String,
    title: String
  }
})
</script>

<template>
<button class="button-card-action center f-column">
  <vue-feather :type="icon" class="color-icon"></vue-feather>
  <span>{{ title }}</span>
</button>
</template>

<style scoped>
  .button-card-action {
    padding: 24px;
    row-gap: 12px;
    cursor: pointer;
    background-color: var(--color-background-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .button-card-action span {
    color: var(--color-text-primary);
    font-weight: var(--font-weight-semibold);
    font-size: 12px;

  }

  .color-icon {
    color: var(--color-accent-primary);
  }
</style>