import { defineStore } from 'pinia';
import { vulnerabilitiesAPI } from '@/services/api';

export const useSubdomainVulnsStore = defineStore('subdomainVulns', {
  state: () => ({
    vulnerabilities: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchVulnerabilities(subdomainId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await vulnerabilitiesAPI.getBySubdomain(subdomainId);
        this.vulnerabilities = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nel caricamento delle vulnerabilità';
        console.error('Errore fetch vulnerabilities:', error);
      } finally {
        this.loading = false;
      }
    },

    async addVulnerability(subdomainId, vulnData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await vulnerabilitiesAPI.create(subdomainId, vulnData);
        this.vulnerabilities.push(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'aggiunta della vulnerabilità';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateVulnerability(id, vulnData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await vulnerabilitiesAPI.update(id, vulnData);
        const index = this.vulnerabilities.findIndex(v => v._id === id);
        if (index !== -1) this.vulnerabilities[index] = response.data.data;
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'aggiornamento della vulnerabilità';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteVulnerability(id) {
      this.loading = true;
      this.error = null;
      try {
        await vulnerabilitiesAPI.delete(id);
        this.vulnerabilities = this.vulnerabilities.filter(v => v._id !== id);
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'eliminazione della vulnerabilità';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
