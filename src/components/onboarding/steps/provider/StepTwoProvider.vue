<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { DayScheduleCard } from '@/components';
import type { OnboardingProvider } from '@/types/user';

export default defineComponent({
  name: 'StepTwoProvider',
  components: { DayScheduleCard },
  props: {
    modelValue: {
      type: Object as PropType<OnboardingProvider>,
      required: true,
    },
    validation: {
      type: Object,
      required: true
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const formData = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });
    return { formData };
  }
});
</script>

<template>
  <main class="schedule-content">
    <div class="schedule-list">
      <DayScheduleCard
          v-for="(day, index) in formData.workingHours"
          :key="index"
          v-model="formData.workingHours[index]"
      />
    </div>
  </main>
</template>

<style scoped>
.schedule-content {
  width: 100%;
  display: flex;
}
.schedule-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>