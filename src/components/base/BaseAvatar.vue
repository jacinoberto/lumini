<template>
  <div
      class="base-avatar"
      :class="[`avatar--${size}`, `variant--${variant}`]"
  >
    <img
        v-if="showImage"
        :src="imageSrc"
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
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'BaseAvatar',
  props: {
    src: {
      type: String as PropType<string | null>,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    initials: {
      type: String,
      default: 'AB',
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md',
    },
    variant: {
      type: String as PropType<'secondary' | 'primary'>,
      default: 'secondary',
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
    // MUDANÇA: Nova computed property para "traduzir" o tipo
    imageSrc(): string | undefined {
      // Se a prop 'src' for null, retorna undefined. Senão, retorna a própria string.
      return this.src ?? undefined;
    }
  },

  methods: {
    handleImageError() {
      this.imageHasError = true;
    },
  },
});
</script>

<style scoped>
/* Seus estilos não mudam */
.base-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  user-select: none;
  vertical-align: middle;
}
.variant--secondary {
  background-color: var(--color-border);
}
.variant--primary {
  background: linear-gradient(to right, #059669, #047857);
}
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