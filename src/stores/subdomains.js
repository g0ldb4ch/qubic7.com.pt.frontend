import { defineStore } from 'pinia';
import { subdomainsAPI } from '@/services/api';

export const useSubdomainsStore = defineStore('subdomains', {
  state: () => ({
    subdomains: [],
    currentSubdomain: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchSubdomains(projectId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await subdomainsAPI.getByProject(projectId);
        this.subdomains = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nel caricamento dei sottodomini';
        console.error('Errore fetch sottodomini:', error);
      } finally {
        this.loading = false;
      }
    },

    // Fetch subdomains for multiple projects and merge into store
    async fetchAllSubdomains(projectIds = []) {
      this.loading = true;
      this.error = null;
      try {
        const promises = projectIds.map(id => subdomainsAPI.getByProject(id).then(r => r.data.data).catch(e => {
          console.warn('Errore fetch subdomains for project', id, e);
          return [];
        }));
        const results = await Promise.all(promises);
        // flatten and set
        this.subdomains = results.flat();
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nel caricamento dei sottodomini';
        console.error('Errore fetchAllSubdomains:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchSubdomain(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await subdomainsAPI.getById(id);
        this.currentSubdomain = response.data.data;
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nel caricamento del sottodominio';
        console.error('Errore fetch sottodominio:', error);
      } finally {
        this.loading = false;
      }
    },

    async createSubdomain(projectId, subdomainData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await subdomainsAPI.create(projectId, subdomainData);
        this.subdomains.push(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nella creazione del sottodominio';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateSubdomain(id, subdomainData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await subdomainsAPI.update(id, subdomainData);
        const index = this.subdomains.findIndex(s => s._id === id);
        if (index !== -1) {
          this.subdomains[index] = response.data.data;
        }
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'aggiornamento del sottodominio';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteSubdomain(id) {
      this.loading = true;
      this.error = null;
      try {
        await subdomainsAPI.delete(id);
        this.subdomains = this.subdomains.filter(s => s._id !== id);
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'eliminazione del sottodominio';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});