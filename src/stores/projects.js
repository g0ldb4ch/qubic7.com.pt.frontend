import { defineStore } from 'pinia';
import { projectsAPI } from '@/services/api';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchProjects() {
      this.loading = true;
      this.error = null;
      try {
        const response = await projectsAPI.getAll();
        this.projects = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nel caricamento dei progetti';
        console.error('Errore fetch progetti:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProject(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await projectsAPI.getById(id);
        this.currentProject = response.data.data;
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nel caricamento del progetto';
        console.error('Errore fetch progetto:', error);
      } finally {
        this.loading = false;
      }
    },

    async createProject(projectData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await projectsAPI.create(projectData);
        this.projects.unshift(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nella creazione del progetto';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProject(id, projectData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await projectsAPI.update(id, projectData);
        const index = this.projects.findIndex(p => p._id === id);
        if (index !== -1) {
          this.projects[index] = response.data.data;
        }
        if (this.currentProject?._id === id) {
          this.currentProject = response.data.data;
        }
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'aggiornamento del progetto';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteProject(id) {
      this.loading = true;
      this.error = null;
      try {
        await projectsAPI.delete(id);
        this.projects = this.projects.filter(p => p._id !== id);
        if (this.currentProject?._id === id) {
          this.currentProject = null;
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'eliminazione del progetto';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async exportProject(id) {
      try {
        const response = await projectsAPI.export(id);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'export del progetto';
        throw error;
      }
    }
  }
});