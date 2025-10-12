<template>
  <BaseCard
    :size="'lg'"
    :width="'auto'"
  >
    <div class="user-profile-header">
      <BaseAvatar
          src="https://example.com/jonas.jpg"
          name="Jonas Silva"
          size="lg"
          variant="primary"
      />
      <div class="user-info">
        <h3 class="user-name">Jonas Silva</h3>
        <p class="user-email">jonas.silva@email.com</p>
      </div>
    </div>

    <hr class="divider" />

    <div class="settings-section">
      <h4 class="section-title">Preferências</h4>
      <div class="settings-options">
        <BaseToggle v-model="settings.darkMode" label="Modo Escuro Ativado" />
        <BaseToggle v-model="settings.notifications" label="Receber Notificações" />
        <BaseCheckbox v-model="settings.saveHistory" label="Salvar histórico de navegação" />
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Importando todos os componentes base que vamos usar
import BaseCard from "@/components/base/BaseCard.vue";
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseToggle from '@/components/base/BaseToggle.vue';
import BaseCheckbox from '@/components/base/BaseCheckbox.vue';

export default defineComponent({
  name: 'UserProfileCard',

  // Registrando os componentes importados para que o template possa usá-los
  components: {
    BaseCard,
    BaseAvatar,
    BaseToggle,
    BaseCheckbox,
  },

  // O estado local para este exemplo de componente
  data() {
    return {
      settings: {
        darkMode: true,
        notifications: true,
        saveHistory: false,
      },
    };
  },
});
</script>

<style scoped>
.user-profile-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.user-email {
  font-size: var(--font-size-input);
  color: var(--color-text-secondary);
  margin: 0;
}

.divider {
  border: none;
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-lg) 0; /* Espaçamento vertical grande */
}

.section-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
</style>