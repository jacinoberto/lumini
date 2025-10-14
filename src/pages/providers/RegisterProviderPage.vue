<script lang="ts">
import {defineComponent} from 'vue'
//Components
import {CardHeather, BaseInput, BaseTextarea, BaseFileInput, BaseButton} from "@/components";
//Types
import type { RegisterProvider } from "@/types/user.ts";

import getAddress from '@/services/viaCepApi.ts';

export default defineComponent({
  name: "RegisterProvider",
  components: {
    BaseButton,
    BaseInput,
    CardHeather,
    BaseTextarea,
    BaseFileInput
  },
  data() {
    return {
      provider: {
        barberName: '',
        companyCode: '',
        cover: '',
        profile: '',
        phone: '',
        owner: {
          name: '',
          socialSecurity: '',
          email: '',
          phone: '',
          password: '',
        },
        address: {
          zipCode: '',
          street: '',
          area: '',
          city: '',
          state: '',
          number: null,
        }
      } as RegisterProvider,
      address: ''
    }
  },
  mounted() {
  },
  watch: {
    // A chave do 'watch' deve ser uma string com o caminho para a propriedade que você quer observar.
    'provider.address.zipCode'(newZipCode: string) {
      const zipCodeAsString = String(newZipCode);
      console.log('zip ', zipCodeAsString.length)
      if (zipCodeAsString.length == 8) {
        this.getAddressByZipCode(zipCodeAsString);
      }
    }
  },
  methods: {
    async performRegister() {
      console.log('Dados do usuário: ', this.provider)
    },
    handleAction(actionType: String) {
      if (actionType === 'register') {
        this.performRegister();
      }
    },
    getBase64Profile(base64: string) {
      this.provider.profile = base64;
      console.log('base64 do perfil: ', this.provider.profile)
    },
    getBase64Cover(base64: string)
    {
      this.provider.cover = base64
      console.log('base64 da capa: ', this.provider.cover)
    },
    async getAddressByZipCode(zipCode: string) {
      if (zipCode.length === 8) {
        try {
          // MUDANÇA: Armazene a resposta em uma variável local 'response'
          const response = await getAddress(zipCode);

          // Agora use 'response' para preencher os dados
          this.provider.address.street = response.data.logradouro;
          this.provider.address.area = response.data.bairro;
          this.provider.address.city = response.data.localidade;
          this.provider.address.state = response.data.uf;
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        }
      }
    }
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
      class="register-provider-form f-column"
      @submit.prevent=""
    >
      <!--Dados do Estabelecimento-->
      <div class="input-block f-column">
        <div class="heather-block">
          <span>Dados do Estabelecimento</span>
        </div>

        <div class="inputs f-column">
          <base-input
              :label="'Nome da Barbearia'"
              :placeholder="'Ex: Classic Barber'"
              :type="'text'"
              v-model="provider.barberName"
          />

          <base-input
              :label="'CNPJ'"
              :placeholder="'01.234.567/0001-98'"
              :type="'number'"
              v-model="provider.companyCode"
          />

          <base-input
              :label="'Telefone/Whatsapp'"
              :placeholder="'(27) 99988-7766)'"
              :type="'number'"
              v-model="provider.phone"
          />
        </div>
      </div>

      <!--Dados do Proprietário-->
      <div class="input-block f-column">
        <div class="heather-block">
          <span>Dados do Proprietário</span>
        </div>

        <div class="inputs f-column">
          <base-input
            :label="'Seu Nome Completo'"
            :placeholder="'Nome do Proprietário'"
            :type="'text'"
            v-model="provider.owner.name"
          />

          <base-input
              :label="'CPF'"
              :placeholder="'111.222.333-44'"
              :type="'number'"
              v-model="provider.owner.socialSecurity"
          />

          <base-input
              :label="'E-mail de Acesso'"
              :placeholder="'exemplo@mail.com'"
              :type="'text'"
              v-model="provider.owner.email"
          />

          <base-input
              :label="'Senha'"
              :placeholder="'Mínimo 6 caracteres'"
              v-model="provider.owner.password"
          />
        </div>
      </div>

      <!--Dados do Endereço-->
      <div class="input-block f-column">
        <div class="heather-block">
          <span>Endereço</span>
        </div>

        <div class="inputs f-column">
          <base-input
              :label="'CEP'"
              :placeholder="'XXXXX-XXX'"
              :type="'number'"
              v-model="provider.address.zipCode"
              @keyup="getAddressByZipCode(provider.address.zipCode)"
          />

          <div class="address center f-row">
            <div class="address-full">
              <base-input
                  :label="'Rua/Logradouro'"
                  :placeholder="'Nome da Rua'"
                  :type="'text'"
                  v-model="provider.address.street"
              />
            </div>

            <div class="address-small">
              <base-input
                  :label="'Número'"
                  :placeholder="'000'"
                  :type="'number'"
                  v-model="provider.address.number"
              />
            </div>
          </div>

          <base-input
              :label="'Bairro'"
              :placeholder="'Nome do Bairro'"
              :type="'text'"
              v-model="provider.address.area"
          />

          <div class="address center f-row">
            <div class="address-full">
              <base-input
                  :label="'Cidade'"
                  :placeholder="'Nome da Cidade'"
                  :type="'text'"
                  v-model="provider.address.city"
              />
            </div>

            <div class="address-small">
              <base-input
                  :label="'Estado'"
                  :placeholder="'UF'"
                  :type="'text'"
                  v-model="provider.address.state"
              />
            </div>
          </div>
        </div>
      </div>

      <!--Uploads in Images-->
      <div class="input-block f-column">
        <div class="inputs f-column">
          <base-file-input
              :label="'Logo da Barbearia'"
              @file-selected="getBase64Profile"
          />

          <base-file-input
              :label="'Foto de Capa (para o topo do seu perfil)'"
              @file-selected="getBase64Cover"
          />
        </div>
      </div>
    </form>

    <base-button
        class="button-action"
        :label="'Finalizar Cadastro'"
        :type="'primary'"
        :function="'register'"
        @continue-function="handleAction"
    />
  </main>
</template>

<style scoped>
  .container-register-provider {
    padding: 24px;
  }

  .register-provider-form {
    width: 100%;
    display: flex;
    row-gap: 48px;

  }

  .heather-block {
    padding-bottom: 8px;
    border-bottom: solid 1px var(--color-border);
    margin-bottom: 24px;
  }

  .heather-block span {
    font-size: 20px;
    font-weight: var(--font-weight-bold);
  }

  .inputs {
    display: flex;
    row-gap: 16px;
  }

  .address {
    width: 100%;
    justify-content: space-between;
  }

  .address-full {
    width: 74%;
  }

  .address-small {
    width: 20%;
  }

  .button-action {
    margin-top: 40px;
  }
</style>