<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "LightLogo"
})
</script>

<template>
  <div class="light-logo center f-column center__by__margin">
    <h2 class="brand">LUMINI</h2>
    <p
      class="brand-description"
    >
      SEU TEMPO, SEU ESTILO, SEU BEM-ESTAR
    </p>
  </div>
</template>

<style scoped>
  .light-logo {
    width: 120px;
    height: 120px;
  }

  .brand, .brand-description {
    text-align: center;
  }

  .brand {
    font-size: 48px;
    font-family: var(--font-family-secondary);
    font-weight: var(--font-weight-semibold);
  }

  .brand-description {
    font-family: var(--font-family-tertiary);
    font-size: 10px;
  }
</style>