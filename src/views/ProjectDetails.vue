<template>
  <div v-if="project">
    <!-- Header -->
    <div class="mb-8">      
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ project.name }}</h1>
          <p class="text-lg text-gray-600 mt-2">{{ project.domain }}</p>
          <p class="text-sm text-gray-500 mt-1">Cliente: {{ project.client }}</p>
        </div>
        <button @click="exportProject" class="btn-primary">
          📥 Esporta per n8n
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500">Sottodomini</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ subdomains.length }}</p>
      </div>
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500">Tecnologie</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalTech }}</p>
      </div>
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500">Vulnerabilità</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalVulns }}</p>
      </div>
    </div>

    <!-- Subdomains Section -->
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Sottodomini</h2>
        <button @click="showSubdomainModal = true" class="btn-primary">
          + Aggiungi Sottodominio
        </button>
      </div>

      <div v-if="subdomains.length === 0" class="text-center py-8 text-gray-500">
        Nessun sottodominio trovato. Inizia aggiungendone uno.
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="subdomain in subdomains" 
          :key="subdomain._id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          @click="$router.push(`/subdomains/${subdomain._id}`)"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ subdomain.subdomain }}</h3>
              <p v-if="subdomain.ipAddress" class="text-sm text-gray-600 mt-1">
                IP: {{ subdomain.ipAddress }}
              </p>
            </div>
            <span 
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="subdomain.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ subdomain.status === 'active' ? 'Attivo' : 'Inattivo' }}
            </span>
          </div>
          <div v-if="subdomain.notes" class="mt-2 text-sm text-gray-600">
            {{ subdomain.notes }}
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <SubdomainModal
      :show="showSubdomainModal"
      @close="showSubdomainModal = false"
      @submit="handleSubdomainSubmit"
    />
  </div>

  <div v-else-if="loading" class="text-center py-12">
    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';
import { useSubdomainsStore } from '@/stores/subdomains';
import SubdomainModal from '@/components/SubdomainModal.vue';

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const subdomainsStore = useSubdomainsStore();

const showSubdomainModal = ref(false);
const loading = ref(true);

const project = computed(() => projectsStore.currentProject);
const subdomains = computed(() => subdomainsStore.subdomains);

const totalTech = computed(() => {
  return subdomains.value.reduce((acc, sub) => {
    return acc + (sub.techStack?.length || 0);
  }, 0);
});

const totalVulns = computed(() => {
  return subdomains.value.reduce((acc, sub) => {
    return acc + (sub.vulnerabilities?.length || 0);
  }, 0);
});

onMounted(async () => {
  try {
    await projectsStore.fetchProject(route.params.id);
    await subdomainsStore.fetchSubdomains(route.params.id);
  } catch (error) {
    console.error('Errore caricamento progetto:', error);
  } finally {
    loading.value = false;
  }
});

const handleSubdomainSubmit = async (subdomainData) => {
  try {
    await subdomainsStore.createSubdomain(route.params.id, subdomainData);
  } catch (error) {
    console.error('Errore creazione sottodominio:', error);
    alert(error.response?.data?.error || 'Errore nella creazione del sottodominio');
  }
};

const exportProject = async () => {
  try {
    const exportData = await projectsStore.exportProject(route.params.id);
    
    // Crea file JSON per download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.value.domain}_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Errore export progetto:', error);
    alert('Errore durante l\'export del progetto');
  }
};
</script>