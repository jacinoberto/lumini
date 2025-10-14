<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ClientHeader from './ClientHeader.vue';
import BarberHeader from './BarberHeader.vue';

import { BaseCard } from "@/components";

type UserRole = 'client' | 'barber';

import type { kpiType } from "@/types/dashboard.ts";

export default defineComponent({
  name: 'TheHeader',
  components: { ClientHeader, BarberHeader, BaseCard },
  props: {
    role: {
      type: String as PropType<UserRole>,
      required: true,
    },
    kpi: {
      type: Array as PropType<kpiType[]>
    },
    // Dados do usuário/loja que serão passados para os filhos
    userData: {
      type: Object,
      default: () => ({}),
    },
  },
});
</script>

<template>
  <div class="the-header">
    <ClientHeader
        v-if="role === 'client'"
        :user-name="userData.name"
    />
    <BarberHeader
        v-else-if="role === 'barber'"
        :shop-name="userData.shopName"
    />

    <div
        class="kpi-datas"
        v-if="role === 'barber'"
    >

      <base-card
          v-for="(data, index) in kpi"
          :key="index"
          :size="data.size"
          :width="'full'"
          class="kpi-data"
      >
        <p class="info-kpi">{{data.title}}</p>
        <p class="value-kpi">{{data.value}}</p>
        <p class="info-kpi">{{data.footer}}</p>
      </base-card>
    </div>
  </div>
</template>

<style scoped>
  .the-header {
    position: relative;
  }

  .kpi-datas {
    display: flex;
    width: 100%;
    justify-content: center;
    padding: 0 24px;
    position: absolute;
    top: 86px;
    column-gap: 16px;
  }

  .kpi-data {
    display: inline-block;
    text-align: center;
  }

  .info-kpi {
    font-size: 12px;
    font-weight: lighter;
    color: var(--color-text-secondary);
  }

  .value-kpi {
    font-size: 24px;
    font-weight: var(--font-weight-bold);
  }
</style>