<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import type { OnboardingProvider } from '@/types/user'; // Mudei o caminho para o seu tipo
import { BaseFileInput, BaseTextarea, BaseInput } from "@/components";

// O tipo Vuelidate é complexo, então usamos 'any' para simplificar
type ValidationProp = any;

export default defineComponent({
  name: 'StepOneProvider',
  components: {
    BaseFileInput,
    BaseTextarea,
    BaseInput,
  },
  props: {
    modelValue: {
      type: Object as PropType<OnboardingProvider>,
      required: true,
    },
    validation: {
      type: Object as PropType<ValidationProp>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const formData = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    const handleProfileUpload = (base64: string | null) => {
      formData.value.profileImage = base64 as string;
    };
    const handleCoverUpload = (base64: string | null) => {
      formData.value.coverImage = base64 as string;
    };

    return { formData, handleProfileUpload, handleCoverUpload };
  }
});
</script>

<template>
  <div class="form-content f-column">
    <div
        class="input-block f-column"
    >
      <div class="heather-block">
        <span>Informaçõs do Perfil</span>
      </div>

      <div class="inputs f-column">
        <div class="input-group">
          <BaseFileInput
              label="Foto do Perfil (Logo)"
              @file-selected="handleProfileUpload"
          />
        </div>
        <div class="input-group">
          <BaseFileInput
              label="Foto de Capa"
              @file-selected="handleCoverUpload"
          />
        </div>

        <div class="input-group">
          <BaseTextarea
              label="Bio / Descrição"
              placeholder="Fale sobre seu espaço..."
              v-model="formData.description"
          />
        </div>
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
            v-model="modelValue.address.zipCode"
            :error="validation.address.zipCode.$error"
            :errorMessage="validation.address.zipCode.$errors[0]?.$message"
        />

        <div class="address center f-row">
          <div class="address-full">
            <base-input
                :label="'Rua/Logradouro'"
                :placeholder="'Nome da Rua'"
                :type="'text'"
                v-model="modelValue.address.street"
                :error="validation.address.zipCode.$error"
                :errorMessage="validation.address.street.$errors[0]?.$message"
            />
          </div>

          <div class="address-small">
            <base-input
                :label="'Número'"
                :placeholder="'000'"
                :type="'number'"
                v-model="modelValue.address.number"
                :error="validation.address.zipCode.$error"
                :errorMessage="validation.address.number.$errors[0]?.$message"
            />
          </div>
        </div>

        <base-input
            :label="'Bairro'"
            :placeholder="'Nome do Bairro'"
            :type="'text'"
            v-model="modelValue.address.area"
            :error="validation.address.zipCode.$error"
            :errorMessage="validation.address.area.$errors[0]?.$message"
        />

        <div class="address center f-row">
          <div class="address-full">
            <base-input
                :label="'Cidade'"
                :placeholder="'Nome da Cidade'"
                :type="'text'"
                v-model="modelValue.address.city"
                :error="validation.address.zipCode.$error"
                :errorMessage="validation.address.city.$errors[0]?.$message"
            />
          </div>

          <div class="address-small">
            <base-input
                :label="'Estado'"
                :placeholder="'UF'"
                :type="'text'"
                v-model="modelValue.address.state"
                :error="validation.address.zipCode.$error"
                :errorMessage="validation.address.state.$errors[0]?.$message"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .form-content {
    width: 100%;
    display: flex;
    row-gap: 16px;
  }

  .input-block {
    margin-top: 24px;
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

  .heather-block {
    padding-bottom: 8px;
    border-bottom: solid 1px var(--color-border);
    margin-bottom: 24px;
  }

  .heather-block span {
    font-size: 20px;
    font-weight: var(--font-weight-bold);
  }
</style>