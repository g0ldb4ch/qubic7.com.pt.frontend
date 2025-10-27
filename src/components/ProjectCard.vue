<template>
      <div class="card hover:shadow-lg transition-shadow cursor-pointer" @click="goToProject">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ project.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ project.domain }}</p>
          </div>
          <span 
            class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="statusClasses"
          >
            {{ statusLabel }}
          </span>
        </div>

        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-center">
            <span class="font-medium">Cliente:</span>
            <span class="ml-2">{{ project.client }}</span>
          </div>
          <div class="flex items-center">
            <span class="font-medium">Data inizio:</span>
            <span class="ml-2">{{ formatDate(project.startDate) }}</span>
          </div>
        </div>

        <!-- Tag Tech/Vuln e pulsanti -->
        <div class="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
          <div class="flex gap-3 mb-2">
            <span class="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
              🌐 Sub: {{ subdomainCount ?? 0 }}
            </span>
            <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
              🧩 Tech: {{ techCount ?? 0 }}
            </span>
            <span class="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
              🛡️ Vuln: {{ vulnCount ?? 0 }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <button 
              @click.stop="$emit('edit', project)"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Modifica
            </button>
            <button 
              @click.stop="$emit('delete', project._id)"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Elimina
            </button>
          </div>
        </div>
      </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  techCount: {
    type: Number,
    default: 0
  },
  vulnCount: {
    type: Number,
    default: 0
  },
  subdomainCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['edit', 'delete']);
const router = useRouter();

const statusClasses = computed(() => {
  const classes = {
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'archived': 'bg-gray-100 text-gray-800'
  };
  return classes[props.project.status] || classes['in-progress'];
});

const statusLabel = computed(() => {
  const labels = {
    'in-progress': 'In corso',
    'completed': 'Completato',
    'archived': 'Archiviato'
  };
  return labels[props.project.status] || 'In corso';
});

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('it-IT');
};

const goToProject = () => {
  router.push(`/projects/${props.project._id}`);
};
</script>