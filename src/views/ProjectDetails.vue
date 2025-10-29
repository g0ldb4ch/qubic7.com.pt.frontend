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
        <div class="flex gap-2">
          <button @click="exportProject" class="btn-primary">📥 Esporta per n8n</button>
          <label class="btn-secondary cursor-pointer">
            Importa JSON
            <input type="file" accept="application/json" class="hidden" @change="handleImportJson" />
          </label>
        </div>
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
        <div class="flex flex-wrap gap-2 mt-3">
          <span v-for="tech in uniqueTech" :key="tech" class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
            🧩 {{ tech }}
          </span>
        </div>
      </div>
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500">Vulnerabilità</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalVulns }}</p>
        <ul class="mt-3 space-y-1">
          <li v-for="vuln in uniqueVulnTitles" :key="vuln" class="flex items-center gap-2">
            <span class="inline-block px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">🛡️ {{ vuln }}</span>
          </li>
        </ul>
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
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex justify-between items-start"
        >
          <div class="flex-1 cursor-pointer" @click="$router.push(`/subdomains/${subdomain._id}`)">
            <h3 class="text-lg font-semibold text-gray-900">{{ subdomain.subdomain }}</h3>
            <p v-if="subdomain.ipAddress" class="text-sm text-gray-600 mt-1">
              IP: {{ subdomain.ipAddress }}
            </p>
            <div v-if="subdomain.notes" class="mt-2 text-sm text-gray-600">
              {{ subdomain.notes }}
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span 
              class="px-3 py-1 rounded-full text-xs font-semibold mb-2"
              :class="subdomain.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ subdomain.status === 'active' ? 'Attivo' : 'Inattivo' }}
            </span>
            <button @click="deleteSubdomain(subdomain._id)" class="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded border border-red-200">
              Elimina
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
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
import { useSubdomainTechsStore } from '@/stores/subdomainTechs';
import { useSubdomainVulnsStore } from '@/stores/subdomainVulns';
import SubdomainModal from '@/components/SubdomainModal.vue';

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const subdomainsStore = useSubdomainsStore();
const techStore = useSubdomainTechsStore();
const vulnStore = useSubdomainVulnsStore();

const showSubdomainModal = ref(false);
const loading = ref(true);

const project = computed(() => projectsStore.currentProject);
const subdomains = computed(() => subdomainsStore.subdomains);

// Totali
const totalTech = computed(() =>
  subdomains.value.reduce((acc, sub) => acc + (sub.techStack?.length || 0), 0)
);

const totalVulns = computed(() =>
  subdomains.value.reduce((acc, sub) => acc + (sub.vulnerabilities?.length || 0), 0)
);

// Tecnologie uniche
const uniqueTech = computed(() => {
  const all = subdomains.value.flatMap(sub => sub.techStack || []);
  return [...new Set(all.map(t => typeof t === 'string' ? t : t.technology || t.name || t))];
});

// Titoli vulnerabilità unici
const uniqueVulnTitles = computed(() => {
  const all = subdomains.value.flatMap(sub => sub.vulnerabilities || []);
  return [...new Set(all.map(v => v.title || v.name || v["template-id"] || 'Vulnerabilità'))];
});

// Lifecycle
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

// Aggiunta sottodominio
const handleSubdomainSubmit = async (subdomainData) => {
  try {
    await subdomainsStore.createSubdomain(route.params.id, subdomainData);
    await subdomainsStore.fetchSubdomains(route.params.id);
  } catch (error) {
    console.error('Errore creazione sottodominio:', error);
    alert(error.response?.data?.error || 'Errore nella creazione del sottodominio');
  }
};

// Cancellazione
const deleteSubdomain = async (subdomainId) => {
  if (!confirm('Sei sicuro di voler eliminare questo sottodominio?')) return;
  try {
    await subdomainsStore.deleteSubdomain(subdomainId);
    await subdomainsStore.fetchSubdomains(route.params.id);
  } catch (error) {
    alert('Errore durante la cancellazione del sottodominio');
    console.error(error);
  }
};

// Import JSON da Nuclei
const handleImportJson = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!Array.isArray(data)) throw new Error('Il file JSON deve essere un array.');

    for (const entry of data) {
      // Verifica che l'entry abbia i campi necessari
      if (!entry.host) {
        console.warn('Entry senza host:', entry);
        continue;
      }

      const cleanHost = entry.host.replace(/^https?:\/\//, '');
      const subdomainData = { 
        subdomain: cleanHost,
        ip: entry.ip || '',
        status: entry.status || 'unknown'
      };

      // Creazione del subdomain
      const subdomain = await subdomainsStore.createSubdomain(route.params.id, subdomainData);
      const subId = subdomain?._id || subdomain?.data?._id;

      if (!subId) {
        console.warn('Impossibile creare subdomain:', cleanHost);
        continue;
      }

      // Aggiunta dello stack tecnologico (se presente)
      if (Array.isArray(entry.stack)) {
        for (const tech of entry.stack) {
          await techStore.addTechStack(subId, { technology: tech });
        }
      }

      // Aggiunta delle vulnerabilità (se presenti)
      if (Array.isArray(entry.vulnerabilities)) {
        for (const vuln of entry.vulnerabilities) {
          const mapped = {
            title: vuln.name || vuln["template-id"] || 'Vulnerabilità',
            description: vuln.description || vuln.info?.description || 'Nessuna descrizione fornita',
            severity: vuln.severity || 'medium',
            status: 'open',
            cvss: null,
            cve: '',
            proof: '',
            remediation: '',
            affectedUrl: vuln["matched-at"] || entry.host || '',
            impact: '',
            timestamp: vuln.timestamp || ''
          };
          await vulnStore.addVulnerability(subId, mapped);
        }
      }

      console.log(`Importato: ${cleanHost} - ${entry.ip || 'N/A'} - ${entry.status || 'unknown'}`);
    }

    alert(`Importazione completata! ${data.length} subdomain processati.`);
    await subdomainsStore.fetchSubdomains(route.params.id);

  } catch (e) {
    console.error('Errore importazione:', e);
    alert('Errore importazione JSON: ' + e.message);
  }
};

// Export JSON per n8n
const exportProject = async () => {
  try {
    const exportData = await projectsStore.exportProject(route.params.id);
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
    alert("Errore durante l'export del progetto");
  }
};
</script>
