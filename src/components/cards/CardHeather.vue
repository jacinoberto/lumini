<script lang="ts">
import {defineComponent} from 'vue'
import { BaseCard } from "@/components";

export default defineComponent({
  name: "CardHeader",
  components: {
    BaseCard
  },
  props: {
    title: String,
    description: String
  },

})
</script>

<template>
  <header class="card-heather center f-column">
    <h1>{{ title }}</h1>
    <span>{{ description }}</span>
  </header>
</template>

<style scoped>
  .card-heather {
    width: 100%;
    text-align: center;
    row-gap: 4px;
    padding: 48px 24px 24px 24px;
    border-bottom-left-radius: 28px;
    border-bottom-right-radius: 28px;
    background-color: var(--color-background-secondary);
  }

  .card-heather h1 {
    font-size: 28px;
    font-weight: var(--font-weight-bold);
  }

  .card-heather span {
    font-size: 16px;
    font-weight: var(--font-weight-regular);
  }
</style>