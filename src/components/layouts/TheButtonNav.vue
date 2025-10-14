<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TheBottomNav',
  // Nenhuma lógica complexa é necessária, o vue-router gerencia o estado ativo.
});
</script>

<template>
  <nav class="bottom-nav">
    <div class="bottom-nav-inner">
      <router-link to="/pr/app/dashboard" class="nav-item">
        <vue-feather type="home"></vue-feather>
        <span>Início</span>
      </router-link>

      <router-link to="/pr/app/appointments" class="nav-item">
        <vue-feather type="calendar"></vue-feather>
        <span>Agendas</span>
      </router-link>

      <router-link to="/pr/app/clients" class="nav-item">
        <vue-feather type="heart"></vue-feather>
        <span>Clientes</span>
      </router-link>

      <router-link to="/pr/app/profile" class="nav-item">
        <vue-feather type="user"></vue-feather>
        <span>Perfil</span>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  /* --- A MÁGICA DO POSICIONAMENTO E DO EFEITO --- */

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Garante que a nav fique na frente de outros conteúdos */

  /* 1. O fundo PRECISA ser semi-transparente para o blur ser visível */
  /* Usando a cor de fundo secundária do nosso DS com ~80% de opacidade */
  background-color: rgba(31, 41, 55, 0.8);

  /* 2. A propriedade que aplica o efeito de "vidro fosco" */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Para compatibilidade com Safari */

  /* Linha sutil no topo para acabamento */
  border-top: 1px solid var(--color-border);
}

.bottom-nav-inner {
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0; /* 12px de padding vertical */
  height: 80px; /* Altura fixa para a barra */
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem; /* 4px de espaço entre ícone e texto */

  /* Estilo padrão para o item inativo */
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.75rem; /* 12px */
  font-weight: var(--font-weight-semibold);
  transition: color 0.2s ease-in-out;
}

.nav-item:hover {
  color: var(--color-text-primary);
}

/* --- ESTILO DO ITEM ATIVO --- */

/* O vue-router adiciona esta classe automaticamente ao link da rota atual */
.nav-item.router-link-exact-active {
  color: var(--color-accent-primary); /* Verde */
}
</style>