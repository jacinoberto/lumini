<script lang="ts">
import { defineComponent } from 'vue';
import { TheHeader, ButtonCard, PrimaryScheduleCard, TheButtonNav } from "@/components"; // Corrigido para TheButtonNav
import type { kpiType } from "@/types/dashboard.ts";
import type { Appointment } from "@/types/service.ts";

export default defineComponent({
  name: "DashboardProviderPage",
  components: {
    TheHeader,
    ButtonCard,
    PrimaryScheduleCard,
    TheButtonNav // Corrigido para TheButtonNav
  },
  data() {
    return {
      kpis: [
        { info: 'appointments', title: 'Hoje', footer: 'agendamentos', value: '12', size: 'sm' },
        { info: 'appointments', title: 'Receita', footer: 'este mês', value: '8.4k', size: 'sm' },
        { info: 'appointments', title: 'Avaliação', footer: 'média', value: '4.9', size: 'sm' }
      ] as kpiType[],
      options: [
        { icon: 'calendar', info: 'Agendamentos', routeName: 'Appointments' },
        { icon: 'clock', info: 'Meus Horários', routeName: 'WorkingHours' },
        { icon: 'scissors', info: 'Serviços', routeName: 'Services' },
        { icon: 'users', info: 'Equipe', routeName: 'ManageTeam' },
      ],
      appointments: [
        { id: '1', profile: null, name: 'Jonas Nascimento', service: 'Corte + Barba', hour: '14:00' },
        { id: '2', profile: null, name: 'Carlos Andrade', service: 'Mullet', hour: '15:30' },
        { id: '3', profile: null, name: 'Maria Clara', service: 'Corte Feminino', hour: '17:00' },
      ] as Appointment[],
    }
  },
  methods: {
    navigateToSection(routeName: string | undefined) {
      if (routeName) {
        this.$router.push({ name: routeName });
      } else {
        console.warn('Nome da rota não definido para esta opção.');
      }
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
            @click="navigateToSection(option.routeName)"
        />
      </section>

      <section class="section-appointments f-column">
        <div class="title">
          <h2>Hoje</h2>
          <RouterLink :to="{ name: 'Appointments' }" class="link">
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
/* SEUS ESTILOS ORIGINAIS E CORRETOS PARA O DASHBOARD */
.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-background-primary);
}

.main-container-default {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 24px;
}

.header-dashboard-provider-page,
.button-nav,
.section-options,
.title {
  flex-shrink: 0;
}

.section-options {
  width: 100%;
  padding-top: 96px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.section-appointments {
  width: 100%;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
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

.appointments-list {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 24px;
}
</style>