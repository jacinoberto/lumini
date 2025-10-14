<script lang="ts">
import {defineComponent} from 'vue'

import { TheHeader, ButtonCard, PrimaryScheduleCard, TheButtonNav } from "@/components";

import type { kpiType } from "@/types/dashboard.ts";
import type { Appointment } from "@/types/service.ts";

export default defineComponent({
  name: "DashboardProviderPage",
  components: {
    TheHeader,
    ButtonCard,
    PrimaryScheduleCard,
    TheButtonNav
  },
  data() {
    return {
      kpis: [
        {
          info: 'appointments',
          title: 'Hoje',
          footer: 'agendamentos',
          value: '12',
          size: 'sm'
        },
        {
          info: 'appointments',
          title: 'Receita',
          footer: 'este mês',
          value: '8.4k',
          size: 'sm'
        },
        {
          info: 'appointments',
          title: 'Avaliação',
          footer: 'média',
          value: '4.9',
          size: 'sm'
        }
      ] as kpiType[],
      options: [
        {
          icon: 'calendar',
          info: 'Agendamentos'
        },
        {
          icon: 'clock',
          info: 'Meus Horários'
        },
        {
          icon: 'scissors',
          info: 'Serviços'
        },
        {
          icon: 'user',
          info: 'Barbeiros'
        },
      ],
      appointments: [
        {
          id: '1',
          profile: null,
          name: 'Jonas Nascimento',
          service: 'Corte + Barba',
          hour: '14:00',
        },
        {
          id: '2',
          profile: null,
          name: 'Carlos Andrade',
          service: 'Mullet',
          hour: '15:30',
        },
        {
          id: '2',
          profile: null,
          name: 'Maria Clara',
          service: 'Corte Feminino',
          hour: '17:00',
        },
      ] as Appointment[],
    }
  }
})
</script>

<template>
  <div class="dashboard-layout">
    <header class="header-dashboard-provider-page">
      <the-header role="barber" :kpi="kpis" />
    </header>

    <main class="main-container-default">
      <section class="section-options center">
        <button-card
            v-for="(option, index) in options"
            :key="index"
            :icon="option.icon"
            :title="option.info"
        />
      </section>

      <section class="section-appointments f-column">
        <div class="title">
          <h2>Hoje</h2>
          <RouterLink to="" class="link">
            Ver todos
          </RouterLink>
        </div>

        <div class="appointments-list">
          <primary-schedule-card
              v-for="(appointment, index) in appointments"
              :key="index"
              :appointment="appointment" />
        </div>
      </section>
    </main>

    <div class="button-nav">
      <the-button-nav />
    </div>
  </div>
</template>

<style scoped>
/* 1. O Contêiner principal que ocupa a tela inteira */
.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Ocupa 100% da altura da tela */
  overflow: hidden; /* Impede o scroll na página inteira */
  background-color: var(--color-background-primary);
}

/* 2. O conteúdo principal que cresce para preencher o espaço */
.main-container-default {
  flex-grow: 1; /* Faz o 'main' ocupar todo o espaço entre o header e a nav */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Garante que o 'main' não crie scrollbars */
  padding: 0 24px;
}

/* 3. As seções que NÃO devem crescer */
.header-dashboard-provider-page,
.button-nav,
.section-options,
.title {
  flex-shrink: 0; /* Impede que estes elementos encolham */
}

/* --- AJUSTES NOS SEUS ESTILOS --- */

.section-options {
  width: 100%;
  /* REMOVIDO: O margin-top é problemático com flexbox. O layout agora é controlado pelo flex. */
  padding-top: 96px; /* Use padding para o espaçamento */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.section-appointments {
  width: 100%;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Faz esta seção crescer para preencher o 'main' */
  min-height: 0; /* Correção de bug do flexbox para evitar overflow */
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
}

.title h2 {
  font-size: 24px;
  font-weight: var(--font-weight-bold);
}

.link {
  text-decoration: none;
  color: var(--color-accent-primary);
  font-weight: var(--font-weight-semibold);
  font-size: 14px;
}

/* 4. A ÁREA DE SCROLL */
.appointments-list {
  overflow-y: auto; /* A mágica acontece aqui: scroll vertical apenas nesta div */
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 24px; /* Espaço no final da lista */
}
</style>