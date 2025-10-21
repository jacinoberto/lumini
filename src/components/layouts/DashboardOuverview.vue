<template>
  <header class="header-dashboard-overview">
    <the-header role="barber" :kpi="kpis" />
  </header>

  <div class="overview-content">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// Componentes necessários para esta página
import { TheHeader, ButtonCard, PrimaryScheduleCard } from "@/components";
import type { kpiType } from "@/types/dashboard.ts";
import type { Appointment } from "@/types/service.ts"; // Ajuste o caminho se necessário

export default defineComponent({
  name: "DashboardOverview",
  components: { TheHeader, ButtonCard, PrimaryScheduleCard },
  data() {
    return {
      // KPIs agora pertencem a esta página
      kpis: [
        { info: 'appointments', title: 'Hoje', footer: 'agendamentos', value: '12', size: 'sm' },
        { info: 'appointments', title: 'Receita', footer: 'este mês', value: '8.4k', size: 'sm' },
        { info: 'appointments', title: 'Avaliação', footer: 'média', value: '4.9', size: 'sm' }
      ] as kpiType[],
      // Opções de navegação
      options: [
        { icon: 'calendar', info: 'Agendamentos', routeName: 'Appointments' },
        { icon: 'clock', info: 'Meus Horários', routeName: 'WorkingHours' },
        { icon: 'scissors', info: 'Serviços', routeName: 'Services' },
        { icon: 'users', info: 'Equipe', routeName: 'ManageTeam' },
      ],
      // Agendamentos (dados mocados ou da API)
      appointments: [
        { id: '1', profile: null, name: 'Jonas Nascimento', service: 'Corte + Barba', hour: '14:00' },
        { id: '2', profile: null, name: 'Carlos Andrade', service: 'Mullet', hour: '15:30' },
        { id: '3', profile: null, name: 'Maria Clara', service: 'Corte Feminino', hour: '17:00' },
      ] as Appointment[],
    }
  },
  methods: {
    // Método para navegar para a seção clicada
    navigateToSection(routeName: string | undefined) {
      if (routeName) {
        this.$router.push({ name: routeName });
      } else {
        console.warn('Nome da rota não definido para esta opção.');
      }
    }
    // Lógica para buscar appointments da API (ex: no hook 'mounted') viria aqui
  }
});
</script>

<style scoped>
/* Adicione padding ao container do conteúdo para compensar a ausência no layout pai */
.overview-content {
  padding: 0 24px;
}

.header-dashboard-overview {
  /* O componente TheHeader já deve ter seu próprio estilo */
  /* Adicione margens se necessário */
  margin-bottom: -80px; /* Exemplo: Puxa o conteúdo para cima, sobrepondo parte do header verde */
  position: relative; /* Necessário para z-index funcionar se precisar */
  z-index: 10; /* Garante que o header fique acima do conteúdo que sobe */
}

/* Estilos originais das seções, ajustando margens/paddings conforme necessário */
.section-options {
  width: 100%;
  padding-top: 110px; /* Espaço para compensar o header verde */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  position: relative; /* Para garantir que fique acima de elementos com z-index menor */
  z-index: 1; /* Abaixo do header */
}

.section-appointments {
  width: 100%;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 24px; /* Espaço no final da lista */
}
</style>