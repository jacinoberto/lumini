<template>
  <div
      class="base-avatar"
      :class="[`avatar--${size}`, `variant--${variant}`]"
  >
    <img
        v-if="showImage"
        :src="src"
        :alt="name"
        class="avatar-image"
        @error="handleImageError"
    />
    <span v-else class="avatar-initials">
      {{ initials }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'BaseAvatar',

  props: {
    src: {
      type: String ,
      default: null,
      required: false
    },
    name: {
      type: String,
      default: '',
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
    },
    // ALTERAÇÃO: Nova prop 'variant'
    variant: {
      type: String as PropType<'secondary' | 'primary'>,
      default: 'secondary',
      validator: (value: string) => ['secondary', 'primary'].includes(value),
    },
  },

  data() {
    return {
      imageHasError: false,
    };
  },

  computed: {
    showImage(): boolean {
      return !!this.src && !this.imageHasError;
    },
    initials(): string {
      if (!this.name) return '';
      const names = this.name.trim().split(' ');
      const firstName = names[0];
      const lastName = names.length > 1 ? names[names.length - 1] : '';
      const firstInitial = firstName ? firstName[0].toUpperCase() : '';
      const lastInitial = lastName ? lastName[0].toUpperCase() : '';
      return `${firstInitial}${lastInitial}`;
    },
  },

  methods: {
    handleImageError() {
      this.imageHasError = true;
    },
  },
});
</script>

<style scoped>
.base-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-full);
  /* Cor e fonte são aplicadas a todas as variantes */
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  user-select: none;
  vertical-align: middle;
}

/* ALTERAÇÃO: Estilos de variante para o background */
.variant--secondary {
  background-color: var(--color-background-secondary);
}

.variant--primary {
  /* Gradiente linear da esquerda para a direita com as cores fornecidas */
  background: linear-gradient(to right, #059669, #047857);
}

/* Tamanhos customizáveis (sem alteração) */
.avatar--sm { width: 32px; height: 32px; font-size: 12px; }
.avatar--md { width: 48px; height: 48px; font-size: 16px; }
.avatar--lg { width: 64px; height: 64px; font-size: 20px; }

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  line-height: 1;
  text-transform: uppercase;
}
</style>