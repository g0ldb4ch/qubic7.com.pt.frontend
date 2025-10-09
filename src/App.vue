<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg fixed h-full">
      <div class="p-6">
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-2xl">🔒</span>
          <span class="text-xl font-bold text-blue-600">Pentest Manager</span>
        </router-link>
      </div>

      <nav class="mt-6">
        <router-link 
          to="/" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          :class="{ 'bg-blue-50 text-blue-600 border-r-4 border-blue-600': $route.path === '/' }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </router-link>

        <div v-if="recentProjects.length > 0" class="mt-8 px-6">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Progetti Recenti
          </h3>
          <div class="space-y-1">
            <router-link
              v-for="project in recentProjects"
              :key="project._id"
              :to="`/projects/${project._id}`"
              class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors truncate"
              :class="{ 'bg-gray-100': $route.params.id === project._id }"
            >
              {{ project.name }}
            </router-link>
          </div>
        </div>
      </nav>

      <div class="absolute bottom-0 w-full p-6 border-t border-gray-200">
        <div class="text-xs text-gray-500 text-center">
          <p>Pentest Manager v1.0</p>
          <p class="mt-1">{{ new Date().getFullYear() }}</p>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 ml-64">
      <div class="max-w-7xl mx-auto px-8 py-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useProjectsStore } from '@/stores/projects';

const projectsStore = useProjectsStore();

const recentProjects = computed(() => {
  return projectsStore.projects.slice(0, 5);
});
</script>