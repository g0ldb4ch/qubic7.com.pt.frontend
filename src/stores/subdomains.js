import { defineStore } from 'pinia';
import { subdomainsAPI, techStacksAPI, vulnerabilitiesAPI } from '@/services/api';

export const useSubdomainsStore = defineStore('subdomains', {
  state: () => ({
    subdomains: [],
    currentSubdomain: null,
    techStacks: [],
    vulnerabilities: [],
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

    async fetchSubdomain(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await subdomainsAPI.getById(id);
        this.currentSubdomain = response.data.data;
        this.techStacks = response.data.data.techStack || [];
        this.vulnerabilities = response.data.data.vulnerabilities || [];
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
    },

    async addTechStack(subdomainId, techData) {
      try {
        const response = await techStacksAPI.create(subdomainId, techData);
        this.techStacks.push(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'aggiunta della tecnologia';
        throw error;
      }
    },

    async deleteTechStack(id) {
      try {
        await techStacksAPI.delete(id);
        this.techStacks = this.techStacks.filter(t => t._id !== id);
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'eliminazione della tecnologia';
        throw error;
      }
    },

    async addVulnerability(subdomainId, vulnData) {
      try {
        const response = await vulnerabilitiesAPI.create(subdomainId, vulnData);
        this.vulnerabilities.push(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'aggiunta della vulnerabilità';
        throw error;
      }
    },

    async updateVulnerability(id, vulnData) {
      try {
        const response = await vulnerabilitiesAPI.update(id, vulnData);
        const index = this.vulnerabilities.findIndex(v => v._id === id);
        if (index !== -1) {
          this.vulnerabilities[index] = response.data.data;
        }
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'aggiornamento della vulnerabilità';
        throw error;
      }
    },

    async deleteVulnerability(id) {
      try {
        await vulnerabilitiesAPI.delete(id);
        this.vulnerabilities = this.vulnerabilities.filter(v => v._id !== id);
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'eliminazione della vulnerabilità';
        throw error;
      }
    }
  }
});