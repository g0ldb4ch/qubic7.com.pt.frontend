
<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Progetti</h1>
      <button @click="showProjectModal = true" class="btn-primary">
        + Nuovo Progetto
      </button>
    </div>

    <!-- Loading -->
    <div v-if="projectsStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Caricamento...</p>
    </div>

    <!-- Error -->
    <div v-else-if="projectsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ projectsStore.error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="projectsStore.projects.length === 0" class="text-center py-12">
      <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Nessun progetto</h3>
      <p class="mt-2 text-gray-600">Inizia creando il tuo primo progetto di penetration testing.</p>
      <button @click="showProjectModal = true" class="mt-6 btn-primary">
        Crea Primo Progetto
      </button>
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        v-for="project in projectsWithStats"
        :key="project._id"
        :project="project"
        :tech-count="project.techCount"
        :vuln-count="project.vulnCount"
        :subdomain-count="project.subdomainCount"
        @edit="editProject"
        @delete="confirmDelete"
      />
    </div>

    <!-- Project Modal -->
    <ProjectModal
      :show="showProjectModal"
      :project="selectedProject"
      @close="closeProjectModal"
      @submit="handleProjectSubmit"
    />

    <!-- Delete Confirmation -->
    <div 
      v-if="showDeleteConfirm" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
        <h3 class="text-lg font-bold mb-4">Conferma Eliminazione</h3>
        <p class="text-gray-600 mb-6">
          Sei sicuro di voler eliminare questo progetto? Tutti i sottodomini, tecnologie e vulnerabilità associate verranno eliminate.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteConfirm = false" class="btn-secondary">
            Annulla
          </button>
          <button @click="deleteProject" class="btn-danger">
            Elimina
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProjectsStore } from '@/stores/projects';
import { useSubdomainsStore } from '@/stores/subdomains';
import ProjectCard from '@/components/ProjectCard.vue';
import ProjectModal from '@/components/ProjectModal.vue';

const projectsStore = useProjectsStore();
const subdomainsStore = useSubdomainsStore();

const showProjectModal = ref(false);
const selectedProject = ref(null);
const showDeleteConfirm = ref(false);
const projectToDelete = ref(null);

onMounted(() => {
  (async () => {
    try {
      await projectsStore.fetchProjects();
      // Dopo aver caricato i progetti, fetcha tutti i subdomains per mostrare i conteggi in Dashboard
      const ids = projectsStore.projects.map(p => p._id);
      if (ids.length) {
        await subdomainsStore.fetchAllSubdomains(ids);
      }
      console.log('Progetti caricati:', projectsStore.projects);
    } catch (e) {
      console.error('Errore caricamento progetti o sottodomini:', e);
    }
  })();
});

// Calcola i conteggi tech/vuln per ogni progetto
const projectsWithStats = computed(() => {
    return projectsStore.projects.map(project => {
  // Trova tutti i subdomains di questo progetto
  const subdomains = subdomainsStore.subdomains?.filter?.(s => s.projectId === project._id) || [];

    let techCount = 0;
    let vulnCount = 0;
    for (const sub of subdomains) {
      techCount += Array.isArray(sub.techStack) ? sub.techStack.length : 0;
      vulnCount += Array.isArray(sub.vulnerabilities) ? sub.vulnerabilities.length : 0;
    }    

    // Passa anche il conteggio dei subdomains al ProjectCard
    return { ...project, techCount, vulnCount, subdomainCount: subdomains.length };
  });
});

const editProject = (project) => {
  selectedProject.value = project;
  showProjectModal.value = true;
};

const closeProjectModal = () => {
  showProjectModal.value = false;
  selectedProject.value = null;
};

const handleProjectSubmit = async (projectData) => {
  try {
    if (selectedProject.value) {
      await projectsStore.updateProject(selectedProject.value._id, projectData);
    } else {
      await projectsStore.createProject(projectData);
    }
  } catch (error) {
    console.error('Errore salvataggio progetto:', error);
  }
};

const confirmDelete = (projectId) => {
  projectToDelete.value = projectId;
  showDeleteConfirm.value = true;
};

const deleteProject = async () => {
  try {
    await projectsStore.deleteProject(projectToDelete.value);
    showDeleteConfirm.value = false;
    projectToDelete.value = null;
  } catch (error) {
    console.error('Errore eliminazione progetto:', error);
  }
};
</script>