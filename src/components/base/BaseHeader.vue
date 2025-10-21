<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "BaseHeader",
  props: {
    title: {
      type: String,
      required: true
    }
  }
})
</script>

<template>
<div class="base-header f-column">
  <button class="btn-action">
    <vue-feather class="icon" type="arrow-left" size="20"/>
    <span>Voltar</span>
  </button>
  <span class="title">{{ title }}</span>
</div>
</template>

<style scoped>
  .base-header {
    width: 100%;
    display: flex;
    align-items: start;
    padding: 24px;
    background-color: var(--color-background-secondary);
    border-bottom-right-radius: var(--radius-xl);
    border-bottom-left-radius: var(--radius-xl);
  }

  .icon {
    color: #FFF;
  }

  .title {
    font-size: 28px;
    font-weight: var(--font-weight-bold);
  }

  .btn-action {
    border: none;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    cursor: pointer;
    column-gap: 4px;
    justify-content: center;
    background-color: transparent;
    color: var(--color-text-secondary);
  }

  .btn-action span {
    font-size: 18px;
  }
</style>