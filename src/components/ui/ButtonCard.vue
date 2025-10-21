<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: "ButtonCard",
  props: {
    icon: String,
    title: String
  },
  // 1. Declare o evento 'click' que o componente emitirá
  emits: ['click'],
  methods: {
    // 2. Crie um método que será chamado pelo clique do botão
    handleClick() {
      // Este método simplesmente emite o evento 'click' para o componente pai
      this.$emit('click');
    }
  }
})
</script>

<template>
  <button class="button-card-action center f-column" @click="handleClick">
    <vue-feather :type="icon" class="color-icon"></vue-feather>
    <span>{{ title }}</span>
  </button>
</template>

<style scoped>
/* Seus estilos não mudam */
.button-card-action {
  padding: 24px;
  row-gap: 12px;
  cursor: pointer;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  width: 100%; /* Garante que o botão ocupe o espaço do grid */
  color: var(--color-text-primary); /* Define a cor padrão do texto */
}

.button-card-action span {
  font-weight: var(--font-weight-semibold);
  font-size: 12px;
}

.color-icon {
  color: var(--color-accent-primary);
}
</style>