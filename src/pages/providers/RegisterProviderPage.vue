<script lang="ts">
import {defineComponent} from 'vue'

import { CardHeather, BaseInput, BaseTextarea } from "@/components";

export default defineComponent({
  name: "RegisterProvider",
  components: {
    BaseInput,
    CardHeather
  }
})
</script>

<template>
  <card-heather
      :title="'Cadastre sua Barbearia'"
      :description="'Preencha os dados abaixo para criar seu perfil profissional'"
  />

  <main class="container-register-provider">
    <form
      class="register-provider-form"
      @submit.prevent=""
    >
      <div class="input-block">
        <div class="heather-block">
          <span>Informações Básicas</span>
        </div>

        <div class="inputs">
          <base-input
            :label="'Nome da Barbearia'"
            :placeholder="'Ex: Classic Barber'"
            :type="'text'"
          />
        </div>
      </div>
    </form>
  </main>
</template>

<style scoped>

</style>