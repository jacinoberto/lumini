<template>
  <Transition name="slide-fade">
    <div
        v-if="show"
        class="base-notification"
        :class="`notification--${type}`"
        role="alert"
    >
      <div class="notification-icon">
        <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <svg v-if="type === 'danger'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <svg v-if="type === 'info'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
      </div>

      <div class="notification-content">
        <strong class="notification-title">{{ title }}</strong>
        <p v-if="message" class="notification-message">{{ message }}</p>
      </div>

      <button
          v-if="closable"
          class="notification-close"
          aria-label="Fechar notificação"
          @click="close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'BaseNotification',

  props: {
    // Prop para v-model:show
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<'success' | 'danger' | 'info'>,
      default: 'info',
      validator: (value: string) => ['success', 'danger', 'info'].includes(value),
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    closable: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['update:show'],

  methods: {
    close() {
      this.$emit('update:show', false);
    },
  },
});
</script>

<style scoped>
.base-notification {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 380px;
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  z-index: 1000;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
}

/* Variantes de cor */
.notification--info {
  background-color: var(--color-info);
}
.notification--success {
  background-color: var(--color-success);
}
.notification--danger {
  background-color: var(--color-danger);
}

.notification-icon svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 2px;
  fill: none;
}

.notification-content {
  flex-grow: 1;
}

.notification-title {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body);
}

.notification-message {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-input);
  opacity: 0.9;
}

.notification-close {
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 0;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.notification-close:hover {
  opacity: 1;
}

.notification-close svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2px;
}

/* Animação com Transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>