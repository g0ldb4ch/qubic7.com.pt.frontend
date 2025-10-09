<template>
  <div v-if="subdomain">
    <!-- Header -->
    <div class="mb-8">      
      <div>
        <div class="flex items-center text-sm text-gray-500 mb-3">
          <router-link 
            :to="`/projects/${subdomain.projectId._id}`"
            class="hover:text-blue-600 transition-colors"
          >
            {{ subdomain.projectId.name }}
          </router-link>
          <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-gray-900 font-medium">{{ subdomain.subdomain }}</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">{{ subdomain.subdomain }}</h1>
        <p v-if="subdomain.ipAddress" class="text-sm text-gray-600 mt-2">
          IP: {{ subdomain.ipAddress }}
        </p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500">Tecnologie</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ techStacks.length }}</p>
      </div>
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500">Vulnerabilità Totali</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ vulnerabilities.length }}</p>
      </div>
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500">Critical</h3>
        <p class="text-3xl font-bold text-red-600 mt-2">{{ criticalCount }}</p>
      </div>
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500">High</h3>
        <p class="text-3xl font-bold text-orange-600 mt-2">{{ highCount }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Tech Stack Section -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Stack Tecnologico</h2>
          <button @click="showTechStackModal = true" class="btn-primary text-sm">
            + Aggiungi
          </button>
        </div>

        <div v-if="techStacks.length === 0" class="text-center py-8 text-gray-500">
          Nessuna tecnologia registrata
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="tech in techStacks" 
            :key="tech._id"
            class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-semibold text-gray-900">{{ tech.technology }}</p>
              <p class="text-sm text-gray-600">
                <span v-if="tech.version">v{{ tech.version }}</span>
                <span class="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">{{ tech.category }}</span>
              </p>
            </div>
            <button 
              @click="deleteTech(tech._id)"
              class="text-red-600 hover:text-red-800"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Vulnerabilities Section -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Vulnerabilità</h2>
          <button @click="showVulnModal = true" class="btn-primary text-sm">
            + Aggiungi
          </button>
        </div>

        <!-- Filters -->
        <div class="flex space-x-2 mb-4">
          <select v-model="severityFilter" class="input-field text-sm">
            <option value="">Tutte le severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>
          <select v-model="statusFilter" class="input-field text-sm">
            <option value="">Tutti gli status</option>
            <option value="open">Open</option>
            <option value="fixed">Fixed</option>
            <option value="accepted-risk">Accepted Risk</option>
            <option value="false-positive">False Positive</option>
          </select>
        </div>

        <div v-if="filteredVulnerabilities.length === 0" class="text-center py-8 text-gray-500">
          Nessuna vulnerabilità trovata
        </div>

        <div v-else class="space-y-3 max-h-96 overflow-y-auto">
          <div 
            v-for="vuln in filteredVulnerabilities" 
            :key="vuln._id"
            class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            @click="editVulnerability(vuln)"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-900">{{ vuln.title }}</h3>
              <SeverityBadge :severity="vuln.severity" />
            </div>
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ vuln.description }}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span v-if="vuln.cvss" class="font-semibold">CVSS: {{ vuln.cvss }}</span>
              <span v-if="vuln.cve">{{ vuln.cve }}</span>
              <span 
                class="px-2 py-1 rounded"
                :class="{
                  'bg-red-100 text-red-800': vuln.status === 'open',
                  'bg-green-100 text-green-800': vuln.status === 'fixed',
                  'bg-yellow-100 text-yellow-800': vuln.status === 'accepted-risk',
                  'bg-gray-100 text-gray-800': vuln.status === 'false-positive'
                }"
              >
                {{ vuln.status }}
              </span>
            </div>
            <div class="mt-2 flex space-x-2">
              <button 
                @click.stop="editVulnerability(vuln)"
                class="text-blue-600 hover:text-blue-800 text-xs"
              >
                Modifica
              </button>
              <button 
                @click.stop="deleteVuln(vuln._id)"
                class="text-red-600 hover:text-red-800 text-xs"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <TechStackModal
      :show="showTechStackModal"
      @close="showTechStackModal = false"
      @submit="handleTechStackSubmit"
    />

    <VulnerabilityModal
      :show="showVulnModal"
      :vulnerability="selectedVulnerability"
      @close="closeVulnModal"
      @submit="handleVulnSubmit"
    />
  </div>

  <div v-else-if="loading" class="text-center py-12">
    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSubdomainsStore } from '@/stores/subdomains';
import SeverityBadge from '@/components/SeverityBadge.vue';
import TechStackModal from '@/components/TechStackModal.vue';
import VulnerabilityModal from '@/components/VulnerabilityModal.vue';

const route = useRoute();
const subdomainsStore = useSubdomainsStore();

const showTechStackModal = ref(false);
const showVulnModal = ref(false);
const selectedVulnerability = ref(null);
const loading = ref(true);
const severityFilter = ref('');
const statusFilter = ref('');

const subdomain = computed(() => subdomainsStore.currentSubdomain);
const techStacks = computed(() => subdomainsStore.techStacks);
const vulnerabilities = computed(() => subdomainsStore.vulnerabilities);

const filteredVulnerabilities = computed(() => {
  let filtered = vulnerabilities.value;
  
  if (severityFilter.value) {
    filtered = filtered.filter(v => v.severity === severityFilter.value);
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(v => v.status === statusFilter.value);
  }
  
  return filtered;
});

const criticalCount = computed(() => 
  vulnerabilities.value.filter(v => v.severity === 'critical').length
);

const highCount = computed(() => 
  vulnerabilities.value.filter(v => v.severity === 'high').length
);

onMounted(async () => {
  try {
    await subdomainsStore.fetchSubdomain(route.params.id);
  } catch (error) {
    console.error('Errore caricamento sottodominio:', error);
  } finally {
    loading.value = false;
  }
});

const handleTechStackSubmit = async (techData) => {
  try {
    await subdomainsStore.addTechStack(route.params.id, techData);
  } catch (error) {
    console.error('Errore aggiunta tecnologia:', error);
    alert('Errore nell\'aggiunta della tecnologia');
  }
};

const deleteTech = async (techId) => {
  if (!confirm('Sei sicuro di voler eliminare questa tecnologia?')) return;
  
  try {
    await subdomainsStore.deleteTechStack(techId);
  } catch (error) {
    console.error('Errore eliminazione tecnologia:', error);
    alert('Errore nell\'eliminazione della tecnologia');
  }
};

const editVulnerability = (vuln) => {
  selectedVulnerability.value = vuln;
  showVulnModal.value = true;
};

const closeVulnModal = () => {
  showVulnModal.value = false;
  selectedVulnerability.value = null;
};

const handleVulnSubmit = async (vulnData) => {
  try {
    if (selectedVulnerability.value) {
      await subdomainsStore.updateVulnerability(selectedVulnerability.value._id, vulnData);
    } else {
      await subdomainsStore.addVulnerability(route.params.id, vulnData);
    }
  } catch (error) {
    console.error('Errore salvataggio vulnerabilità:', error);
    alert('Errore nel salvataggio della vulnerabilità');
  }
};

const deleteVuln = async (vulnId) => {
  if (!confirm('Sei sicuro di voler eliminare questa vulnerabilità?')) return;
  
  try {
    await subdomainsStore.deleteVulnerability(vulnId);
  } catch (error) {
    console.error('Errore eliminazione vulnerabilità:', error);
    alert('Errore nell\'eliminazione della vulnerabilità');
  }
};
</script>