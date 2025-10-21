<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';

// Define o formato do objeto que o card espera
type TeamMember = {
  id: number | string;
  name: string;
  avatar: string | null; // URL ou Base64
  specialties: string; // Ou string[] se for uma lista
  rating: number;
  cutsCount: number;
};

export default defineComponent({
  name: 'TeamMemberCard',
  components: { BaseAvatar },
  props: {
    member: {
      type: Object as PropType<TeamMember>,
      required: true,
    },
  },
  emits: ['options-click'],
  methods: {
    formatRating(rating: number): string {
      return rating.toFixed(1).replace('.', ','); // Formata para "4,9"
    },
    emitOptionsClick() {
      this.$emit('options-click', this.member.id);
    },
  },
});
</script>

<template>
  <div class="team-member-card">
    <BaseAvatar :src="member.avatar" :name="member.name" size="lg" />

    <div class="member-details">
      <h3 class="member-name">{{ member.name }}</h3>
      <p class="member-specialties">{{ member.specialties }}</p>
      <div class="member-stats">
        <div class="stat-item">
          <vue-feather type="star" size="14" fill="currentColor" class="star-icon"></vue-feather>
          <span>{{ formatRating(member.rating) }}</span>
        </div>
        <div class="stat-item">
          <vue-feather type="scissors" size="14"></vue-feather>
          <span>{{ member.cutsCount }} cortes</span>
        </div>
      </div>
    </div>

    <button class="options-btn" @click="emitOptionsClick">
      <vue-feather type="more-vertical" size="20"></vue-feather>
    </button>
  </div>
</template>

<style scoped>
.team-member-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md); /* 16px */
  width: 100%;
  padding: 1rem; /* 16px */
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); /* 24px */
}

.member-details {
  flex-grow: 1; /* Ocupa o espaço restante */
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* 4px */
}

.member-name {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  font-size: 1rem; /* 16px */
}

.member-specialties {
  color: var(--color-text-secondary);
  font-size: 0.875rem; /* 14px */
}

.member-stats {
  display: flex;
  gap: 1rem; /* 16px */
  margin-top: 0.5rem; /* 8px */
  color: var(--color-text-secondary);
  font-size: 0.875rem; /* 14px */
  font-weight: var(--font-weight-semibold);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem; /* 4px */
}

.stat-item .vue-feather {
  /* Ícones herdam a cor do texto por padrão */
}

.star-icon {
  color: var(--color-accent-secondary); /* Laranja para a estrela */
}

.options-btn {
  /* Mesmo estilo do botão de opções do ServiceCard */
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-text-secondary);
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s, color 0.2s;
  flex-shrink: 0; /* Impede que o botão encolha */
}

.options-btn:hover {
  background-color: var(--color-border);
  color: var(--color-text-primary);
}
</style>