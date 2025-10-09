<template>
  <span 
    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
    :class="badgeClasses"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  severity: {
    type: String,
    required: true,
    validator: (value) => ['critical', 'high', 'medium', 'low', 'info'].includes(value)
  }
});

const badgeClasses = computed(() => {
  const classes = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-lime-100 text-lime-800',
    info: 'bg-blue-100 text-blue-800'
  };
  return classes[props.severity];
});

const label = computed(() => {
  const labels = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    info: 'Info'
  };
  return labels[props.severity];
});
</script>