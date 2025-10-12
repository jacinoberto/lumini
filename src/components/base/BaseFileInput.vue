<template>
  <div class="base-file-input-wrapper">
    <label v-if="label" class="file-input-label">{{ label }}</label>
    <div
        class="file-input-area"
        :class="{ 'is-dragging': isDragging }"
        @click="openFilePicker"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
    >
      <input
          ref="fileInput"
          type="file"
          class="sr-only"
          accept="image/*"
          @change="handleFileChange"
      />

      <div v-if="previewUrl" class="image-preview">
        <img :src="previewUrl" alt="Prévia da imagem selecionada" />
        <button class="remove-image-btn" @click.stop="removeImage">
          <vue-feather type="x" size="16"></vue-feather>
        </button>
      </div>

      <div v-else class="placeholder-content">
        <vue-feather type="upload-cloud" size="24"></vue-feather>
        <span>Clique aqui para escolher uma imagem</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseFileInput',
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  emits: ['file-selected'],

  data() {
    return {
      isDragging: false,
      previewUrl: null as string | null,
    };
  },

  methods: {
    openFilePicker() {
      // Acessa a referência do input e simula um clique
      (this.$refs.fileInput as HTMLInputElement).click();
    },

    handleFileChange(event: Event) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        this.processFile(file);
      }
    },

    processFile(file: File) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem.');
        return;
      }

      // 1. Cria uma instância do FileReader
      const reader = new FileReader();

      // 2. Define o que acontece QUANDO a leitura terminar
      reader.onload = (e) => {
        const base64String = e.target?.result as string;

        // Usa a própria string Base64 para a prévia
        this.previewUrl = base64String;

        // Emite a string Base64 para o componente pai
        this.$emit('file-selected', base64String);
      };

      // Define um tratamento de erro (boa prática)
      reader.onerror = (error) => {
        console.error('Erro ao ler o arquivo:', error);
        this.$emit('file-selected', null);
      };

      // 3. Inicia a operação de leitura (que é assíncrona)
      reader.readAsDataURL(file);
    },

    removeImage() {
      this.previewUrl = null;
      // Limpa o valor do input para permitir selecionar o mesmo arquivo novamente
      (this.$refs.fileInput as HTMLInputElement).value = '';
      this.$emit('file-selected', null);
    },

    // Métodos para Drag and Drop
    handleDragOver() {
      this.isDragging = true;
    },
    handleDragLeave() {
      this.isDragging = false;
    },
    handleDrop(event: DragEvent) {
      this.isDragging = false;
      const file = event.dataTransfer?.files[0];
      if (file) {
        this.processFile(file);
      }
    },
  },
});
</script>

<style scoped>
/* Estilos gerais */
.base-file-input-wrapper {
  width: 100%;
}
.file-input-label {
  display: block;
  color: var(--color-text-secondary);
  font-size: var(--font-size-input);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Área de upload */
.file-input-area {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 150px;
  background-color: transparent;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}
.file-input-area:hover,
.file-input-area.is-dragging {
  border-color: var(--color-accent-primary);
  background-color: rgba(5, 150, 105, 0.1); /* Um verde bem sutil */
}

/* Conteúdo do placeholder */
.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
  text-align: center;
}
.placeholder-content span {
  font-weight: var(--font-weight-semibold);
}
.placeholder-content small {
  font-size: var(--font-size-caption);
}

/* Prévia da imagem */
.image-preview {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.remove-image-btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: rgba(17, 24, 39, 0.8); /* Fundo primário com opacidade */
  border: none;
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.remove-image-btn:hover {
  background-color: var(--color-danger);
}
</style>